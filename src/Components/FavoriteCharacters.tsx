import { Box, Button, Card, CardBody, CardFooter, CardHeader, CircularProgress, Flex, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { STRINGS } from '@src/lang/language';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FULFILLED } from '../Helper/constants';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import { fetchHomeworld } from '../Services/ApiUtility';

const Favourites: React.FC = () => {
    const { favorites, removeFavorite, resetFavorites } = useFavoritesStore();
    const [loading, setLoading] = useState(false);

    const { favoriteCharacters, uniqueHomeworlds, homeworldData } = useMemo(() => {
        const characters = Object.values(favorites);
        const uniqueUrls = Array.from(
            new Set(characters.map((char) => char.homeworld).filter(Boolean))
        );

        const homeworldData = uniqueUrls.reduce((acc, url) => {
            acc[url] = null; // Initialize homeworld as null
            return acc;
        }, {} as Record<string, string>);

        return { favoriteCharacters: characters, uniqueHomeworlds: uniqueUrls, homeworldData };
    }, [favorites]);

    const fetchHomeworlds = useCallback(async () => {
        setLoading(true);
        try {
            const homeworldResponses = await Promise.allSettled(
                uniqueHomeworlds.map(async (url) => {
                    let data;
                    if (!homeworldData[url]) {
                        const homeworldName = await fetchHomeworld(url);
                        data = { url, name: homeworldName };
                    } else {
                        data = { url, name: homeworldData[url] };
                    }
                    return data;
                })
            );

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            homeworldResponses.forEach(({ status = FULFILLED, value = { url:"", name: "" } }: { status: any, value: {url: string, name: string} }) => {
                if (status === FULFILLED) {
                    const { url, name } = value;
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
        if (uniqueHomeworlds.length > 0) {
            fetchHomeworlds();
        }
    }, []);

    const handleRemoveFavorite = useCallback(
        (charName: string) => {
            removeFavorite(charName);
        },
        [removeFavorite]
    );

    return (
        <main>
            <Stack direction={"column"} spacing={2}>
                <Flex direction={"row"} justifyContent={"space-between"}>
                    <Heading size={"lg"} id="favorites-title">{STRINGS["favlist"]}</Heading>
                    {
                        favoriteCharacters.length !== 0 && 
                        <Button
                            size={"xs"}
                            onClick={resetFavorites}
                            colorScheme='blue'
                            disabled={loading}
                            aria-busy={loading}
                            aria-label="Purge all favorites"
                        >
                            {loading ? STRINGS["loading"] : STRINGS["purgefavs"]}
                        </Button>
                    }
                </Flex>
                {favoriteCharacters.length === 0 ? (
                    <Box boxSize={"max-content"} alignContent={"center"}>
                        <Text size={"sm"} aria-live="polite">{STRINGS["nofavs"]}</Text>
                    </Box>
                ) : (
                    <section aria-labelledby="favorites-title">
                        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                            {favoriteCharacters.map((character) => (
                                <EachFavourite
                                    key={character.name}
                                    loading={loading}
                                    character={character}
                                    homeworldData={homeworldData}
                                    handleRemoveFavorite={handleRemoveFavorite}
                                />
                            ))}
                        </SimpleGrid>
                    </section>
                )}
            </Stack>
        </main>
    );
};

export default Favourites;

interface EachFavoriteProps {
    character: {
        name: string;
        gender: string;
        height: string;
        homeworld: string;
    };
    loading: boolean;
    homeworldData: Record<string, string>;
    handleRemoveFavorite: (charName: string) => void;
}

export function EachFavourite({
    loading,
    character,
    homeworldData,
    handleRemoveFavorite,
}: EachFavoriteProps) {
    return (
            <Card>
                <CardHeader>
                <Heading size='md'> {character.name}({character.gender})</Heading>
                </CardHeader>
                <CardBody>
                    <Text>{STRINGS["height"]}: {character.height}</Text>
                    <Text>
                        {STRINGS["homeplanet"]}:{' '}
                        {homeworldData[character.homeworld] || (loading && <CircularProgress size={4} isIndeterminate color='blue' />)}
                    </Text>
                </CardBody>
                <CardFooter>
                <Button
                    size={"sm"}
                    colorScheme='blue'
                    onClick={() => handleRemoveFavorite(character.name)}
                    aria-label={`Remove ${character.name} from favorites`}
                >
                    {STRINGS["remove"]}
                </Button>
                </CardFooter>
            </Card>
    );
}
