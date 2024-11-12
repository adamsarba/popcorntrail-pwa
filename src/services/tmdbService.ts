import axios from "axios";

const API_KEY = "fc479d0b099a6cdc31b3492cc700a715";
const BASE_URL = "https://api.themoviedb.org/3";

export const searchMovies = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
      params: {
        api_key: API_KEY,
        query: query,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};

export const getMovieById = async (id: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${id}`, {
      params: {
        api_key: API_KEY,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching movie by ID:", error);
    return null;
  }
};
