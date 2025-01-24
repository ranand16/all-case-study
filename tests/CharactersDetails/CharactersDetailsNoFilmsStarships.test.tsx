import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CharacterDetails from '../../src/Pages/CharactersDetails';
import {
  CharacterData,
  fetchCharacterDetails,
  fetchCharacterFilms,
  fetchHomeWorldDetails,
  fetchStarshipDetails,
} from '../../src/Services/ApiUtility';

jest.mock('../../src/Services/ApiUtility');

const mockFetchCharacterDetails = fetchCharacterDetails as jest.Mock;
const mockFetchHomeWorldDetails = fetchHomeWorldDetails as jest.Mock;
const mockFetchCharacterFilms = fetchCharacterFilms as jest.Mock;
const mockFetchStarshipDetails = fetchStarshipDetails as jest.Mock;

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
  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  test('renders no films or starships', async () => {
    const mockCharacter: CharacterData = {
      name: 'Leia Organa',
      eye_color: 'brown',
      hair_color: 'brown',
      gender: 'female',
      homeworld: 'https://swapi.dev/api/planets/2/',
      films: [],
      starships: [],
      height: '150',
      url: '',
    };

    const mockHomeworld = 'Alderaan';

    mockFetchCharacterDetails.mockResolvedValueOnce(mockCharacter);
    mockFetchHomeWorldDetails.mockResolvedValueOnce(mockHomeworld);

    renderComponent('2');

    // Assert that the "No films available" and "No starships available" messages are displayed
    await waitFor(() => {
      expect(screen.getByText('Leia Organa')).toBeInTheDocument();
      expect(screen.getByText('No films available for this character.')).toBeInTheDocument();
      expect(screen.getByText('No starships available for this character.')).toBeInTheDocument();
    });
  });
});
