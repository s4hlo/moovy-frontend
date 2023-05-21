import MovieOmdbList from "../components/MovieOmdbList";
import { Paper, InputBase } from "@mui/material";
import MainLayout from "../components/MainLayout";
import { useState, useEffect, useRef, useContext } from "react";
import { searchMovie } from "../api/auth";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  startWith,
  switchMap,
} from "rxjs/operators";
import { fromEvent, of } from "rxjs";
import SearchIcon from "@mui/icons-material/Search";
import { AuthContext } from "../contexts/AuthContext";

type Movie = {
  imdbID: string;
  title: string;
  poster: string;
  imdbRating: number;
  userHasMovie: boolean;
};

function Search() {
  const moviesPlaceHolder = [
    {
      imdbID: "tt0372784",
      title: "Batman Begins",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      imdbRating: 8.2,
      userHasMovie: true,
    },
    {
      imdbID: "tt0468569",
      title: "The Dark Knight",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      imdbRating: 9.0,
      userHasMovie: false,
    },
    {
      imdbID: "tt1345836",
      title: "The Dark Knight Rises",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      imdbRating: 8.4,
      userHasMovie: false,
    },
    {
      imdbID: "tt0372784",
      title: "Batman Begins",
      poster:
        "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
      imdbRating: 8.2,
      userHasMovie: true,
    },
  ];

  const [movies, setMovies] = useState<Movie[]>(moviesPlaceHolder);

  const searchInputRef = useRef<HTMLInputElement>(null);

  //get token updated token from context
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!searchInputRef.current) return;

    const search$ = fromEvent(searchInputRef.current, "input").pipe(
      debounceTime(500),
      distinctUntilChanged(),
      startWith({ target: { value: "" } }),
      switchMap((event) => {
        const searchTerm = event.target.value;

        if (searchTerm.length < 3) {
          return of(moviesPlaceHolder);
        } else {
          return searchMovie(token, searchTerm);
        }
      })
    );

    const subscription = search$.subscribe(setMovies);

    return () => subscription.unsubscribe();
  }, []);

  return (
    <MainLayout>
      <>
        <h1> Search </h1>
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            alignSelf: "flex-end",
            width: 400,
            borderRadius: "10px",
          }}
        >
          <InputBase
            ref={searchInputRef}
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search your favorite movies"
            inputProps={{ "aria-label": "Search your favorite movies" }}
          />
          <SearchIcon />
        </Paper>
       <MovieOmdbList movies={movies} />
      </>
    </MainLayout>
  );
}

export default Search;
