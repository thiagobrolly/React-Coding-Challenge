import { Box, Flex } from '@chakra-ui/react';
import React from 'react';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <Flex p="24px" alignItems="center" justifyContent="center" h="100vh">
      <Box
        bg="gray.800"
        p="32px"
        borderRadius="10px"
        maxW="100%"
        w="1200px"
        boxShadow="2px 2px 20px rgba(0, 0, 0, 0.05)"
      >
        {children}
      </Box>
    </Flex>
  );
}
