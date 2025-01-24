import { render, screen } from '@testing-library/react';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { CharacterData } from '../../src/Helper/Interfaces';
import Favourites from '../../src/Pages/FavoriteCharacters';
const queryClient = new QueryClient();
const renderFavComponent = () => {
    return render(
        <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/favourites`]}>
            <Routes>
            <Route path="/favourites" element={<Favourites />} />
            </Routes>
        </MemoryRouter>
        </QueryClientProvider>
    );
};


    const mockCharacters: Record<string, CharacterData> = {
        'Luke Skywalker': { name: 'Luke Skywalker', homeworld: 'Tatooine', films: [], starships: [], gender: 'male', hair_color: 'blond', eye_color: 'blue', height: '172', url: "" },
        'Darth vader': { name: 'Darth vader', homeworld: 'Tatooine', films: [], starships: [], gender: 'male', hair_color: 'blond', eye_color: 'blue', height: '172', url: "" },
    };

jest.mock('../../src/Hooks/useFavoritesStore', () => {
    const originalModule = jest.requireActual('../../src/Hooks/useFavoritesStore');
    return {
        __esModule: true,
        ...originalModule,
        default: jest.fn(() => ({
            favorites: { ...mockCharacters },
        })),
    };
});
describe('Favorites Component', () => {
    
    it('renders favorite characters', () => {
        renderFavComponent();

        expect(
            screen.getAllByText((_, element) => element?.textContent === 'Luke Skywalker')[0]
        ).toBeInTheDocument();
        expect(
            screen.getAllByText((_, element) => element?.textContent === "Remove all Favourites")[0]
        ).toBeInTheDocument();
        // expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
        // expect(screen.getByText(/remove all favourites/i)).toBeInTheDocument();
    });
    // afterEach(()=>{
    //     jest.clearAllMocks(); // Clears any mocked calls, reset the mock state
    //     cleanup(); 
    // })
});


// describe('Favorites Component empty state', () => {
//     beforeEach(()=>{
//         jest.mock('../../src/Hooks/useFavoritesStore', () => {
//             const originalModule = jest.requireActual('../../src/Hooks/useFavoritesStore');
//             return {
//                 __esModule: true,
//                 ...originalModule,
//                 default: jest.fn(() => ({
//                     favorites: {  },
//                 })),
//             };
//         });
//     })
//     it('renders empty result', () => {
//         renderFavComponent();

//         expect(
//             screen.getAllByText((_, element) => element?.textContent === 'No favourites added yet.')[0]
//         ).toBeInTheDocument();
//     });
    
//     afterEach(()=>{
//         jest.clearAllMocks(); // Clears any mocked calls, reset the mock state
//         cleanup(); 
//     })
// });