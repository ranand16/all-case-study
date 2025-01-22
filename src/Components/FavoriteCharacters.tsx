import { Button, Flex, Heading, SimpleGrid, Stack } from '@chakra-ui/react';
import { STRINGS } from '@src/lang/language';
import React, { useCallback } from 'react';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import { CharacterData } from '../Services/ApiUtility';
import { CharacterCard } from './CharactersList';
import EmptyPage from './EmptyPage';

const Favourites: React.FC = () => {
    const { favorites, removeFavorite, resetFavorites } = useFavoritesStore();
    const handleRemoveFavorite = useCallback((character: CharacterData) => removeFavorite(character.name), [removeFavorite]);
    return (
        <main>
            <Stack direction={"column"} spacing={2}>

                {/* HEADER */}
                <Flex direction={"row"} justifyContent={"space-between"}>
                    <Heading size={"lg"} id="favorites-title">{STRINGS["favlist"]}</Heading>
                    {
                        Object.values(favorites).length !== 0 && 
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
                {Object.values(favorites).length === 0 ? (
                    <EmptyPage 
                        heading={STRINGS["nofavs"]}
                        message={STRINGS["datadoesnotexists"]}
                        linktext={STRINGS["gohome"]}
                        toPage={"/"}
                    />
                ) : (
                    <section aria-labelledby="favorites-title">
                        <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                            {Object.values(favorites).map((character) => (
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
