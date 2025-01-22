import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import React from 'react';
import { Link } from 'react-router-dom';

export interface EmptyPageProps {
    heading: string,
    message: string,
    toPage: string | Partial<{
        pathname: string;
        search: string;
        hash: string;
    }>,
    linktext: string
}

const EmptyPage: React.FC<EmptyPageProps> = ({
    heading,
    message,
    toPage,
    linktext
}) => {
    return (
        <Box
            textAlign="center"
            py={10}
            px={6}
            minH="100vh"
            bg="gray.50"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Stack spacing={6} align="center">
                <Heading
                    display="inline-block"
                    as="h2"
                    size="2xl"
                    bgGradient="linear(to-r, teal.400, teal.600)"
                    backgroundClip="text"
                >
                    {heading}
                </Heading>
                <Text color="gray.600" fontSize="lg">
                    {message}
                </Text>
                <Button
                    as={Link}
                    to={toPage}
                    colorScheme="teal"
                    size="lg"
                    borderRadius="md"
                >
                    {linktext}
                </Button>
            </Stack>
        </Box>
    );
}

export default EmptyPage;