import React from 'react'
import { Flex, Text, Box } from 'rebass'
import { Link } from 'react-router-dom'

export const NavBar = () => (
  <Flex px={2} color="white" bg="black" alignItems="center">
    <Text p={2} fontWeight="bold">
      Embark
    </Text>
    <Box mx="auto" />
    <Link to="/editor/flows">
      <Text p={2} fontWeight="bold">
        Flows
      </Text>
    </Link>
  </Flex>
)
