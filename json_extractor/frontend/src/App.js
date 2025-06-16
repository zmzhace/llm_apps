import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  VStack,
  Heading,
  Text,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import JsonInput from './components/JsonInput';
import RulesInput from './components/RulesInput';
import Results from './components/Results';
import History from './components/History';

function App() {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const handleExtract = async (jsonData, rules, customPrompt, isBatch = false) => {
    setIsLoading(true);
    try {
      const endpoint = isBatch ? '/batch-extract' : '/extract';
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          isBatch
            ? {
                json_data_list: jsonData,
                extraction_rules: rules,
                custom_prompt: customPrompt,
              }
            : {
                json_data: jsonData,
                extraction_rules: rules,
                custom_prompt: customPrompt,
              }
        ),
      });

      if (!response.ok) {
        throw new Error('提取失败');
      }

      const data = await response.json();
      setResults(data);
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
    <ChakraProvider>
      <Box minH="100vh" bg="gray.50" py={10}>
        <VStack spacing={8} maxW="1200px" mx="auto" px={4}>
          <Heading>JSON数据提取工具</Heading>
          <Text>输入JSON数据和提取规则，系统将自动提取所需信息</Text>
          
          <Tabs isFitted variant="enclosed" w="100%">
            <TabList mb="1em">
              <Tab>提取</Tab>
              <Tab>历史记录</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={8}>
                  <JsonInput onExtract={handleExtract} isLoading={isLoading} />
                  <RulesInput />
                  {results && <Results results={results} />}
                </VStack>
              </TabPanel>
              
              <TabPanel>
                <History />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Box>
    </ChakraProvider>
  );
}

export default App; 