import useFavoritesStore from '@src/Hooks/useFavoritesStore';
import { fetchCharacterDetails } from '@src/Services/ApiUtility';
import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

const CharacterDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { favorites, toggleFavorite } = useFavoritesStore();

    const { data, isLoading, error } = useQuery(['characterDetails', id], () => fetchCharacterDetails(id));

    const isFavorite = useMemo(() => {
        return data ? !!favorites[data.name] : false;
    }, [data, favorites]);

    const handleToggleFavorite = useCallback(() => {
        if (data) {
            toggleFavorite({
                name: data.name,
                gender: data.gender,
                homeworld: data.homeworld,
                height: data.height,
                eye_color: data.eye_color,
                hair_color: data.hair_color,
                films: data.films,
                starships: data.starships,
                url: data.url,
            });
        }
    }, [data, toggleFavorite]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error fetching character details</div>;

    return (
        <div>
            <h1>{data.name}</h1>
            <p>Hair Color: {data.hair_color}</p>
            <p>Eye Color: {data.eye_color}</p>
            <p>Gender: {data.gender}</p>
            <p>Home Planet: {data.homeworld}</p>

            <h2>Films</h2>
            <ul>
                {data.films.map((film: string, index: number) => (
                    <li key={index}>{film}</li>
                ))}
            </ul>

            <h2>Starships</h2>
            <ul>
                {data.starships.map((ship: string, index: number) => (
                    <li key={index}>{ship}</li>
                ))}
            </ul>

            {/* Add/Remove from Favorites Button */}
            <button onClick={handleToggleFavorite}>
                {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
        </div>
    );
};

export default CharacterDetails;
