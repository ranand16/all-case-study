import useFavoritesStore from '@src/Hooks/useFavoritesStore';
import { fetchHomeworld } from '@src/Services/ApiUtility';
import React, { useEffect, useMemo, useState } from 'react';

const Favourites: React.FC = () => {
    const { favorites, removeFavorite, resetFavorites } = useFavoritesStore();
    const [loading, setLoading] = useState(false);

    // Use one memoized structure for both characters and homeworlds
    const { favoriteCharacters, uniqueHomeworlds, homeworldData } = useMemo(() => {
        const characters = Object.values(favorites);
        const uniqueUrls = Array.from(
            new Set(characters.map((char) => char.homeworld).filter(Boolean))
        );
        return {
            favoriteCharacters: characters,
            uniqueHomeworlds: uniqueUrls,
            homeworldData: uniqueUrls.reduce((acc, url) => {
                acc[url] = null; // Initialize homeworld as null
                return acc;
            }, {} as Record<string, string>),
        };
    }, [favorites]);

    useEffect(() => {
        const fetchHomeworlds = async () => {
            setLoading(true);

            try {
                const homeworldResponses = await Promise.all(
                    uniqueHomeworlds.map(async (url) => {
                        if (!homeworldData[url]) {
                            const homeworldName = await fetchHomeworld(url);
                            return { url, name: homeworldName };
                        }
                        return { url, name: homeworldData[url] };
                    })
                );

                homeworldResponses.forEach(({ url, name }) => {
                    homeworldData[url] = name;
                });
            } catch (error) {
                console.error('Error fetching homeworlds:', error);
            } finally {
                setLoading(false);
            }
        };

        if (uniqueHomeworlds.length > 0) fetchHomeworlds();
    }, [uniqueHomeworlds, homeworldData]);

    return (
        <div>
            <h1>Favourites List</h1>
            {favoriteCharacters.length === 0 ? (
                <p>No favorites added yet.</p>
            ) : (
                <ul>
                    {favoriteCharacters.map((char) => (
                        <li key={char.name}>
                            <strong>{char.name}</strong> ({char.gender})<br />
                            <span>Height: {char.height}</span><br />
                            <span>
                                Home Planet:{' '}
                                {homeworldData[char.homeworld] || (loading ? 'Loading...' : 'Unknown')}
                            </span>
                            <br />
                            <button onClick={() => removeFavorite(char.name)}>Remove</button>
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={resetFavorites} disabled={loading}>
                {loading ? 'Loading...' : 'Purge Favorites'}
            </button>
        </div>
    );
};

export default Favourites;
