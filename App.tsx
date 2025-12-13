import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { NavigationMain } from './src/app/naigation/MainNavigation';
import { ApolloProvider } from '@apollo/client/react';
import { authenticatedDummyClient, theme } from './src';

export default function App() {
  return (
    <ApolloProvider client={authenticatedDummyClient}>
      <NavigationContainer>
        <PaperProvider theme={theme}>
          <NavigationMain />
        </PaperProvider>
      </NavigationContainer>
    </ApolloProvider>
  );
}
