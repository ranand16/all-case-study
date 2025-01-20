import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import {api} from "../src/Services/ApiUtility"
import CharacterList from "../src/Components/CharactersList";

// Mock API calls
jest.mock('@src/Services/ApiUtility', () => ({
    fetchCharacters: jest.fn(),
}));

const mockCharacters = {
    count: 2,
    next: null,
    previous: null,
    results: [
        { name: 'Luke Skywalker', gender: 'male', url: '/1' },
        { name: 'Leia Organa', gender: 'female', url: '/2' },
    ],
};

const queryClient = new QueryClient();

const renderWithProviders = (ui: React.ReactElement) => {
    return render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>{ui}</MemoryRouter>
        </QueryClientProvider>
    );
};

describe('CharacterList Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('fetches and displays initial list of characters', async () => {
        (api.fetchCharacters as jest.Mock).mockResolvedValue(mockCharacters);

        renderWithProviders(<CharacterList />);

        // Verify API call
        expect(api.fetchCharacters).toHaveBeenCalledWith('', 1);

        // Wait for results to load
        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker (male)')).toBeInTheDocument();
            expect(screen.getByText('Leia Organa (female)')).toBeInTheDocument();
        });

        // Ensure pagination controls are present
        expect(screen.getByText('Previous')).toBeDisabled();
        expect(screen.getByText('Next')).toBeDisabled();
    });

    it('handles pagination correctly', async () => {
        const page2Characters = {
            count: 3,
            next: null,
            previous: '/api/characters?page=1',
            results: [{ name: 'Darth Vader', gender: 'male', url: '/3' }],
        };

        (api.fetchCharacters as jest.Mock).mockImplementation((_, page) => {
            if (page === 1) return Promise.resolve(mockCharacters);
            if (page === 2) return Promise.resolve(page2Characters);
            return Promise.resolve({ results: [] });
        });

        renderWithProviders(<CharacterList />);

        // Wait for initial data
        await waitFor(() => screen.getByText('Luke Skywalker (male)'));

        // Click Next
        fireEvent.click(screen.getByText('Next'));

        await waitFor(() => {
            expect(screen.getByText('Darth Vader (male)')).toBeInTheDocument();
        });

        // Click Previous
        fireEvent.click(screen.getByText('Previous'));

        await waitFor(() => {
            expect(screen.getByText('Luke Skywalker (male)')).toBeInTheDocument();
        });
    });

    it('filters characters based on search term', async () => {
        (api.fetchCharacters as jest.Mock).mockResolvedValue(mockCharacters);

        renderWithProviders(<CharacterList />);

        const searchInput = screen.getByPlaceholderText('Search characters');

        fireEvent.change(searchInput, { target: { value: 'Luke' } });

        await waitFor(() => {
            expect(api.fetchCharacters).toHaveBeenCalledWith('Luke', 1);
            expect(screen.getByText('Luke Skywalker (male)')).toBeInTheDocument();
        });

        fireEvent.change(searchInput, { target: { value: '' } });

        await waitFor(() => {
            expect(api.fetchCharacters).toHaveBeenCalledWith('', 1);
        });
    });

    it('navigates to character details page on card click', async () => {
        (api.fetchCharacters as jest.Mock).mockResolvedValue(mockCharacters);

        renderWithProviders(<CharacterList />);

        await waitFor(() => screen.getByText('Luke Skywalker (male)'));

        fireEvent.click(screen.getByText('Luke Skywalker (male)'));

        expect(window.location.pathname).toBe('/details/1');
    });
});
