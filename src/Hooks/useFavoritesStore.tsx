import { CharacterData } from '@src/Components/CharactersList';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
    favorites: Record<string, CharacterData>; // Stores characters by name
    addFavorite: (character: CharacterData) => void;
    removeFavorite: (name: string) => void;
    toggleFavorite: (character: CharacterData) => void;
    resetFavorites: () => void;
}

const useFavoritesStore = create<FavoritesState>()(
    persist(
        (set, get) => ({
            favorites: {},

            addFavorite: (character: CharacterData) =>
                set((state) => ({
                    favorites: { ...state.favorites, [character.name]: character },
                })),

            removeFavorite: (name: string) =>
                set((state) => {
                    const updatedFavorites = { ...state.favorites };
                    delete updatedFavorites[name];
                    return { favorites: updatedFavorites };
                }),

            toggleFavorite: (character: CharacterData) => {
                const { favorites, addFavorite, removeFavorite } = get();
                if (favorites[character.name]) {
                    removeFavorite(character.name);
                } else {
                    addFavorite(character);
                }
            },

            resetFavorites: () => set({ favorites: {} }),
        }),
        {
            name: 'favorites-storage', // Key in localStorage
        }
    )
);

export default useFavoritesStore;
