import { useState, useEffect, useCallback } from "react";
import {
  getUserData,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  toggleWatchedStatus,
  toggleFavouriteStatus,
} from "../services/userService";
import { Movie } from "../types/Movie";

export const useMovieActions = (movie: Movie) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  const user = getUserData();

  const checkMovieStatus = useCallback(() => {
    if (user) {
      const movieInWatchlist = user.watchlist.find(
        (item) => item.movie.id === movie.id
      );
      setIsInWatchlist(!!movieInWatchlist);
      setIsWatched(movieInWatchlist ? movieInWatchlist.movie.watched : false);
      setIsFavourite(
        movieInWatchlist ? movieInWatchlist.movie.favourite : false
      );
    }
  }, [user, movie.id]);

  useEffect(() => {
    checkMovieStatus();
  }, [movie, user, checkMovieStatus]);

  const handleAddToWatchlist = () => {
    addMovieToWatchlist(
      movie.id,
      movie.title || "",
      movie.poster_path || "",
      movie.release_date || ""
    );
    setIsInWatchlist(true);
  };

  const handleRemoveFromWatchlist = () => {
    removeMovieFromWatchlist(movie.id);
    setIsInWatchlist(false);
    setIsWatched(false);
    setIsFavourite(false);
  };

  const handleToggleWatched = () => {
    toggleWatchedStatus(
      movie.id,
      movie.title || "",
      movie.poster_path || "",
      movie.release_date || ""
    );
    setIsWatched((prev) => !prev);
    if (!isWatched) {
      setIsInWatchlist(true);
    }
  };

  const handleToggleFavourite = () => {
    toggleFavouriteStatus(movie.id);
    setIsFavourite((prev) => !prev);
  };

  return {
    user,
    isInWatchlist,
    // setIsInWatchlist,
    isWatched,
    // setIsWatched,
    isFavourite,
    // setIsFavourite,
    handleAddToWatchlist,
    handleRemoveFromWatchlist,
    handleToggleWatched,
    handleToggleFavourite,
  };
};
