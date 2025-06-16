import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  Text,
} from '@chakra-ui/react';

function QueryForm({ onSubmit, isLoading }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query);
      setQuery('');
    }
  };

  return (
    <Box w="100%" p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text fontWeight="bold">提问</Text>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="请输入您的问题..."
            size="lg"
          />
          <Button
            type="submit"
            colorScheme="green"
            isLoading={isLoading}
            loadingText="思考中..."
            w="100%"
          >
            提交
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default QueryForm; 