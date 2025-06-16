import React from 'react';
import {
  Box,
  VStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Progress,
} from '@chakra-ui/react';

function Results({ results }) {
  return (
    <Box w="100%" p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">提取结果</Text>
        
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>字段</Th>
              <Th>值</Th>
              <Th>置信度</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(results.extracted_data).map(([key, value]) => (
              <Tr key={key}>
                <Td>{key}</Td>
                <Td>{JSON.stringify(value)}</Td>
                <Td>
                  <Box>
                    <Progress
                      value={results.confidence_scores[key] * 100}
                      colorScheme={
                        results.confidence_scores[key] > 0.8
                          ? "green"
                          : results.confidence_scores[key] > 0.5
                          ? "yellow"
                          : "red"
                      }
                    />
                    <Text fontSize="sm" mt={1}>
                      {(results.confidence_scores[key] * 100).toFixed(1)}%
                    </Text>
                  </Box>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Text fontSize="sm" color="gray.500">
          处理时间: {results.processing_time.toFixed(2)} 秒
        </Text>
      </VStack>
    </Box>
  );
}

export default Results; 