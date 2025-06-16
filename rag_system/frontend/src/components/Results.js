import React from 'react';
import {
  Box,
  VStack,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Badge,
} from '@chakra-ui/react';

function Results({ results }) {
  return (
    <Box w="100%" p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">回答</Text>
        <Box p={4} bg="gray.50" borderRadius="md">
          <Text>{results.answer}</Text>
        </Box>

        <Text fontWeight="bold" fontSize="lg">参考来源</Text>
        <Accordion allowMultiple>
          {results.sources.map((source, index) => (
            <AccordionItem key={index}>
              <h2>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    来源 {index + 1}
                    <Badge ml={2} colorScheme="blue">
                      相似度: {(source.score * 100).toFixed(1)}%
                    </Badge>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Text whiteSpace="pre-wrap">{source.content}</Text>
                {source.metadata && (
                  <Box mt={2}>
                    <Text fontSize="sm" color="gray.500">
                      来源: {source.metadata.source}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      时间: {new Date(source.metadata.timestamp).toLocaleString()}
                    </Text>
                  </Box>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

        <Text fontSize="sm" color="gray.500">
          处理时间: {results.processing_time.toFixed(2)} 秒
        </Text>
      </VStack>
    </Box>
  );
}

export default Results; 