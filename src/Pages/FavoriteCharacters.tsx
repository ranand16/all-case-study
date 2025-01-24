import { Button, Flex, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import React, { useCallback } from 'react';
import EmptyPage from '../Components/EmptyPage';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import { STRINGS } from '../lang/language';
import { CharacterData } from '../Services/ApiUtility';
import { CharacterCard } from './CharactersList';

const Favourites: React.FC = () => {
    const { favorites, removeFavorite, resetFavorites } = useFavoritesStore();
    const favArray = React.useMemo(()=> { return Object.values(favorites) as Array<CharacterData> }, [favorites])
    console.log("🚀 ~ favArray:", favArray)
    const handleRemoveFavorite = useCallback((character: CharacterData) => removeFavorite(character.name), [removeFavorite]);
    return (
        <main>
            <Stack direction={"column"} spacing={2}>
                {/* HEADER */}
                <Flex direction={"row"} justifyContent={"space-between"}>
                    <Heading size={"lg"} id="favorites-title">{STRINGS["favlist"]}</Heading>
                    {
                        favArray.length !== 0 && 
                        <Button
                            size={"xs"}
                            onClick={resetFavorites}
                            colorScheme='blue'
                            aria-label="Purge all favorites"
                        >
                            {STRINGS["purgefavs"]}
                        </Button>
                    }
                </Flex>
                {favArray.length === 0 ? (
                    <EmptyPage 
                        heading={STRINGS["nofavs"]}
                        message={STRINGS["datadoesnotexists"]}
                        linktext={STRINGS["gohome"]}
                        toPage={"/"}
                    />
                ) : (
                    <section aria-labelledby="favorites-title">
                        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                            {favArray.map((character: CharacterData) => (
                                <CharacterCard
                                    key={character.name}
                                    character={character}
                                    handleFavouriteToggle={handleRemoveFavorite}
                                    isFavourite
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
