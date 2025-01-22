import axios from "axios";
import { SWAPI_BASE_URL } from "../Helper/constants";

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

export interface CharacterListApiResponse {
    count: number;
    next?: string | null;
    previous?: string | null;
    results: Array<CharacterData>;
    isFetching: boolean;
}

// Cache for memoizing homeworld values (singleton)
export const homeworldCache = (() => {
    const cache = new Map<string, string>();
    return {
        get: (key: string) => cache.get(key),
        set: (key: string, value: string) => cache.set(key, value),
        has: (key: string) => cache.has(key),
        entries: () => Array.from(cache.entries()),
    };
})();

export const fetchCharacters = async (search: string, page: number): Promise<CharacterListApiResponse> => {
    try {
        // Fetch character data from SWAPI
        const response = await axios.get(
            `${SWAPI_BASE_URL}/?search=${encodeURIComponent(search)}&page=${page}`
        );
        const data: CharacterListApiResponse = response.data;
        // Return updated results
        return {
            ...data,
        };
    } catch (error) {
        console.error("Error fetching characters:", error);
        throw new Error("Failed to fetch characters and homeworlds");
    }
};

export const fetchHomeWorlds = async (charactersArray: Array<CharacterData>) => {
    for (const character of charactersArray) {
        const homeworldUrl = character.homeworld;
        // Log the current cache state
        if (homeworldCache.has(homeworldUrl)) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            character.homeworld = homeworldCache.get(homeworldUrl)!; // Use cached value
        } else {
            try {
                const homeworldResponse = await axios.get(homeworldUrl);
                const homeworldName = homeworldResponse.data.name;
                character.homeworld = homeworldName; // Replace URL with name
                homeworldCache.set(homeworldUrl, homeworldName); // Cache the result
            } catch (error) {
                console.error(`Failed to fetch homeworld for ${character.name}:`, error);
                character.homeworld = "Unknown"; // Fallback value
                homeworldCache.set(homeworldUrl, "Unknown"); // Cache fallback value
            }
        }
    }
    return charactersArray;
}

export const fetchCharacterDetails = async (id: string) => {
    const response = await axios.get(`${SWAPI_BASE_URL}/${id}/`);
    return response.data;
}

export const fetchHomeWorldDetails =  async (character: CharacterData) => {
    if (!character?.homeworld) return null;
    const response = await axios.get(character.homeworld);
    return response.data.name;
}

export const fetchCharacterFilms = async (character: CharacterData) => {
    if (!character?.films?.length) return [];
    const responses = await Promise.all(
        character.films.map((url: string) => axios.get(url).then((res) => res.data.title))
    );
    return responses;
}

export const fetchStarshipDetails = async (character: CharacterData) => {
    if (!character?.starships?.length) return [];
    const responses = await Promise.all(
        character.starships.map((url: string) => axios.get(url).then((res) => res.data.name))
    );
    return responses;
}