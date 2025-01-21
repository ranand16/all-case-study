import { STRINGS } from '@src/lang/language';
import React from 'react';
import { useQuery } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';
import useDebounce from '../Hooks/useDebounce';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import usePrevious from '../Hooks/usePrevious';
import { fetchCharacters } from '../Services/ApiUtility';

export interface CharacterData {
    name: string;
    url: string;
    eye_color: string;
    hair_color: string;
    gender: string;
    homeworld: string;
    films: Array<string>;
    starships: Array<string>;
    height: string;
}

export interface CharactersData {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<CharacterData>;
}

const CharacterList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { favorites, toggleFavorite } = useFavoritesStore();

    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page')) || 1;

    const debouncedSearch = useDebounce(search, 1500);
    const prevSearchVal = usePrevious(debouncedSearch);
    const prevPageVal = usePrevious(page);

    const { data, isFetching, isError } = useQuery(
        ['characters', debouncedSearch, page],
        () => fetchCharacters(debouncedSearch, page),
        {
            keepPreviousData: true,
            enabled: (page > 0 && prevSearchVal !== debouncedSearch) || (page !== prevPageVal && prevSearchVal === debouncedSearch),
        }
    );

    const { next = null, previous = null, results = [] }: CharactersData = data || {};

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (value === search) return;
        setSearchParams({ search: value, page: '1' });
    };

    const handlePageChange = (newPage: number) => {
        setSearchParams({ search, page: String(newPage) });
    };

    return (
        <main>
            <h1 id="character-list-title">{STRINGS["starwarchars"]}</h1>
            <label htmlFor="character-search">{STRINGS["searchchars"]}: </label>
            <input
                id="character-search"
                type="text"
                placeholder="Search characters"
                value={search}
                onChange={handleSearchChange}
                aria-labelledby="character-list-title"
            />
            <div aria-live="polite">
                {isFetching && <div>{STRINGS["loading"]}</div>}
                {isError && <div role="alert">{STRINGS["errorfetchchars"]}</div>}
                {!isFetching && !isError && results.length > 0 && (
                    <section aria-labelledby="results-heading">
                        <h2 id="results-heading">{STRINGS["chardet"]}</h2>
                        <ul>
                            {results.map((char: CharacterData) => (
                                <li key={char.name}>
                                    <Link
                                        to={`/details/${char.url.split('/')[5]}`}
                                        aria-label={`View details about ${char.name}`}
                                    >
                                        {char.name} ({char.gender})
                                    </Link>
                                    <button
                                        onClick={() => toggleFavorite(char)}
                                        aria-label={
                                            favorites[char.name]
                                                ? `Unfavorite ${char.name}`
                                                : `Favorite ${char.name}`
                                        }
                                    >
                                        {favorites[char.name] ? `${STRINGS["unfav"]}` : `${STRINGS["fav"]}`}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                {!isFetching && !isError && results.length === 0 && (
                    <div role="alert">{STRINGS["noresfound"]}</div>
                )}
            </div>
            <div role="navigation" aria-label="Pagination">
                <button
                    disabled={isFetching || !previous}
                    onClick={() => handlePageChange(page - 1)}
                    aria-disabled={isFetching || !previous}
                    aria-label="Go to the previous page"
                >
                    {STRINGS["prev"]}
                </button>
                <button
                    disabled={isFetching || !next}
                    onClick={() => handlePageChange(page + 1)}
                    aria-disabled={isFetching || !next}
                    aria-label="Go to the next page"
                >
                    {STRINGS["next"]}
                </button>
            </div>
        </main>
    );
};

export default CharacterList;
