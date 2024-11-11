import { useState, useEffect } from 'react';
import { Movie } from '../types/Movie';
import { getUserData, addMovieToWatchlist, removeMovieFromWatchlist, toggleWatchedStatus, toggleFavouriteStatus } from '../services/userService';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Eye, EyeOff, Star } from 'lucide-react';

interface MovieCardProps {
  movie: Movie;
  index: number;
  onMovieStatusChange?: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index, onMovieStatusChange }) => {
  const [isActive, setActive] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    const user = getUserData();
    if (user) {
      const movieInWatchlist = user.watchlist.find(item => item.movie.id === movie.id);
      setIsInWatchlist(!!movieInWatchlist);
      setIsWatched(movieInWatchlist ? movieInWatchlist.movie.watched : false);
      setIsFavourite(movieInWatchlist ? movieInWatchlist.movie.favourite : false);
    }
  }, [movie.id]);

  const handleAddToWatchlist = () => {
    addMovieToWatchlist(
      movie.id,
      movie.title || "",
      movie.poster_path || "",
      movie.release_date ? movie.release_date : ""
    );
    setIsInWatchlist(true);
  };

  const handleRemoveFromWatchlist = () => {
    removeMovieFromWatchlist(movie.id);
    setIsInWatchlist(false);
    setIsWatched(false);
    setIsFavourite(false);
    
    // Remove the movie from the current list
    if (onMovieStatusChange) {
      onMovieStatusChange(movie.id);
    }
  };

  const handleToggleWatched = () => {
    toggleWatchedStatus(
      movie.id,
      movie.title || "",
      movie.poster_path || "",
      movie.release_date ? movie.release_date : ""
    );

    // Update the isWatched state
    setIsWatched(prev => {
      const newWatchedStatus = !prev;
      if (onMovieStatusChange) {
        onMovieStatusChange(movie.id);
      }
      return newWatchedStatus;
    });

    if (!isWatched) {
      setIsInWatchlist(true);
    }
  };

  const handleToggleFavourite = () => {
    toggleFavouriteStatus(movie.id);
    setIsFavourite(prev => !prev);
  };

  // Hide context menu on scroll
  useEffect(() => {
    const handleScroll = () => setActive(false);
    const searchResultsElement = document.querySelector('.search-results') as HTMLElement;
    if (searchResultsElement) searchResultsElement.addEventListener('scroll', handleScroll);
    return () => {
      if (searchResultsElement) searchResultsElement.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.033 }}
      className={`relative flex items-center px-4 gap-4 py-2 hover:bg-neutral-900/[60%] cursor-pointer`}
      onClick={() => isActive ? setActive(false) : setActive(true) }
      onMouseLeave={() => setActive(false)}
    >
      <div className="flex-shrink-0 w-10 h-[3.75rem] rounded-md overflow-hidden">
        {movie.poster_path ? (
          <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt="Movie Poster" className="block size-full object-cover bg-neutral-900" />
        ) : (
          <div className="size-full bg-neutral-900" /> // no image placeholder
        )}
      </div>
      <div className="space-y-1">
        {movie.title && (
          <span className="text-lg font-medium leading-5 line-clamp-2">
            {movie.title}
          </span>
        )}
        {movie.release_date && (
          <span className="block text-sm leading-4 text-neutral-700">
            {movie.release_date.split('-')[0]}
          </span>
        )}
      </div>
      {isInWatchlist && !window.location.pathname.includes('/list') && (
        <div className={`absolute right-[1.25rem] size-4 rounded-full ${isWatched ? "bg-green" : "bg-blue"}`} />
      )}
      {isFavourite && window.location.pathname.includes('/list') && !window.location.pathname.includes('/favourites') && (
        <Star className="absolute right-[1.25rem] size-4 rounded-full text-orange fill-orange" />
      )}
      <AnimatePresence>
        {isActive && (
          <motion.div 
            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0 }}
            className="absolute top-[100%] z-50 mt-0 py-2.5 left-2.5 right-2.5 origin-top-right cursor-auto"
          >
            <div className="flex flex-col rounded-xl z-50 backdrop-blur-xl bg-neutral-800/75 ml-auto w-[80vw] max-w-[16rem] py-0.5 text-sm child:px-4 child:py-2 [&>:not(:last-child)]:border-b child:border-neutral-700 child:flex child:justify-between child:items-center child:gap-2 child:text-left child:cursor-pointer">
              {!isInWatchlist && (
                <button onClick={handleAddToWatchlist}>
                  Add to Watchlist
                  <Plus className="size-4" strokeWidth={2} />
                </button>
              )}
              <button onClick={handleToggleWatched}>
                {!isWatched ? (
                  <>
                    Mark as Watched
                    <Eye className="size-4" strokeWidth={2} />
                  </>
                ) : (
                  <>
                    Mark as Unwatched
                    <EyeOff className="size-4" strokeWidth={2} />
                  </>
                )}
              </button>
              {isInWatchlist && (
                <button onClick={handleToggleFavourite}>
                  {isInWatchlist && !isFavourite && ( "Add to Favourites" )}
                  {isFavourite && ( "Remove from Favourites" )}
                  <Star className="size-4" strokeWidth={2} />
                </button>
              )}
              {isInWatchlist && (
                <button onClick={handleRemoveFromWatchlist}>
                  Remove from Watchlist
                  <Minus className="size-4" strokeWidth={2} />
                </button>              
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};