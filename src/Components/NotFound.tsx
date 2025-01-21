import { Box, Button, Heading, Stack, Text } from '@chakra-ui/react';
import { STRINGS } from '@src/lang/language';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
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
                {STRINGS["404pagenotfound"]}
            </Heading>
            <Text color="gray.600" fontSize="lg">
                {STRINGS["pagedoesnotexists"]}
            </Text>
            <Button
                as={Link}
                to="/"
                colorScheme="teal"
                size="lg"
                borderRadius="md"
            >
                {STRINGS["gohome"]}
            </Button>
        </Stack>
    </Box>
);

export default NotFound;
