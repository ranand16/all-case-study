import {
    Box,
    Divider,
    Flex,
    Heading,
    IconButton,
    ListItem,
    Progress,
    Stack,
    Text,
    UnorderedList,
} from '@chakra-ui/react';
import { STRINGS } from '@src/lang/language';
import React, { useMemo } from 'react';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';
import useFavoritesStore from '../Hooks/useFavoritesStore';
import { fetchCharacterDetails } from '../Services/ApiUtility';

const CharacterDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { favorites, toggleFavorite } = useFavoritesStore();

    const { data, isLoading, error } = useQuery(['characterDetails', id], () => fetchCharacterDetails(id));

    const { filmsExist, starshipsExist } = useMemo(() => {
        return data
            ? {
                  filmsExist: Boolean(data.films.length > 0),
                  starshipsExist: Boolean(data?.starships.length > 0),
              }
            : {
                  filmsExist: false,
                  starshipsExist: false,
              };
    }, [data]);

    if (error) {
        return (
            <Box role="alert" aria-live="assertive" p={4} bg="red.50" borderRadius="md">
                <Text color="red.500">{STRINGS['errofetchchardet']}</Text>
            </Box>
        );
    }

    if (isLoading) {
        return <Progress size="xs" isIndeterminate />;
    }

    return (
        <Box as="main" p={6} bg="gray.50" minH="100vh" borderRadius="md" boxShadow="md">
            <Stack spacing={6}>
                {/* Character Header */}
                <Flex alignItems="center" justifyContent="space-between">
                    <Heading size="lg" color="teal.600">
                        {data.name}
                    </Heading>
                    <IconButton
                        icon={favorites[data.name] ? <MdFavorite /> : <MdFavoriteBorder />}
                        colorScheme={favorites[data.name] ? 'red' : 'gray'}
                        aria-label={favorites[data.name] ? `Unfavorite ${data.name}` : `Favorite ${data.name}`}
                        onClick={() => toggleFavorite(data)}
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
                            <strong>{STRINGS['haircolor']}</strong>: {data.hair_color}
                        </Text>
                        <Text>
                            <strong>{STRINGS['eyecolor']}</strong>: {data.eye_color}
                        </Text>
                        <Text>
                            <strong>{STRINGS['gender']}</strong>: {data.gender}
                        </Text>
                        <Text>
                            <strong>{STRINGS['homeplanet']}</strong>: {data.homeworld}
                        </Text>
                    </Stack>
                </Box>

                <Divider />

                {/* Films Section */}
                <Box as="section" aria-labelledby="films-section">
                    <Heading id="films-section" size="md" color="teal.500" mb={2}>
                        {STRINGS['films']}
                    </Heading>
                    {filmsExist ? (
                        <UnorderedList>
                            {data.films.map((film: string, index: number) => (
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
                    {starshipsExist ? (
                        <UnorderedList>
                            {data.starships.map((ship: string, index: number) => (
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
