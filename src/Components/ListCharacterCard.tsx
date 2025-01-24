import { Flex, IconButton, Link, ListItem } from '@chakra-ui/react';
import React from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { Link as ReactRouterLink } from 'react-router-dom';
import { CharacterCardProps } from '../Helper/Interfaces';


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
