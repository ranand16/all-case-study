import { Box, Divider, Flex, Heading, IconButton, ListItem, Progress, Stack, Text, UnorderedList } from "@chakra-ui/react";
import React from "react";
import { MdFavorite, MdFavoriteBorder } from "react-icons/md";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import useFavoritesStore from "../Hooks/useFavoritesStore";
import { STRINGS } from "../lang/language";
import { fetchCharacterDetails, fetchCharacterFilms, fetchHomeWorldDetails, fetchStarshipDetails } from "../Services/ApiUtility";

const CharacterDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { favorites, toggleFavorite } = useFavoritesStore();

    // Fetch character base details
    const { data: character, isLoading: isCharacterLoading, error: characterError } = useQuery(
        ['character', id],
        ()=> fetchCharacterDetails(id)
    );

    // Fetch homeworld details
    const { data: homeworld, isLoading: isHomeworldLoading } = useQuery(
        ['homeworld', character?.homeworld],
        () => fetchHomeWorldDetails(character),
        {
            enabled: !!character?.homeworld,
        }
    );

    // Fetch films
    const { data: films = [], isLoading: isFilmsLoading } = useQuery(
        ['films', character?.films],
        () => fetchCharacterFilms(character),
        {
            enabled: !!character?.films?.length,
        }
    );

    // Fetch starships
    const { data: starships = [], isLoading: isStarshipsLoading } = useQuery(
        ['starships', character?.starships],
        ()=>fetchStarshipDetails(character),
        {
            enabled: !!character?.starships?.length,
        }
    );

    if (characterError) {
        return (
            <Box role="alert" aria-live="assertive" p={4} bg="red.50" borderRadius="md">
                <Text color="red.500">{STRINGS['errofetchchardet']}</Text>
            </Box>
        );
    }

    if (isCharacterLoading) {
        return <Progress size="xs" isIndeterminate />;
    }

    return (
        <Box as="main" p={6} bg="gray.50" minH="100vh" borderRadius="md" boxShadow="md">
            <Stack spacing={6}>
                {/* Character Header */}
                <Flex alignItems="center" justifyContent="space-between">
                    <Heading size="lg" color="teal.600">
                        {character?.name}
                    </Heading>
                    <IconButton
                        icon={favorites[character?.name] ? <MdFavorite /> : <MdFavoriteBorder />}
                        colorScheme={favorites[character?.name] ? 'red' : 'gray'}
                        aria-label={favorites[character?.name] ? `Unfavorite ${character?.name}` : `Favorite ${character?.name}`}
                        onClick={() => toggleFavorite({...character, homeworld})}
                    />
                </Flex>

                <Divider />

                {/* Character Details */}
                <Box as="section" aria-labelledby="character-details">
                    <Heading id="character-details" size="md" color="teal.500" mb={2}>
                        {STRINGS['characterdetails']}
                    </Heading>
                    <Stack spacing={1}>
                        <Text>
                            <strong>{STRINGS['haircolor']}</strong>: {character?.hair_color}
                        </Text>
                        <Text>
                            <strong>{STRINGS['eyecolor']}</strong>: {character?.eye_color}
                        </Text>
                        <Text>
                            <strong>{STRINGS['gender']}</strong>: {character?.gender}
                        </Text>
                        <Text>
                            <strong>{STRINGS['homeplanet']}</strong>: {isHomeworldLoading ? "Loading..." : homeworld}
                        </Text>
                    </Stack>
                </Box>

                <Divider />

                {/* Films Section */}
                <Box as="section" aria-labelledby="films-section">
                    <Heading id="films-section" size="md" color="teal.500" mb={2}>
                        {STRINGS['films']}
                    </Heading>
                    {isFilmsLoading ? (
                        <Text>Loading films...</Text>
                    ) : films.length > 0 ? (
                        <UnorderedList>
                            {films.map((film, index) => (
                                <ListItem key={index}>{film}</ListItem>
                            ))}
                        </UnorderedList>
                    ) : (
                        <Text color="gray.500" aria-live="polite">
                            {STRINGS['nofilmsavailable']}
                        </Text>
                    )}
                </Box>

                <Divider />

                {/* Starships Section */}
                <Box as="section" aria-labelledby="starships-section">
                    <Heading id="starships-section" size="md" color="teal.500" mb={2}>
                        {STRINGS['starships']}
                    </Heading>
                    {isStarshipsLoading ? (
                        <Text>Loading starships...</Text>
                    ) : starships.length > 0 ? (
                        <UnorderedList>
                            {starships.map((ship, index) => (
                                <ListItem key={index}>{ship}</ListItem>
                            ))}
                        </UnorderedList>
                    ) : (
                        <Text color="gray.500" aria-live="polite">
                            {STRINGS['nostarshipsavailable']}
                        </Text>
                    )}
                </Box>
            </Stack>
        </Box>
    );
};

export default CharacterDetails;
