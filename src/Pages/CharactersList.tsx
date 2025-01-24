import {
    Box,
    Heading,
    Input,
    Progress,
    Stack,
    Text
} from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { CharacterListApiResponse } from '../Helper/Interfaces';
import useDebounce from '../Hooks/useDebounce';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import usePrevious from '../Hooks/usePrevious';
import { STRINGS } from '../lang/language';
import { fetchCharacters, fetchHomeWorlds } from '../Services/ApiUtility';

const CharacterList: React.FC = () => {
    // const { colorScheme } = useContext(ColorSchemeContext);
    const colorScheme = "blue";
    const [isListView, setIsListView] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { favorites, toggleFavorite } = useFavoritesStore();
    const [finalRes, setFinalRes] = useState<NonNullable<CharacterListApiResponse | Error>>();    
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page')) || 1;

    const debouncedSearch = useDebounce(search, 500);
    const prevSearchVal = usePrevious(debouncedSearch);
    const prevPageVal = usePrevious(page);

    useQuery(
    ['characters', debouncedSearch, page],
    () => {
        setFinalRes({ next: null, previous: null, isFetching: true, isError: false, results: [], count: 0, ...finalRes });
        return fetchCharacters(debouncedSearch, page)
    },
    {
        keepPreviousData: true,
        enabled:
            (page > 0 && prevSearchVal !== debouncedSearch) ||
            (page !== prevPageVal && prevSearchVal === debouncedSearch),
        async onSettled(data, error) {
            if(data) {
                const { results: apiRes } = data as CharacterListApiResponse;
                // Process characters and fetch homeworlds in series
                const fetchHomeWorldsVal: Array<CharacterData> = await fetchHomeWorlds(apiRes);
                setFinalRes({ results: fetchHomeWorldsVal, isFetching: false, ...data });
            } else {
                setFinalRes({ next: null, previous: null, isFetching: false, isError: true, results: [], count: 0, error: error });

            }
        },
    }
);

    const { error ,next = null, previous = null, isError = false, count= 0, isFetching = false,  results = [] } = (finalRes || {}) as CharacterListApiResponse;

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        if (value === search) return;
        setSearchParams({ search: value, page: '1' });
    };

    const handlePageChange = (newPage: number) => {
        setFinalRes({ ...finalRes, isFetching: true })
        setSearchParams({ search, page: String(newPage) });
    };

    const handleFavToggle = useCallback((character: CharacterData) => toggleFavorite(character),[toggleFavorite]);

    return (
        <Box as="main" p={6} bg="gray.50" minH="100vh">
            <Stack spacing={8}>

                {/* Header Section */}
                <Box>
                    <Heading size="md" color={`${colorScheme}.600`}>
                        {STRINGS["starwarchars"]}
                    </Heading>
                    <Input
                        id="character-search"
                        type="text"
                        placeholder="Search characters"
                        marginTop={"0.5rem"}
                        value={search}
                        colorScheme={colorScheme}
                        onChange={handleSearchChange}
                        bg="white"
                        borderRadius="md"
                        aria-labelledby="character-list-title"
                    />
                </Box>

                {/* Results Section */}
                <Box aria-live="polite">
                
                    {/* IN PROGRESS */}
                    {isFetching && <Progress colorScheme={colorScheme} size="xs" isIndeterminate />}
                    
                    {/* IN ERROR */}
                    {(isError || error) && (
                        <Text color="red.500" role="alert">
                            {STRINGS["errorfetchchars"]}
                        </Text>
                    )}

                    {/* NO RESULTS */}
                    {!isFetching && !isError && results.length === 0 && (
                        <Text role="alert" color="gray.500">
                            {STRINGS["noresfound"]}
                        </Text>
                    )}

                    {/* RESULTS FETCHED */}
                    {!isFetching && !isError && results.length > 0 && (
                        <Box>
                            <Heading size="md" color={`${colorScheme}.600`} mb={4} style={{display: "flex", justifyContent: "space-between"}}>

                                <Text>{STRINGS["chardet"]} {`(${count})`}</Text>
                                <StackedToggleListGridView   
                                    isListView={isListView} 
                                    setIsListView={setIsListView} 
                                />
                            </Heading>
                            <StackedStarWarsCharacters
                                isListView={isListView}
                                results={results}
                                colorScheme={colorScheme}
                                favorites={favorites}
                                handleFavToggle={handleFavToggle}
                            />
                        </Box>
                    )}
                </Box>

                {/* PAGINATION BUTTONS */}
                <FlexPaginationButtons   
                    colorScheme={colorScheme} 
                    isFetching={isFetching} 
                    previous={previous} 
                    handlePageChange={handlePageChange} 
                    page={page} 
                    next={next} 
                />
            </Stack>
        </Box>
    );
};

export default CharacterList;


