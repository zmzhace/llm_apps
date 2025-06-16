import React, { useState, useEffect } from 'react';
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
  Button,
  HStack,
  Select,
  useToast,
} from '@chakra-ui/react';

function History() {
  const [history, setHistory] = useState({});
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [exportFormat, setExportFormat] = useState('json');
  const toast = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/history');
      if (!response.ok) throw new Error('获取历史记录失败');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      toast({
        title: '错误',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleExport = async () => {
    if (!selectedBatch) return;

    try {
      const response = await fetch('http://localhost:8000/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          batch_id: selectedBatch,
          format: exportFormat,
        }),
      });

      if (!response.ok) throw new Error('导出失败');

      // 创建下载链接
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `export_${selectedBatch}.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: '成功',
        description: '导出成功',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: '错误',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="100%" p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">历史记录</Text>

        <HStack>
          <Select
            placeholder="选择批次"
            value={selectedBatch || ''}
            onChange={(e) => setSelectedBatch(e.target.value)}
          >
            {Object.keys(history).map((batchId) => (
              <option key={batchId} value={batchId}>
                {batchId} ({history[batchId].length} 条记录)
              </option>
            ))}
          </Select>

          <Select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            w="150px"
          >
            <option value="json">JSON</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
          </Select>

          <Button
            colorScheme="blue"
            onClick={handleExport}
            isDisabled={!selectedBatch}
          >
            导出
          </Button>
        </HStack>

        {selectedBatch && history[selectedBatch] && (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>时间</Th>
                <Th>处理时间</Th>
                <Th>提取字段数</Th>
              </Tr>
            </Thead>
            <Tbody>
              {history[selectedBatch].map((record, index) => (
                <Tr key={index}>
                  <Td>{new Date(record.timestamp).toLocaleString()}</Td>
                  <Td>{record.processing_time.toFixed(2)}秒</Td>
                  <Td>{Object.keys(record.extracted_data).length}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Box>
  );
}

export default History; 