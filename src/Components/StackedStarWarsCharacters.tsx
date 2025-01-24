import { SimpleGrid, UnorderedList } from '@chakra-ui/react/dist/types';
import React from 'react';
import { CharacterData, StackedStarWarsCharactersProps } from '../Helper/Interfaces';
import { CharacterCard } from './CharacterCard';
import { ListCharacterCard } from './ListCharacterCard';

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