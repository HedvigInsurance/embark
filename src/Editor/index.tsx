import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'
import { Button, Heading, Box } from 'rebass'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { NavBar } from './NavBar'
import { theme } from './theme'
import { Flows } from './Flows'
import { Flow } from './Flows/Flow'

const client = new ApolloClient({
  uri: '/editor-graphql',
  cache: new InMemoryCache(),
})

export const Editor = () => {
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <Router>
          <Switch>
            <Route path="/" exact>
              <Button
                variant="primary"
                mr={2}
                onClick={() => {
                  location.href = '/auth/google'
                }}
              >
                Login
              </Button>
            </Route>
            <Route path="/editor">
              <NavBar />
              <Route exact path="/editor">
                <Box
                  p={5}
                  fontSize={4}
                  width={[1, 1, 1 / 2]}
                  color="white"
                  bg="primary"
                >
                  <Heading fontSize={[5, 6, 7]} color="white">
                    Welcome to Embark
                  </Heading>
                </Box>
              </Route>
              <Route exact path="/editor/flows">
                <Flows />
              </Route>
              <Route exact path="/editor/flows/:name">
                <Flow />
              </Route>
            </Route>
          </Switch>
        </Router>
      </ApolloProvider>
    </ThemeProvider>
  )
}
