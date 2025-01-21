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

    // Extract search and page from URL params
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page')) || 1;

    // Debounced search term to minimize API calls
    const debouncedSearch = useDebounce(search, 1500);
    const prevSearchVal = usePrevious(debouncedSearch);
    const prevPageVal = usePrevious(page);

    // Query to fetch character data
    const { data, isFetching, isError } = useQuery(
        ['characters', debouncedSearch, page],
        () => fetchCharacters(debouncedSearch, page),
        {
            keepPreviousData: true,
            enabled: (page > 0 && prevSearchVal !== debouncedSearch) || (page != prevPageVal  && prevSearchVal == debouncedSearch),
        }
    );

    const { next = null, previous = null, results = [] }: CharactersData = data || {};

    // Handle search input changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (value === search) return; // Prevent unnecessary API call
        setSearchParams({ search: value, page: '1' }); // Reset page to 1 on search change
    };

    // Handle page navigation
    const handlePageChange = (newPage: number) => {
        setSearchParams({ search, page: String(newPage) });
    };

    // Ensure API gets called on the first load with empty search
    // useEffect(() => {
    //     if (!searchParams.get('search')) {
    //         setSearchParams({ search: '', page: '1' });
    //     }
    // }, [searchParams, setSearchParams]);

    return (
        <div>
            <h1>Star Wars Characters</h1>
            <input
                type="text"
                placeholder="Search characters"
                value={search}
                onChange={handleSearchChange}
            />
            {isFetching && <div>Loading...</div>}
            {isError && <div>Error fetching characters</div>}
            {!isFetching && !isError && (
                <>
                    <ul>
                        {results.length > 0 && results.map((char: CharacterData) => (
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
                    {
                        results.length < 1 && <div>No results found</div>
                    }
                </>
            )}
            <div>
                <button
                    disabled={isFetching || !previous}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Previous
                </button>
                <button
                    disabled={isFetching || !next}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default CharacterList;
