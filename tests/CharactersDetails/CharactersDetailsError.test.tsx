import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CharacterDetails from '../../src/Pages/CharactersDetails';

// Mock the entire `useQuery` hook
jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}));

const queryClient = new QueryClient();

const renderComponent = (id: string) => {
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[`/character/${id}`]}>
        <Routes>
          <Route path="/character/:id" element={<CharacterDetails />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('CharacterDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  test('renders error state when API call fails', async () => {
    // Mock useQuery to simulate an error in fetching character details
    (useQuery as jest.Mock).mockReturnValue({
      data: "undefined",
      isError: true,
      error: new Error('Error fetching character details'),
      isLoading: false,
    });

    // Render the component
    renderComponent('1');

    // Wait for the error state to be rendered
    await waitFor(() => {
      // Check if the error message is displayed
      // expect(screen.getByText('Error fetching character details')).toBeInTheDocument();
      expect(
        screen.getAllByText((_, element) => element?.textContent === 'Error fetching character details.')[0]
      ).toBeInTheDocument();
    });
  });

});
