// CharacterList.test.tsx
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { CharacterListApiResponse } from '../../src/Helper/Interfaces';
import CharacterList from "../../src/Pages/CharactersList";
import { fetchCharacters } from '../../src/Services/ApiUtility';

// Mock the fetchCharacters API
jest.mock('../../src/Services/ApiUtility');

const queryClient = new QueryClient();

describe('CharacterList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render character search input', async () => {
        const mockResponse: CharacterListApiResponse = {
            count: 0,
            next: null,
            previous: null,
            isFetching: false,
            isError: false,
            error: null,
            results: [],
        };

        (fetchCharacters as jest.Mock).mockResolvedValue(mockResponse);

        await act(() => render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/?search=Luke&page=1']}>
                    <CharacterList />
                </MemoryRouter>
            </QueryClientProvider>
        ));

        const searchInput = screen.getByPlaceholderText(/search characters/i);
        expect(searchInput).toBeInTheDocument();
    });

    it('should show loading spinner during fetch', async () => {
        const mockResponse: CharacterListApiResponse = {
            count: 0,
            next: null,
            previous: null,
            isFetching: false,
            isError: false,
            error: null,
            results: [],
        };

        (fetchCharacters as jest.Mock).mockResolvedValue(mockResponse);

        // (fetchCharacters as jest.Mock).mockReturnValue(new Promise(() => ({}))); // simulate a pending promise
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/?search=Luke&page=1']}>
                    <CharacterList />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const progress = screen.getByRole('progressbar');
        expect(progress).toBeInTheDocument();
    });

    it('should display characters when fetch is successful', async () => {
        const mockResponse: CharacterListApiResponse = {
            count: 1,
            next: null,
            previous: null,
            isFetching: false,
            isError: false,
            error: null,
            results: [{ 
                eye_color: "shiny",hair_color: "brown",gender: "male",films: ["",""],starships: ["",""],name: 'Luke Skywalker', height: '172', homeworld: 'Tatooine', url: '/api/people/1/' 
            }],
        };

        (fetchCharacters as jest.Mock).mockResolvedValue(mockResponse);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/?search=Luke&page=1']}>
                    <CharacterList />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => expect(fetchCharacters).toHaveBeenCalled());

        const characterElement = screen.getByText(/Luke Skywalker/i);
        expect(characterElement).toBeInTheDocument();
    });

    // it('should show an error message if fetching characters fails', async () => {
    //     const mockResponse: CharacterListApiResponse = {
    //         count: 0,
    //         next: null,
    //         previous: null,
    //         isFetching: false,
    //         isError: true,
    //         error: new Error('Failed to fetch characters and homeworlds'),
    //         results: []
    //     };
    //     (fetchCharacters as jest.Mock).mockRejectedValue(mockResponse);

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter initialEntries={['/?search=Luke&page=1']}>
    //                 <CharacterList />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     // await act(async () => {
    //         await waitFor(() => expect(fetchCharacters).toHaveBeenCalled());
    //     // });
    //     // await act(async () => {
    //         const errorMessage = screen.getByRole('alert');
    //         expect(errorMessage).toHaveTextContent(/error fetching characters/i);
    //     // });
    // });

    it('should handle search input change', async () => {
        const mockResponse: CharacterListApiResponse = {
            count: 22,
            next: '/api/people/?page=2',
            previous: null,
            isFetching: false,
            isError: false,
            error: undefined,
            results: [{ 
                eye_color: "shiny",hair_color: "brown",gender: "male",films: ["",""],starships: ["",""],name: 'Luke Skywalker', height: '172', homeworld: 'Tatooine', url: '/api/people/1/'
            }],
        };
        (fetchCharacters as jest.Mock).mockResolvedValueOnce(mockResponse);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={['/?search=Luke&page=1']}>
                    <CharacterList />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const searchInput = screen.getByPlaceholderText(/search characters/i);
        fireEvent.change(searchInput, { target: { value: 'Luke' } });

        expect(searchInput).toHaveValue('Luke');

        await waitFor(() => expect(fetchCharacters).toHaveBeenCalledTimes(1));

        const characterElement = await screen.findByText(/Luke Skywalker/i);
        expect(characterElement).toBeInTheDocument();
    });


    // it('should handle pagination', async () => {
    //     const mockResponse: CharacterListApiResponse = {
    //         count: 1,
    //         next: '/api/people/?page=2',
    //         previous: null,
    //         isFetching: false,
    //         isError: false,
    //         error: undefined,
    //         results: [{ 
    //             eye_color: "shiny",hair_color: "brown",gender: "male",films: ["",""],starships: ["",""],name: 'Luke Skywalker', height: '172', homeworld: 'Tatooine', url: '/api/people/1/'
    //         }],
    //     };

    //     (fetchCharacters as jest.Mock).mockResolvedValue(mockResponse);

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter initialEntries={['/?search=Luke&page=1']}>
    //                 <CharacterList />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => expect(fetchCharacters).toHaveBeenCalled());

    //     const nextPageButton = screen.getByRole('button', { name: /next/i });
    //     fireEvent.click(nextPageButton);

    //     // Check if the next page fetch is triggered
    //     expect(fetchCharacters).toHaveBeenCalledWith('', 2);
    // });
});