import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { TopBar } from "../components/TopBar";
import { SearchBar } from "../components/SearchBar";
import { MovieCard } from "../components/MovieCard";

import { Movie } from "../types/Movie";
import { searchMovies } from "../services/tmdbService";

import { motion } from "framer-motion";
import { Bird } from "lucide-react";

export function SearchResultsPage() {
  const location = useLocation();
  const [query, setQuery] = useState(
    new URLSearchParams(location.search).get("query") || ""
  );
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(true); // New state for search activation
  const [isLoading, setIsLoading] = useState(true); // New loading state

  // Temporary fix for .overflow-hidden on body
  document.body.classList.remove("overflow-hidden");

  useEffect(() => {
    const fetchResults = setTimeout(async () => {
      if (query) {
        const results = await searchMovies(query);
        setSearchResults(results);
        setIsLoading(false);
      } else {
        setSearchResults([]);
        setIsLoading(true);
      }
    }, 300); // axios debounce

    return () => {
      clearTimeout(fetchResults);
    };
  }, [query]);

  return (
    <>
      <TopBar searchBar>
        <SearchBar
          onSearch={(value) => {
            setQuery(value);
          }}
          isSearchActive={isSearchActive}
          onSearchActivate={() => setIsSearchActive(true)}
          onSearchDeactivate={() => setIsSearchActive(false)}
        />
      </TopBar>

      <main
        className="select-none pb-24 pt-0"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)",
        }}
      >
        <span className="sr-only">Search results:</span>
        {searchResults.length > 0 ? (
          <ul>
            {searchResults.map((movie /* index */) => (
              <li key={movie.id}>
                <MovieCard
                  movie={movie}
                  // index={index}
                />
                <hr className="ml-[4.375rem] border-neutral-700/50" />
              </li>
            ))}
          </ul>
        ) : !isLoading && searchResults.length === 0 ? (
          <div className="grid h-[calc(50vh)] place-items-center px-3 text-neutral-500">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <span className="mb-2 flex justify-center text-center text-6xl">
                <Bird className="size-[1em]" strokeWidth={1} />
              </span>
              <p>
                <span className="sr-only">No results.</span>
                There are no Movies you are looking for...
              </p>
            </motion.div>
          </div>
        ) : null}
      </main>
    </>
  );
}
