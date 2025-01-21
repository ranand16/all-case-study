import {
    Box,
    Button,
    Flex,
    FormLabel,
    Heading,
    IconButton,
    Input,
    Link,
    ListItem,
    Progress,
    Stack,
    Text,
    UnorderedList,
    useColorModeValue
} from '@chakra-ui/react';
import { STRINGS } from '@src/lang/language';
import React from 'react';
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useQuery } from 'react-query';
import { Link as ReactRouterLink, useSearchParams } from 'react-router-dom';
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

    const debouncedSearch = useDebounce(search, 500);
    const prevSearchVal = usePrevious(debouncedSearch);
    const prevPageVal = usePrevious(page);

    const { data, isFetching, isError } = useQuery(
        ['characters', debouncedSearch, page],
        () => fetchCharacters(debouncedSearch, page),
        {
            keepPreviousData: true,
            enabled:
                (page > 0 && prevSearchVal !== debouncedSearch) ||
                (page !== prevPageVal && prevSearchVal === debouncedSearch),
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
        <Box as="main" p={6} bg={useColorModeValue('gray.50', 'gray.800')} minH="100vh">
            <Stack spacing={8}>
                {/* Header Section */}
                <Box>
                    <Heading size="lg" color={useColorModeValue('teal.600', 'teal.300')}>
                        {STRINGS["starwarchars"]}
                    </Heading>
                    <FormLabel htmlFor="character-search" mt={4}>
                        {STRINGS["searchchars"]}
                    </FormLabel>
                    <Input
                        id="character-search"
                        type="text"
                        placeholder="Search characters"
                        value={search}
                        onChange={handleSearchChange}
                        bg={useColorModeValue('white', 'gray.700')}
                        borderRadius="md"
                        aria-labelledby="character-list-title"
                    />
                </Box>

                {/* Results Section */}
                <Box aria-live="polite">
                    {isFetching && <Progress size="xs" isIndeterminate />}
                    {isError && (
                        <Text color="red.500" role="alert">
                            {STRINGS["errorfetchchars"]}
                        </Text>
                    )}
                    {!isFetching && !isError && results.length > 0 && (
                        <Box>
                            <Heading size="md" color={useColorModeValue('teal.600', 'teal.300')} mb={4}>
                                {STRINGS["chardet"]}
                            </Heading>
                            <UnorderedList spacing={3}>
                                {results.map((char: CharacterData) => (
                                    <ListItem key={char.name} listStyleType="none">
                                        <Flex
                                            p={3}
                                            bg={useColorModeValue('white', 'gray.700')}
                                            borderRadius="md"
                                            alignItems="center"
                                            justifyContent="space-between"
                                            boxShadow="sm"
                                        >
                                            <Link
                                                as={ReactRouterLink}
                                                to={`/details/${char.url.split('/')[5]}`}
                                                color={useColorModeValue('teal.600', 'teal.300')}
                                                fontWeight="bold"
                                                aria-label={`View details about ${char.name}`}
                                            >
                                                {char.name} ({char.gender})
                                            </Link>
                                            <IconButton
                                                icon={favorites[char.name] ? <MdFavorite /> : <MdFavoriteBorder />}
                                                colorScheme={favorites[char.name] ? 'red' : 'gray'}
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleFavorite(char)}
                                                aria-label={
                                                    favorites[char.name]
                                                        ? `Unfavorite ${char.name}`
                                                        : `Favorite ${char.name}`
                                                }
                                            />
                                        </Flex>
                                    </ListItem>
                                ))}
                            </UnorderedList>
                        </Box>
                    )}
                    {!isFetching && !isError && results.length === 0 && (
                        <Text role="alert" color="gray.500">
                            {STRINGS["noresfound"]}
                        </Text>
                    )}
                </Box>

                {/* Pagination Section */}
                <Flex justifyContent="space-between" mt={6}>
                    <Button
                        colorScheme="blue"
                        disabled={isFetching || !previous}
                        onClick={() => handlePageChange(page - 1)}
                        aria-label="Go to the previous page"
                    >
                        {STRINGS["prev"]}
                    </Button>
                    <Button
                        colorScheme="blue"
                        disabled={isFetching || !next}
                        onClick={() => handlePageChange(page + 1)}
                        aria-label="Go to the next page"
                    >
                        {STRINGS["next"]}
                    </Button>
                </Flex>
            </Stack>
        </Box>
    );
};

export default CharacterList;
