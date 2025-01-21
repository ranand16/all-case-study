import React from 'react';

import { ChakraProvider } from '@chakra-ui/react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App';
import './index.css';

const queryClient = new QueryClient();
const root = document.getElementById('root')
const reactApp = createRoot(root);
reactApp.render(
    <QueryClientProvider client={queryClient}>
        <ChakraProvider>
            <App />
        </ChakraProvider>
    </QueryClientProvider>
);


