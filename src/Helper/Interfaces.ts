
export interface StackedToggleListGridViewProps {
    isListView: boolean;
    setIsListView: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface StackedStarWarsCharactersProps {
    isListView: boolean;
    results: Array<CharacterData>;
    colorScheme: string;
    favorites: Record<string, CharacterData>;
    handleFavToggle: (character: CharacterData) => void 
}

export interface FlexPaginationButtonsProps {
    colorScheme: string;
    isFetching: boolean;
    previous: string;
    handlePageChange: (newPage: number) => void
    page: number;
    next: string;
}

export interface CharactersData {
    count: number;
    next: string | null;
    previous: string | null;
    results: Array<CharacterData>;
}

export interface CharacterCardProps {
    character: CharacterData;
    handleFavouriteToggle: (character: CharacterData) => void;
    colorScheme?: string;
    isFavourite?: boolean;
}

export interface CharacterData {
    name: string;
    url: string;
    eye_color: string;
    hair_color: string;
    gender: string;
    homeworld: string;
    films: Array<string>;
    starships: Array<string>;
    height: string;
}

export interface CharacterDetailsApiResponse {
    data: CharacterData | undefined;
    isFetching: boolean;
    isError: boolean;
    error: unknown;
}

export interface CharacterListApiResponse {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<CharacterData>;
    isFetching: boolean;
    isError: boolean;
    error: unknown;
}