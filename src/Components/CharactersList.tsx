import {
    Box,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Flex,
    Heading,
    IconButton,
    Input,
    Link,
    ListItem,
    Progress,
    SimpleGrid,
    Stack,
    Text,
    UnorderedList
} from '@chakra-ui/react';
import { STRINGS } from '@src/lang/language';
import React, { useCallback, useState } from 'react';
import { FaRegListAlt } from "react-icons/fa";
import { FiGrid } from "react-icons/fi";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useQuery } from 'react-query';
import { Link as ReactRouterLink, useSearchParams } from 'react-router-dom';
import useDebounce from '../Hooks/useDebounce';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import usePrevious from '../Hooks/usePrevious';
import { CharacterData, CharacterListApiResponse, fetchCharacters, fetchHomeWorlds } from '../Services/ApiUtility';

const CharacterList: React.FC = () => {
    // const { colorScheme } = useContext(ColorSchemeContext);
    const colorScheme = "blue";
    const [isListView, setIsListView] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const { favorites, toggleFavorite } = useFavoritesStore();
    const [finalRes, setFinalRes] = useState<NonNullable<CharacterListApiResponse>>();    
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page')) || 1;

    const debouncedSearch = useDebounce(search, 500);
    const prevSearchVal = usePrevious(debouncedSearch);
    const prevPageVal = usePrevious(page);

    const { isError } = useQuery(
    ['characters', debouncedSearch, page],
    () => {
        setFinalRes({ next: null, previous: null, isFetching: true, results: [], count: 0 });
        return fetchCharacters(debouncedSearch, page)
    },
    {
        keepPreviousData: true,
        enabled:
            (page > 0 && prevSearchVal !== debouncedSearch) ||
            (page !== prevPageVal && prevSearchVal === debouncedSearch),
        onSuccess: async (data) => {
            const { results: apiRes } = data;
            // Process characters and fetch homeworlds in series
            const fetchHomeWorldsVal: Array<CharacterData> = await fetchHomeWorlds(apiRes);
            setFinalRes({ results: fetchHomeWorldsVal, isFetching: false, ...data });
        },
    }
);

    const { next = null, previous = null, isFetching = true,  results = [] } = (finalRes || {}) as CharacterListApiResponse;

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
                    {isError && (
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

                                {STRINGS["chardet"]}
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


export interface CharactersData {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<CharacterData>;
}

interface CharacterCardProps {
    character: CharacterData;
    handleFavouriteToggle: (character: CharacterData) => void;
    colorScheme?: string;
    isFavourite?: boolean;
}


export function CharacterCard({
    character,
    handleFavouriteToggle,
    colorScheme = "blue",
    isFavourite = false
}: CharacterCardProps) {
    return (
        <Card padding={"0.1rem"}>
            <CardHeader>
                <Heading size='md' style={{ display: "flex", justifyContent: "space-between" }}>
                    <Link
                        as={ReactRouterLink}
                        to={`/details/${character.url.split('/')[5]}`}
                        color={`${colorScheme}.600`}
                        fontWeight="bold"
                        aria-label={`View details about ${character.name}`}
                    >
                        {character.name}
                    </Link>
                    <IconButton
                        icon={isFavourite ? <MdFavorite /> : <MdFavoriteBorder />}
                        colorScheme={isFavourite ? colorScheme : 'gray'}
                        variant="ghost"
                        size="md"
                        onClick={() => handleFavouriteToggle(character)}
                        aria-label={
                            isFavourite
                                ? `Unfavorite ${character.name}`
                                : `Favorite ${character.name}`
                        }
                    />
                </Heading>
            </CardHeader>
            <CardBody paddingY={"0.1rem"}>
                <Text>{`${STRINGS["height"]}: ${character.height}`}</Text>
                <Text >{`${STRINGS["homeplanet"]}: ${character["homeworld"]}`}</Text>
                <Text>{`${STRINGS["gender"]}: ${character.gender}`}</Text>
            </CardBody>
            <CardFooter>
            
            {/* <Button
                size={"sm"}
                colorScheme={colorScheme}
                onClick={() => handleFavouriteToggle(character)}
                aria-label={`Remove ${character.name} from favorites`}
            >
                {STRINGS["remove"]}
            </Button> */}
            </CardFooter>
        </Card>
    );
}

export function ListCharacterCard({
    character,
    handleFavouriteToggle,
    colorScheme = "blue",
    isFavourite = false
}: CharacterCardProps) {
    return <ListItem key={character.name} listStyleType="none">
        <Flex
            p={3}
            bg="white"
            borderRadius="md"
            alignItems="center"
            justifyContent="space-between"
            boxShadow="sm"
        >
            <Link
                as={ReactRouterLink}
                to={`/details/${character.url.split('/')[5]}`}
                color={`${colorScheme}.600`}
                fontWeight="bold"
                aria-label={`View details about ${character.name}`}
            >
                {character.name} ({character.gender})
            </Link>
            <IconButton
                icon={isFavourite ? <MdFavorite /> : <MdFavoriteBorder />}
                colorScheme={isFavourite ? colorScheme : 'gray'}
                variant="ghost"
                size="sm"
                onClick={() => handleFavouriteToggle(character)}
                aria-label={
                    isFavourite
                        ? `Unfavorite ${character.name}`
                        : `Favorite ${character.name}`
                }
            />
        </Flex>
    </ListItem>
}


interface StackedStarWarsCharactersProps {
    isListView: boolean;
    results: Array<CharacterData>;
    colorScheme: string;
    favorites: Record<string, CharacterData>;
    handleFavToggle: (character: CharacterData) => void 
}

export function StackedStarWarsCharacters({
    isListView,
    results,
    colorScheme,
    favorites,
    handleFavToggle
}: StackedStarWarsCharactersProps) {
    return <>
        {
            !isListView && 
            <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                {results.map((character) => {
                    const isFavourite = Boolean(favorites[character.name]);
                    return (
                    <CharacterCard
                        key={character.name}
                        character={character}
                        colorScheme={colorScheme}
                        isFavourite={isFavourite}
                        handleFavouriteToggle={handleFavToggle}
                    />
                )})}
            </SimpleGrid>
        }
        {
            isListView &&
            <UnorderedList marginLeft={0} spacing={3}>
                {results.map((character: CharacterData) => {
                    const isFavourite = Boolean(favorites[character.name]);
                    return (
                        <ListCharacterCard 
                            key={character.name}
                            character={character}
                            colorScheme={colorScheme}
                            isFavourite={isFavourite}
                            handleFavouriteToggle={handleFavToggle}
                        />
                    )}
                )}
            </UnorderedList>
        }
    </>
}

interface StackedToggleListGridViewProps {
    isListView: boolean;
    setIsListView: React.Dispatch<React.SetStateAction<boolean>>;
}

export function StackedToggleListGridView({
    isListView, 
    setIsListView
}: StackedToggleListGridViewProps) {
    return (
        <Stack direction={"row"}>
            {<IconButton icon={<FaRegListAlt />} variant="ghost" isActive={isListView} size="sm" onClick={() => setIsListView(true)} aria-label={isListView ? `Listed result` : `Card results`} />}
            {<IconButton icon={<FiGrid />} variant="ghost" size="sm" isActive={!isListView} onClick={() => setIsListView(false)} aria-label={isListView ? `Listed result` : `Card results`} />}
        </Stack>
    );
}

interface FlexPaginationButtonsProps {
    colorScheme: string;
    isFetching: boolean;
    previous: string;
    handlePageChange: (newPage: number) => void
    page: number;
    next: string;
}

export function FlexPaginationButtons({
    colorScheme, 
    isFetching, 
    previous, 
    handlePageChange, 
    page, 
    next
}: FlexPaginationButtonsProps) {
    return (
        <Flex justifyContent="space-between" mt={6}>
            <Button colorScheme={colorScheme} disabled={isFetching || !previous} onClick={() => handlePageChange(page - 1)} aria-label="Go to the previous page">
                {STRINGS["prev"]}
            </Button>
            <Button colorScheme={colorScheme} disabled={isFetching || !next} onClick={() => handlePageChange(page + 1)} aria-label="Go to the next page">
                {STRINGS["next"]}
            </Button>
        </Flex>
    );
}
