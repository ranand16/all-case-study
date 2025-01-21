import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FULFILLED } from '../Helper/constants';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import { fetchHomeworld } from '../Services/ApiUtility';

const Favourites: React.FC = () => {
    const { favorites, removeFavorite, resetFavorites } = useFavoritesStore();
    const [loading, setLoading] = useState(false);

    const { favoriteCharacters, uniqueHomeworlds, homeworldData } = useMemo(() => {
        const characters = Object.values(favorites);
        const uniqueUrls = Array.from(
            new Set(characters.map((char) => char.homeworld).filter(Boolean))
        );

        const homeworldData = uniqueUrls.reduce((acc, url) => {
            acc[url] = null; // Initialize homeworld as null
            return acc;
        }, {} as Record<string, string>);

        return { favoriteCharacters: characters, uniqueHomeworlds: uniqueUrls, homeworldData };
    }, [favorites]);

    const fetchHomeworlds = useCallback(async () => {
        setLoading(true);
        try {
            const homeworldResponses = await Promise.allSettled(
                uniqueHomeworlds.map(async (url) => {
                    let data;
                    if (!homeworldData[url]) {
                        const homeworldName = await fetchHomeworld(url);
                        data = { url, name: homeworldName };
                    } else {
                        data = { url, name: homeworldData[url] };
                    }
                    return data;
                })
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            homeworldResponses.forEach(({ status = FULFILLED, value = { url:"", name: "" } }: { status: any, value: {url: string, name: string} }) => {
                if (status === FULFILLED) {
                    const { url, name } = value;
                    homeworldData[url] = name;
                }
            });
        } catch (error) {
            console.error('Error fetching homeworlds:', error);
        } finally {
            setLoading(false);
        }
    }, [uniqueHomeworlds, homeworldData]);

    useEffect(() => {
        if (uniqueHomeworlds.length > 0) {
            fetchHomeworlds();
        }
    }, []);

    const handleRemoveFavorite = useCallback(
        (charName: string) => {
            removeFavorite(charName);
        },
        [removeFavorite]
    );

    return (
        <main>
            <h1 id="favorites-title">Favourites List</h1>
            {favoriteCharacters.length === 0 ? (
                <p aria-live="polite">No favorites added yet.</p>
            ) : (
                <section aria-labelledby="favorites-title">
                    <ul>
                        {favoriteCharacters.map((character) => (
                            <EachFavourite
                                key={character.name}
                                loading={loading}
                                character={character}
                                homeworldData={homeworldData}
                                handleRemoveFavorite={handleRemoveFavorite}
                            />
                        ))}
                    </ul>
                </section>
            )}
            <button
                onClick={resetFavorites}
                disabled={loading}
                aria-busy={loading}
                aria-label="Purge all favorites"
            >
                {loading ? 'Loading...' : 'Purge Favorites'}
            </button>
        </main>
    );
};

export default Favourites;

interface EachFavoriteProps {
    character: {
        name: string;
        gender: string;
        height: string;
        homeworld: string;
    };
    loading: boolean;
    homeworldData: Record<string, string>;
    handleRemoveFavorite: (charName: string) => void;
}

export function EachFavourite({
    loading,
    character,
    homeworldData,
    handleRemoveFavorite,
}: EachFavoriteProps) {
    return (
        <li key={character.name}>
            <strong>{character.name}</strong> ({character.gender})
            <br />
            <span>Height: {character.height}</span>
            <br />
            <span>
                Home Planet:{' '}
                {homeworldData[character.homeworld] || (loading ? 'Loading...' : 'Unknown')}
            </span>
            <br />
            <button
                onClick={() => handleRemoveFavorite(character.name)}
                aria-label={`Remove ${character.name} from favorites`}
            >
                Remove
            </button>
        </li>
    );
}
