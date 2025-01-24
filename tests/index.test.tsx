// src/App.test.tsx

import { ChakraProvider } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from '../src/App';

const queryClient = new QueryClient();

describe('App Component', () => {
    it('renders correctly', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <ChakraProvider>
                    <App />
                </ChakraProvider>
            </QueryClientProvider>
        );

        expect(screen.getByText(/Star wars world/i)).toBeInTheDocument();
        expect(screen.getByText(/favourites/i)).toBeInTheDocument();
    });
});