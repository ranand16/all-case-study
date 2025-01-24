import { Button, Flex } from '@chakra-ui/react';
import React from 'react';
import { FlexPaginationButtonsProps } from '../Helper/Interfaces';
import { STRINGS } from '../lang/language';

export function FlexPaginationButtons({
    colorScheme, 
    isFetching, 
    previous, 
    handlePageChange, 
    page, 
    next
}: FlexPaginationButtonsProps) {
    return (
        <Flex justifyContent="space-between" mt={6}>
            <Button colorScheme={colorScheme} disabled={isFetching || !previous} onClick={() => handlePageChange(page - 1)} aria-label="Go to the previous page">
                {STRINGS["prev"]}
            </Button>
            <Button colorScheme={colorScheme} disabled={isFetching || !next} onClick={() => handlePageChange(page + 1)} aria-label="Go to the next page">
                {STRINGS["next"]}
            </Button>
        </Flex>
    );
}
