import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { usePWA } from "../context/PWAContext";

import { getUserData } from "../services/userService";

import { TopBar } from "../components/TopBar";
import { Movie } from "../types/Movie";
import { MovieCard } from "../components/MovieCard";

import { motion } from "framer-motion";
import { Rabbit, Bird, Cat, Snail, Turtle } from "lucide-react";

const icons = [
  <Rabbit className="size-[1em]" strokeWidth={1} />,
  <Bird className="size-[1em]" strokeWidth={1} />,
  <Cat className="size-[1em]" strokeWidth={1} />,
  <Snail className="size-[1em]" strokeWidth={1} />,
  <Turtle className="size-[1em]" strokeWidth={1} />,
];

export function ListPage() {
  const isPWA = usePWA();
  const { listName } = useParams();
  const [randomIcon, setRandomIcon] = useState<JSX.Element | null>(null);
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [isSortedAscending, setIsSortedAscending] = useState(true);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const [groupedMovies, setGroupedMovies] = useState<Record<number, Movie[]>>({}); // prettier-ignore
  const [visibleMoviesCount, setVisibleMoviesCount] = useState(20);

  // Temporary fix for .overflow-hidden on body
  document.body.classList.remove("overflow-hidden");

  const toggleSortOrder = () => {
    setIsSortedAscending((prev) => !prev);
  };

  useEffect(() => {
    // Fetch user data when the component mounts
    const user = getUserData();
    if (!user) return;

    // Get movies from user's watchlist and sort them by release date
    setUserMovies(
      user.watchlist
        .map((item) => item.movie)
        .sort((a, b) =>
          isSortedAscending
            ? new Date(a.release_date || "").getTime() -
              new Date(b.release_date || "").getTime()
            : new Date(b.release_date || "").getTime() -
              new Date(a.release_date || "").getTime()
        )
    );

    // Select a random icon for empty lists
    const randomIndex = Math.floor(Math.random() * icons.length);
    setRandomIcon(icons[randomIndex]);
  }, [isSortedAscending]);

  // Filter movies based on listName
  useEffect(() => {
    const currentDate = new Date();

    const filterMovies = () => {
      if (listName === "watchlist") {
        setFilteredMovies(
          userMovies.filter(
            (movie) => !movie.watched && new Date(movie.release_date || "") <= currentDate // prettier-ignore
          )
        );
      } else if (listName === "upcoming") {
        setFilteredMovies(
          userMovies.filter(
            (movie) =>
              new Date(movie.release_date || "") > currentDate && !movie.watched
          )
        );
      } else if (listName === "watched") {
        setFilteredMovies(userMovies.filter((movie) => movie.watched));
      } else if (listName === "favourites") {
        setFilteredMovies(userMovies.filter((movie) => movie.favourite));
      }
    };

    filterMovies();
  }, [userMovies, listName]);

  // Group movies by year whenever filteredMovies or visibleMoviesCount changes
  useEffect(() => {
    const newGroupedMovies = filteredMovies.slice(0, visibleMoviesCount).reduce(
      (acc, movie) => {
        const year = new Date(movie.release_date || "").getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(movie);
        return acc;
      },
      {} as Record<number, Movie[]>
    );

    setGroupedMovies(newGroupedMovies);
  }, [filteredMovies, visibleMoviesCount]);

  // Load more movies when the user scrolls to the bottom
  const loadMoreMovies = useCallback(() => {
    setVisibleMoviesCount((prevCount) => prevCount + 30);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - window.innerHeight * 0.5; // 25% of window height from the bottom
      if (bottom) loadMoreMovies();
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loadMoreMovies]);

  // Update the list on movie status change in MovieCard
  const handleMovieStatusChange = (movieId: string) => {
    setFilteredMovies((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  return (
    <>
      <TopBar backLink="/" onSortToggle={toggleSortOrder} />

      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`pb-24 pt-0`}
        style={
          isPWA
            ? { paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }
            : {}
        }
      >
        {/* List Name */}
        <motion.h1
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className={`truncate px-3 text-3xl font-bold capitalize`}
        >
          {listName?.replace(/-/g, " ")}
        </motion.h1>

        {/* Movies */}
        {filteredMovies.length > 0 ? (
          <>
            {Object.entries(groupedMovies).map(([year, movies]) => (
              <div key={year}>
                <h2 className="px-3 py-2 font-medium text-neutral-600">
                  {year}
                </h2>
                <ul>
                  {movies.map((movie /* index */) => (
                    <li key={movie.id}>
                      <MovieCard
                        movie={movie}
                        // index={index}
                        onMovieStatusChange={handleMovieStatusChange}
                      />
                      <hr className="ml-[4.375rem] border-neutral-800" />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        ) : (
          <div className="grid h-[calc(50vh)] place-items-center px-3 text-center text-neutral-500">
            <div>
              <span className="mb-2 flex justify-center text-center text-6xl">
                {randomIcon}
              </span>
              <p>No movies in this list yet. Add some!</p>
            </div>
          </div>
        )}
      </motion.main>
    </>
  );
}
