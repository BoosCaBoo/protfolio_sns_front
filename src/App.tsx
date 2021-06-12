import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';

import styles from "./App.module.css"
import { Core } from './features/core/Core';

import theme from './theme/theme';



function App() {
  return (
    <ChakraProvider theme={theme}>
      <div className={styles.app}>
          <Core />
      </div>
    </ChakraProvider>
  );
}

export default App;
