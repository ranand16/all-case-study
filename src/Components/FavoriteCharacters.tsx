import { FULFILLED } from '@src/Helper/constants';
import useFavoritesStore from '@src/Hooks/useFavoritesStore';
import { fetchHomeworld } from '@src/Services/ApiUtility';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

const Favourites: React.FC = () => {
    const { favorites, removeFavorite, resetFavorites } = useFavoritesStore();
    console.log("🚀 ~ favorites:", favorites)
    const [loading, setLoading] = useState(false);

    // Memoize favorite characters and homeworld URLs
    const { favoriteCharacters, uniqueHomeworlds, homeworldData } = useMemo(() => {
        const characters = Object.values(favorites);
        const uniqueUrls = Array.from(
            new Set(characters.map((char) => char.homeworld).filter(Boolean))
        );
        console.log("🚀 ~ uniqueUrls:", uniqueUrls)

        const homeworldData = uniqueUrls.reduce((acc, url) => {
            acc[url] = null; // Initialize homeworld as null
            return acc;
        }, {} as Record<string, string>);
        console.log("🚀 ~ homeworldData:", homeworldData)

        return { favoriteCharacters: characters, uniqueHomeworlds: uniqueUrls, homeworldData };
    }, [favorites]);

    // Memoize homeworld fetching to prevent re-fetching already known homeworlds
    const fetchHomeworlds = useCallback(async () => {
        setLoading(true);
        try {
            const homeworldResponses = await Promise.allSettled(
                uniqueHomeworlds.map(async (url) => {
                    let data;
                    // Only fetch if homeworld is not cached
                    if (!homeworldData[url]) {
                        const homeworldName = await fetchHomeworld(url);
                        console.log("🚀 ~ uniqueHomeworlds.map ~ homeworldName: if", homeworldName)
                        data =  { url, name: homeworldName };
                    } else {
                        console.log("🚀 ~ uniqueHomeworlds.map ~ homeworldName: else ", homeworldData[url])
                        data = { url, name: homeworldData[url] };
                    }
                    console.log("🚀 ~ uniqueHomeworlds.map ~ data:", data)
                    return data;
                })
            );

            console.log("🚀 ~ fetchHomeworlds ~ homeworldResponses:", homeworldResponses)
            // Update homeworld data state
            homeworldResponses.forEach(({ status = FULFILLED, value = {} }: {status: any, value: any}) => {
                if(status === FULFILLED) {
                    const { url, name } = value;
                    console.log("🚀 ~ homeworldResponses.forEach ~ name:", name)
                    console.log("🚀 ~ homeworldResponses.forEach ~ url:", url)
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
        console.log("🚀 ~ useEffect ~ uniqueHomeworlds:", uniqueHomeworlds.length)
        if (uniqueHomeworlds.length > 0) {
            fetchHomeworlds();
        }
    }, []);

    // Handle removal of favorites without re-triggering API calls
    const handleRemoveFavorite = useCallback(
        (charName: string) => {
            // Directly remove the character from favorites
            removeFavorite(charName);
            // Homeworld data should stay intact even after removal
        },
        [removeFavorite]
    );

    return (
        <div>
            <h1>Favourites List</h1>
            {favoriteCharacters.length === 0 ? (
                <p>No favorites added yet.</p>
            ) : (
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
            )}
            <button onClick={resetFavorites} disabled={loading}>
                {loading ? 'Loading...' : 'Purge Favorites'}
            </button>
        </div>
    );
};

export default Favourites;

// Define types for the props
interface EachFavoriteProps {
    character: {
        name: string;
        gender: string;
        height: string;
        homeworld: string;
    };
    loading: boolean;
    homeworldData: Record<string, string>,
    handleRemoveFavorite: (charName: string) => void;
}

export function EachFavourite({
    loading,
    character,
    homeworldData,
    handleRemoveFavorite,
}: EachFavoriteProps) {
    // console.log("🚀 ~ character:", character)
    // console.log("🚀 ~ homeworldData:", homeworldData)
    return (
        <li key={character.name}>
            <strong>{character.name}</strong> ({character.gender})<br />
            <span>Height: {character.height}</span>
            <br />
            <span>
                Home Planet:{' '}
                {homeworldData[character.homeworld] || (loading ? 'Loading...' : 'Unknown')}
            </span>
            <br />
            <button onClick={() => handleRemoveFavorite(character.name)}>Remove</button>
        </li>
    );
}
