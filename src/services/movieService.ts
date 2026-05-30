import axios from "axios";
import type { Movie } from "../types/movie";

interface FetchMoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export interface FetchMoviesData {
  movies: Movie[];
  totalPages: number;
}

const movieApi = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
  },
});

const fetchMovies = async (query: string,
  page: number
): Promise<FetchMoviesData> => {
  const params = {
    query, 
    page,
    include_adult: false,
    language: "en-US",
  };

  const response = await movieApi.get<FetchMoviesResponse>("/search/movie", {
    params,
  });

  return {
    movies: response.data.results,
    totalPages: response.data.total_pages,
  };
};

export default fetchMovies;
