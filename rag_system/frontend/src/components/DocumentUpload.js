import React, { useState } from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  useToast,
  Text,
} from '@chakra-ui/react';

function DocumentUpload() {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast({
        title: '错误',
        description: '请输入文档内容',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            content: content,
            metadata: {
              source: 'manual_input',
              timestamp: new Date().toISOString(),
            },
          },
        ]),
      });

      if (!response.ok) {
        throw new Error('上传失败');
      }

      const data = await response.json();
      toast({
        title: '成功',
        description: data.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setContent('');
    } catch (error) {
      toast({
        title: '错误',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box w="100%" p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <VStack spacing={4}>
        <Text fontWeight="bold">上传文档</Text>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="请输入文档内容..."
          size="lg"
          rows={6}
        />
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="上传中..."
        >
          上传
        </Button>
      </VStack>
    </Box>
  );
}

export default DocumentUpload; 