import { STRINGS } from '@src/lang/language';
import React, { useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import { fetchCharacterDetails } from '../Services/ApiUtility';

const CharacterDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { favorites, toggleFavorite } = useFavoritesStore();

    const { data, isLoading, error } = useQuery(['characterDetails', id], () => fetchCharacterDetails(id));

    const { isFavorite, filmsExist, starshipsExist } = useMemo(() => {
        return data
            ? {
                isFavorite: Boolean(favorites[data.name]),
                filmsExist: Boolean(data.films.length > 0),
                starshipsExist: Boolean(data?.starships.length > 0),
            }
            : {
                isFavorite: false,
                filmsExist: false,
                starshipsExist: false,
            };
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

    if (error)
        return (
            <div role="alert" aria-live="assertive">
                {STRINGS["errofetchchardet"]}
            </div>
        );
    if (isLoading)
        return (
            <div aria-live="polite" aria-busy="true">
                {STRINGS["loadingcharacter"]}
            </div>
        );

    return (
        <div>
            <h1>{data.name}</h1>
            <section aria-labelledby="character-details">
                <h2 id="character-details">{STRINGS["characterdetails"]}</h2>
                <p>{STRINGS["haircolor"]}: {data.hair_color}</p>
                <p>{STRINGS["eyecolor"]}: {data.eye_color}</p>
                <p>{STRINGS["gender"]}: {data.gender}</p>
                <p>{STRINGS["homeplanet"]}: {data.homeworld}</p>
            </section>

            <section aria-labelledby="films-section">
                <h2 id="films-section">{STRINGS["films"]}</h2>
                <ul>
                    {filmsExist &&
                        data.films.map((film: string, index: number) => (
                            <li key={index}>{film}</li>
                        ))}
                </ul>
                {!filmsExist && (
                    <div aria-live="polite">{STRINGS["nofilmsavailable"]}</div>
                )}
            </section>

            <section aria-labelledby="starships-section">
                <h2 id="starships-section">{STRINGS["starships"]}</h2>
                <ul>
                    {starshipsExist &&
                        data?.starships.map((ship: string, index: number) => (
                            <li key={index}>{ship}</li>
                        ))}
                </ul>
                {!starshipsExist && (
                    <div aria-live="polite">{STRINGS["nostarshipsavailable"]}</div>
                )}
            </section>

            <button
                onClick={handleToggleFavorite}
                aria-pressed={isFavorite}
                aria-label={
                    isFavorite
                        ? `Remove ${data.name} from favorites`
                        : `Add ${data.name} to favorites`
                }
            >
                {isFavorite ? `${STRINGS["removefromfav"]}` : `${STRINGS["addtofav"]}`}
            </button>
        </div>
    );
};

export default CharacterDetails;
