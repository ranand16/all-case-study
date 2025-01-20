import { SWAPI_BASE_URL } from "@src/Helper/constants";
import axios from "axios";

export const fetchCharacters = async (search: string, page: number) => {
    const response = await axios.get(`${SWAPI_BASE_URL}/?search=${search}&page=${page}`);
    return response.data;
};

export const fetchCharacterDetails = async (id: string) => {
    const charResponse = await axios.get(`${SWAPI_BASE_URL}/${id}/`);
    const charData = charResponse.data;

    const homeworldResponse = await axios.get(charData.homeworld);
    const homeworld = homeworldResponse.data.name;

    const filmPromises = charData.films.map((url: string) => axios.get(url));
    const filmResponses = await Promise.all(filmPromises);
    const films = filmResponses.map((res) => res.data.title);

    const starshipPromises = charData.starships.map((url: string) => axios.get(url));
    const starshipResponses = await Promise.all(starshipPromises);
    const starships = starshipResponses.map((res) => res.data.name);

    return { ...charData, homeworld, films, starships };
};

export const fetchHomeworld = async (url: string): Promise<string> => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch homeworld');
    }
    const data = await response.json();
    return data.name; // Assuming the API returns a `name` field for the planet
};

// export const api = {
//     fetchCharacters: jest.fn()
// };