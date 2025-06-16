import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface Message {
  content: string;
  sender: 'user' | 'ai';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      content: input,
      sender: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL || 'http://localhost:5000/api/chat',
        { message: input }
      );

      const aiMessage: Message = {
        content: response.data.choices[0].message.content,
        sender: 'ai'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        content: '抱歉，发生错误，请稍后重试。',
        sender: 'ai'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <h1>AI 聊天助手</h1>
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender}-message`}>
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="message ai-message loading">
              正在思考...
            </div>
          )}
        </div>
        <div className="input-container">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入您的问题..."
            disabled={isLoading}
          />
          <button onClick={sendMessage} disabled={isLoading}>
            发送
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;