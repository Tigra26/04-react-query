import css from "./App.module.css";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../SearchBar/SearchBar";
import fetchMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import type { ComponentType } from "react";


type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [query, setQuery] = useState<string>("");
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState<number>(1);

  const {
  data,
  isLoading,
  isFetching,
  isError,
} = useQuery({
  queryKey: ["movies", query, page],
  queryFn: () => fetchMovies(query, page),
  enabled: query !== "",
});

const movies = data?.movies ?? [];
const totalPages = data?.totalPages ?? 0;

useEffect(() => {
  if (!data || query === "" || isFetching || isError) {
    return;
  }

  if (data.movies.length === 0) {
    toast.error("No movies found for your request.");
  }
}, [data, query, isFetching, isError]);


  const handleSearch = (newQuery: string) => {
   setQuery(newQuery.trim());
    setPage(1);
    setSelectedMovie(null);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const closeModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={css["app"]}>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />
       {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}
      {selectedMovie !== null && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
    </div>
  );
}
