import { IconButton, Stack } from '@chakra-ui/react';
import React from 'react';
import { FaRegListAlt } from 'react-icons/fa';
import { FiGrid } from 'react-icons/fi';
import { StackedToggleListGridViewProps } from '../Helper/Interfaces';


export function StackedToggleListGridView({
    isListView, 
    setIsListView
}: StackedToggleListGridViewProps) {
    return (
        <Stack direction={"row"}>
            {<IconButton icon={<FaRegListAlt />} variant="ghost" isActive={isListView} size="sm" onClick={() => setIsListView(true)} aria-label={isListView ? `Listed result` : `Card results`} />}
            {<IconButton icon={<FiGrid />} variant="ghost" size="sm" isActive={!isListView} onClick={() => setIsListView(false)} aria-label={isListView ? `Listed result` : `Card results`} />}
        </Stack>
    );
}
