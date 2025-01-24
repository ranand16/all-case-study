import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CharacterData } from '../../src/Helper/Interfaces';
import CharacterDetails from '../../src/Pages/CharactersDetails';
import {
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
  return render(
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
  test('renders character details successfully', async () => {
    const mockCharacter: CharacterData = {
      name: 'Luke Skywalker',
      eye_color: 'blue',
      hair_color: 'blond',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      films: ['https://swapi.dev/api/films/1/'],
      starships: ['https://swapi.dev/api/starships/1/'],
      height: '172',
      url: '',
    };

    const mockHomeworld = 'Tatooine';
    const mockFilms = ['A New Hope'];
    const mockStarships = ['X-wing'];

    mockFetchCharacterDetails.mockResolvedValueOnce(mockCharacter);
    mockFetchHomeWorldDetails.mockResolvedValueOnce(mockHomeworld);
    mockFetchCharacterFilms.mockResolvedValueOnce(mockFilms);
    mockFetchStarshipDetails.mockResolvedValueOnce(mockStarships);

    renderComponent('1');

    // Assert that character details are rendered correctly
    await waitFor(() => {
      // Name
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();

      // Hair Color (nested text)
      expect(
        screen.getByText((_, element) =>
          element?.textContent === 'Hair Color: blond'
        )
      ).toBeInTheDocument();

      // Eye Color
      expect(
        screen.getByText((_, element) => element?.textContent === 'Eye Color: blue')
      ).toBeInTheDocument();

      // Gender
      expect(
        screen.getByText((_, element) => element?.textContent === 'Gender: male')
      ).toBeInTheDocument();

      // Homeworld
      expect(
        screen.getByText((_, element) =>
          element?.textContent === 'Home Planet: Tatooine'
        )
      ).toBeInTheDocument();
    });
  });


  test('renders character details with the character already in favorites', async () => {
    const mockCharacter: CharacterData = {
      name: 'Luke Skywalker',
      eye_color: 'blue',
      hair_color: 'blond',
      gender: 'male',
      homeworld: 'https://swapi.dev/api/planets/1/',
      films: ['https://swapi.dev/api/films/1/'],
      starships: ['https://swapi.dev/api/starships/1/'],
      height: '172',
      url: '',
    };

    const mockHomeworld = 'Tatooine';
    const mockFilms = ['A New Hope'];
    const mockStarships = ['X-wing'];

    mockFetchCharacterDetails.mockResolvedValueOnce(mockCharacter);
    mockFetchHomeWorldDetails.mockResolvedValueOnce(mockHomeworld);
    mockFetchCharacterFilms.mockResolvedValueOnce(mockFilms);
    mockFetchStarshipDetails.mockResolvedValueOnce(mockStarships);

    // Mock useFavoritesStore to include the character in favorites
    jest.mock('../../src/Hooks/useFavoritesStore', () => {
      const originalModule = jest.requireActual('../../src/Hooks/useFavoritesStore');
      return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => ({
          favorites: { [mockCharacter.name]: mockCharacter },
        })),
      };
    });

    renderComponent('1');

    // Assert that character details are rendered correctly
    await waitFor(() => {
      // Check if the favorite button shows the character is favorited
      const favoriteButton = screen.getByRole('button', { name: `Favorite ${mockCharacter.name}` });
      expect(favoriteButton).toBeInTheDocument();
      fireEvent.click(favoriteButton);
    });
  });
});
