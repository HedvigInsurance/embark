import React from 'react'
import { Box, Heading, Text } from 'rebass'
import { Link } from 'react-router-dom'

export const Flows = () => (
  <Box p={5} fontSize={4} width={[1, 1, 1 / 2]} color="white" bg="primary">
    <Heading fontSize={[5, 6, 7]} color="white">
      Flows
    </Heading>
    <Link to="/editor/flows/abc">
      <Text p={2} fontWeight="bold">
        Abc
      </Text>
    </Link>
  </Box>
)
