import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import CharacterList, { CharactersData } from '../../src/Components/CharactersList';
import { fetchCharacters } from '../../src/Services/ApiUtility';

export const api = {
    fetchCharacters: jest.fn()
};

// Mock fetchCharacters
jest.mock('../../src/Services/ApiUtility', () => ({
    fetchCharacters: jest.fn(),
}));

// Mock useFavoritesStore
jest.mock('../../src/Hooks/useFavoritesStore', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        favorites: {},
        toggleFavorite: jest.fn(),
    })),
}));

const queryClient = new QueryClient();

describe('CharacterList', () => {
    it('renders character list and handles pagination', async () => {
        const mockResponse: CharactersData = {
            count: 2,
            next: null,
            previous: null,
            results: [
                {
                    name: 'Luke Skywalker',
                    url: 'https://swapi.dev/api/people/1/',
                    eye_color: 'blue',
                    hair_color: 'blond',
                    gender: 'male',
                    homeworld: 'https://swapi.dev/api/planets/1/',
                    films: [],
                    starships: [],
                    height: ""
                },
                {
                    name: 'Leia Organa',
                    url: 'https://swapi.dev/api/people/5/',
                    eye_color: 'brown',
                    hair_color: 'brown',
                    gender: 'female',
                    homeworld: 'https://swapi.dev/api/planets/2/',
                    films: [],
                    starships: [],
                    height: ""
                },
            ],
        };

        (fetchCharacters as jest.Mock).mockResolvedValueOnce(mockResponse);

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <CharacterList />
                </Router>
            </QueryClientProvider>
        );

        // Check if loading state is displayed
        expect(screen.getByText(/loading/i)).toBeInTheDocument();

        // Wait for characters to be displayed
        const character1 = await screen.findByText(/Luke Skywalker/i);
        const character2 = await screen.findByText(/Leia Organa/i);

        expect(character1).toBeInTheDocument();
        expect(character2).toBeInTheDocument();

        // Check pagination buttons
        const prevButton = screen.getByText(/previous/i);
        const nextButton = screen.getByText(/next/i);

        expect(prevButton).toBeDisabled();
        expect(nextButton).toBeDisabled();
    });
});
