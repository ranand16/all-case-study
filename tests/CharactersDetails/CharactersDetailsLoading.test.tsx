import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import CharacterDetails from '../../src/Pages/CharactersDetails';
import {
  fetchCharacterDetails,
  fetchCharacterFilms,
  fetchHomeWorldDetails,
  fetchStarshipDetails
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

  test('renders loading state', async () => {
    mockFetchCharacterDetails.mockImplementationOnce(() => new Promise(() => {})); // Keeps loading state active

    renderComponent('1');

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
