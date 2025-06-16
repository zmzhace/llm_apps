import React, { useState } from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  useToast,
  Text,
  Input,
  HStack,
  Switch,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';

function JsonInput({ onExtract, isLoading }) {
  const [jsonData, setJsonData] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isBatchMode, setIsBatchMode] = useState(false);
  const toast = useToast();

  const handleSubmit = () => {
    try {
      if (isBatchMode) {
        // 批量模式：每行一个JSON
        const jsonLines = jsonData.split('\n').filter(line => line.trim());
        const jsonDataList = jsonLines.map(line => JSON.parse(line));
        onExtract(jsonDataList, [], customPrompt, true);
      } else {
        // 单条模式
        const parsedJson = JSON.parse(jsonData);
        onExtract(parsedJson, [], customPrompt, false);
      }
    } catch (error) {
      toast({
        title: '错误',
        description: '请输入有效的JSON数据',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100%" p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <VStack spacing={4}>
        <HStack w="100%" justify="space-between">
          <Text fontWeight="bold">JSON数据</Text>
          <FormControl display="flex" alignItems="center" w="auto">
            <FormLabel htmlFor="batch-mode" mb="0">
              批量模式
            </FormLabel>
            <Switch
              id="batch-mode"
              isChecked={isBatchMode}
              onChange={(e) => setIsBatchMode(e.target.checked)}
            />
          </FormControl>
        </HStack>

        <Textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          placeholder={isBatchMode ? "每行输入一个JSON数据..." : "请输入JSON数据..."}
          size="lg"
          rows={10}
          fontFamily="monospace"
        />
        
        <Text fontWeight="bold">自定义提示（可选）</Text>
        <Input
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="输入额外的提取要求..."
        />
        
        <Button
          colorScheme="blue"
          onClick={handleSubmit}
          isLoading={isLoading}
          loadingText="提取中..."
          w="100%"
        >
          {isBatchMode ? "批量提取" : "开始提取"}
        </Button>
      </VStack>
    </Box>
  );
}

export default JsonInput; 