import os
from typing import Optional
import requests
from .config import settings

class LLMService:
    def __init__(self):
        self.api_key = settings.API_KEY
        self.api_url = "https://api.openai.com/v1/chat/completions"
        self.model = "gpt-3.5-turbo"

    def generate(self, prompt: str) -> str:
        """生成文本响应"""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": "你是一个有帮助的AI助手。"},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        try:
            response = requests.post(self.api_url, headers=headers, json=data)
            response.raise_for_status()
            return response.json()["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"Error generating response: {e}")
            return "抱歉，生成回答时出现错误。" 