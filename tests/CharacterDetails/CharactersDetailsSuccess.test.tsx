import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CharacterDetails from '../../src/Components/CharactersDetails';
import { fetchCharacterDetails } from '../../src/Services/ApiUtility';

// Mock the API utility function
jest.mock('../../src/Services/ApiUtility', () => ({
  fetchCharacterDetails: jest.fn(),
}));

const queryClient = new QueryClient();

describe('CharacterDetails Component', () => {
  beforeEach(() => {
    // Clear all mocks between tests to avoid test pollution
    jest.clearAllMocks();
  });

  // Helper function to reset the render state before each test
  const customRender = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/details/1']}>
          <Routes>
            <Route path="/details/:id" element={<CharacterDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };

  it(
    'renders character details correctly', async () => {
    const mockCharacter = {
      name: 'Luke Skywalker',
      eye_color: 'blue',
      hair_color: 'blond',
      gender: 'male',
      homeworld: 'Tatooine',
      films: ['A New Hope', 'The Empire Strikes Back', 'Return of the Jedi'],
      starships: ['X-Wing', 'Imperial Shuttle'],
    };

    // Mock a successful API call
    (fetchCharacterDetails as jest.Mock).mockResolvedValueOnce(mockCharacter);

    customRender(); // Use custom render function to ensure a fresh start

    // Wait for the content to appear and verify the character details
    await waitFor(() => {
      expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
      expect(screen.getByText(/Eye color: blue/i)).toBeInTheDocument();
      expect(screen.getByText(/Hair color: blond/i)).toBeInTheDocument();
      expect(screen.getByText(/Tatooine/i)).toBeInTheDocument();
      expect(screen.getByText(/A New Hope/i)).toBeInTheDocument();
    });
  });
});
