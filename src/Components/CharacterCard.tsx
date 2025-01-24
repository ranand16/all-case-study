import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Heading,
    IconButton,
    Link,
    Text
} from '@chakra-ui/react';
import React from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { Link as ReactRouterLink } from "react-router-dom";
import { CharacterCardProps } from '../Helper/Interfaces';
import { STRINGS } from '../lang/language';

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
                        to={`/details/${character?.url.split('/')[5]}`}
                        color={`${colorScheme}.600`}
                        fontWeight="bold"
                        aria-label={`View details about ${character?.name}`}
                    >
                        {character?.name}
                    </Link>
                    <IconButton
                        icon={isFavourite ? <MdFavorite /> : <MdFavoriteBorder />}
                        colorScheme={isFavourite ? colorScheme : 'gray'}
                        variant="ghost"
                        size="md"
                        onClick={() => handleFavouriteToggle(character)}
                        aria-label={
                            isFavourite
                                ? `Unfavorite ${character?.name}`
                                : `Favorite ${character?.name}`
                        }
                    />
                </Heading>
            </CardHeader>
            <CardBody paddingY={"0.1rem"}>
                <Text>{`${STRINGS["height"]}: ${character?.height}`}</Text>
                <Text >{`${STRINGS["homeplanet"]}: ${character?.homeworld}`}</Text>
                <Text>{`${STRINGS["gender"]}: ${character?.gender}`}</Text>
            </CardBody>
            <CardFooter>
            
            {/* <Button
                size={"sm"}
                colorScheme={colorScheme}
                onClick={() => handleFavouriteToggle(character)}
                aria-label={`Remove ${character?.name} from favorites`}
            >
                {STRINGS["remove"]}
            </Button> */}
            </CardFooter>
        </Card>
    );
}