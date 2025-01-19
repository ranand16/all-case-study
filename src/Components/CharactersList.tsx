import useDebounce from '@src/Hooks/useDebounce';
import useFavoritesStore from '@src/Hooks/useFavoritesStore';
import { fetchCharacters } from '@src/Services/ApiUtility';
import React, { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { Link, useSearchParams } from 'react-router-dom';

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
    previous: string;
    results: Array<CharacterData>;
}

const CharacterList: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
    // const [lastSearchValue, setLastSearchValue] = useState(''); // Track the last search value
    // const [lastPage, setLastPage] = useState<number>(page); // Track the last page number

    const debouncedSearch = useDebounce(search, 300);
    const { favorites, toggleFavorite } = useFavoritesStore();

    // Update the URL and reset page when the debounced search value changes
    useEffect(() => {
        if (debouncedSearch.trim() === searchParams.get('search')) return;
        setSearchParams({ search: debouncedSearch.trim(), page: '1' });
        setPage(1);
    }, [debouncedSearch, setSearchParams, searchParams]);

    // Fetch data if debounced search changes or the page number changes
    const { data = {}, isLoading, error } = useQuery(
        ['characters', debouncedSearch, page],
        () => {
            // setLastSearchValue(debouncedSearch.trim());
            // setLastPage(page);
            return fetchCharacters(debouncedSearch, page);
        },
        // {
        //     enabled: debouncedSearch.trim() !== lastSearchValue || page !== lastPage || (lastSearchValue === '' && lastPage === page),
        // }
    );

    const { next = null, previous = null, results = [] }: CharactersData = data;

    return (
        <div>
            <h1>Star Wars Characters</h1>
            <input
                type="text"
                placeholder="Search characters"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            {isLoading && <div>Loading...</div>}
            {error && <div>Error fetching characters</div>}
            {!isLoading && !error && (
                <>
                    <ul>
                        {results.map((char: CharacterData) => (
                            <li key={char.name}>
                                <Link to={`/details/${char.url.split('/')[5]}`}>
                                    {char.name} ({char.gender})
                                </Link>
                                <button onClick={() => toggleFavorite(char)}>
                                    {favorites[char.name] ? 'Unfavorite' : 'Favorite'}
                                </button>
                            </li>
                        ))}
                    </ul>
                    <button
                        disabled={previous == null}
                        onClick={() => {
                            setPage(page - 1);
                            setSearchParams({ search: debouncedSearch.trim(), page: `${page - 1}` });
                        }}
                    >
                        Previous
                    </button>
                    <button
                        disabled={next == null}
                        onClick={() => {
                            setPage(page + 1);
                            setSearchParams({ search: debouncedSearch.trim(), page: `${page + 1}` });
                        }}
                    >
                        Next
                    </button>
                </>
            )}
        </div>
    );
};

export default CharacterList;
