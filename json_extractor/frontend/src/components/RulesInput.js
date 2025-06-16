import React, { useState } from 'react';
import {
  Box,
  Button,
  Textarea,
  VStack,
  Text,
  IconButton,
  HStack,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

function RulesInput() {
  const [rules, setRules] = useState(['']);

  const addRule = () => {
    setRules([...rules, '']);
  };

  const removeRule = (index) => {
    const newRules = rules.filter((_, i) => i !== index);
    setRules(newRules);
  };

  const updateRule = (index, value) => {
    const newRules = [...rules];
    newRules[index] = value;
    setRules(newRules);
  };

  return (
    <Box w="100%" p={5} shadow="md" borderWidth="1px" borderRadius="md" bg="white">
      <VStack spacing={4}>
        <Text fontWeight="bold">提取规则</Text>
        {rules.map((rule, index) => (
          <HStack key={index} w="100%">
            <Textarea
              value={rule}
              onChange={(e) => updateRule(index, e.target.value)}
              placeholder={`规则 ${index + 1}`}
              size="md"
            />
            <IconButton
              icon={<DeleteIcon />}
              onClick={() => removeRule(index)}
              colorScheme="red"
              variant="ghost"
            />
          </HStack>
        ))}
        <Button
          leftIcon={<AddIcon />}
          onClick={addRule}
          colorScheme="green"
          variant="outline"
          w="100%"
        >
          添加规则
        </Button>
      </VStack>
    </Box>
  );
}

export default RulesInput; 