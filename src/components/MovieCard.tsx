import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPortal } from "react-dom";

import { Movie } from "../types/Movie";
import { useMovieActions } from "../hooks/useMovieActions";

import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Heart,
  HeartOff,
  ChevronRight,
} from "lucide-react";

interface MovieCardProps {
  movie: Movie;
  index?: number;
  onMovieStatusChange?: (movieId: string) => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  // index,
  onMovieStatusChange,
}) => {
  const { pathname } = useLocation();
  const [imageError, setImageError] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  // const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  const {
    isInWatchlist,
    isWatched,
    isFavourite,
    handleAddToWatchlist,
    handleRemoveFromWatchlist,
    handleToggleWatched,
    handleToggleFavourite,
  } = useMovieActions(movie);

  // Preload larger image when component mounts
  // useEffect(() => {
  //   if (movie.poster_path) {
  //     const largeImage = new Image();
  //     largeImage.src = `https://image.tmdb.org/t/p/w154${movie.poster_path}`;
  //     largeImage.onload = () => {
  //       setLoadedImages((prev) => ({ ...prev, large: true }));
  //     };
  //   }
  // }, [movie.poster_path]);

  /**
   * Handle movie status changes
   */

  const toggleWatched = () => {
    handleToggleWatched(); // Default behavior
    // Notify parent* if user is not on the Favourites list
    if (pathname === "/list/favourites" || !onMovieStatusChange) return;
    onMovieStatusChange(movie.id);
  };

  const toggleFavourite = () => {
    handleToggleFavourite(); // Default behavior
    if (pathname === "/list/favourites" && onMovieStatusChange) {
      onMovieStatusChange(movie.id); // Notify parent
    }
  };

  const removeFromWatchlist = () => {
    handleRemoveFromWatchlist(); // Default behavior
    if (onMovieStatusChange) onMovieStatusChange(movie.id); // Notify parent
  };

  /**
   *
   * Context Menu
   *
   */

  const handleContextMenuOpen = (event: React.MouseEvent) => {
    event.preventDefault();
    setIsContextMenuVisible(true);
    setIsAnimating(true);
  };

  const handleContextMenuClose = () => {
    setIsContextMenuVisible(false);
    // Don't reset isAnimating here - let AnimatePresence handle it
  };

  // Long press to show context menu
  const handleTouchStart = () => {
    setLongPressTimer(
      setTimeout(() => {
        setIsContextMenuVisible(true);
        setIsAnimating(true);
      }, 300) // Adjust the duration for long press
    );
  };

  // Clear the timer on touch end
  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };

  // Hide context menu on scroll
  useEffect(() => {
    const handleScroll = () => setIsContextMenuVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /**
   *
   */

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.033 }} // index < 0 ? index * 0.033 :
          className={`relative ${isAnimating ? "z-50" : ""} flex items-center`}
          // Mobile
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          // Desktop
          onContextMenu={handleContextMenuOpen}
          onClick={handleContextMenuClose}
          // onMouseLeave={handleContextMenuClose}
        >
          {/* Movie Link */}
          <Link
            to={`/movie/${movie.id}`}
            state={{
              previousPath: location.search
                ? `${pathname}${location.search}`
                : pathname,
            }}
            className={`flex w-[100%] items-center gap-4 px-3 py-2 transition-all duration-150 active:bg-neutral-800/50 sm:hover:bg-neutral-800/50 ${
              isInWatchlist || isContextMenuVisible ? "pr-11" : ""
            } ${
              isContextMenuVisible
                ? "mx-2 my-2.5 rounded-xl !bg-neutral-800/75 py-4 pl-4 backdrop-blur-sm"
                : ""
            } `}
          >
            <div
              className={`flex-shrink-0 overflow-hidden transition-all ${
                !isContextMenuVisible
                  ? "h-[3.75rem] w-10 rounded-md"
                  : "h-48 w-32 rounded-lg"
              }`}
            >
              {!imageError && movie.poster_path ? (
                <div className="relative size-full bg-neutral-900 object-cover transition-opacity duration-150">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                    alt="Movie Poster"
                    className={`absolute size-full object-cover transition-opacity duration-300 ${
                      isContextMenuVisible // && loadedImages.large
                        ? "opacity-0"
                        : "opacity-100"
                    }`}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    // onLoad={() => setLoadedImages(prev => ({ ...prev, small: true }))}
                  />

                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt="Movie Poster"
                    className={`absolute size-full object-cover transition-opacity duration-300 ${
                      isContextMenuVisible // && loadedImages.large
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                    loading="lazy"
                    onError={() => setImageError(true)}
                    // onLoad={() => setLoadedImages(prev => ({ ...prev, large: true }))}
                  />
                </div>
              ) : (
                <div className="size-full bg-neutral-900" />
              )}
            </div>
            <div
              className={`flex-grow child:transition-all child:duration-300 ${
                isContextMenuVisible && movie.original_title !== movie.title
                  ? "space-y-2"
                  : "space-y-1"
              }`}
            >
              {movie.title && (
                <span
                  className={`text-lg font-medium leading-5 text-neutral-600 ${
                    !isContextMenuVisible ? "line-clamp-2" : "line-clamp-6"
                  }`}
                >
                  <span className="text-neutral-100">{movie.title}</span>
                  {movie.original_title &&
                    movie.original_title !== movie.title && (
                      <>
                        <span
                          className={`${isContextMenuVisible ? "hidden" : ""}`}
                        >
                          {" "}
                          /{" "}
                        </span>
                        <span
                          className={`${isContextMenuVisible ? "mt-1 block text-sm leading-4" : ""}`}
                        >
                          {movie.original_title}
                        </span>
                      </>
                    )}
                </span>
              )}
              {movie.release_date && (
                <span className="block text-sm leading-4 text-neutral-600">
                  {new Date(movie.release_date).toLocaleString("default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
          </Link>

          {/* Watch Status Icons */}
          <AnimatePresence>
            {((isInWatchlist && !pathname.includes("/list")) ||
              (isFavourite &&
                pathname.includes("/list") &&
                !pathname.includes("/favourites"))) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5, right: "1.25rem" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  right: isContextMenuVisible ? "1.55rem" : "1.25rem",
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                }}
                className="absolute right-[1.25rem]"
              >
                {isInWatchlist && !pathname.includes("/list") && (
                  <div
                    className={`size-4 rounded-full transition-colors duration-150 ${isWatched ? "bg-green" : "bg-blue"}`}
                  />
                )}
                {isFavourite &&
                  pathname.includes("/list") &&
                  !pathname.includes("/favourites") && (
                    <Heart className="size-4 fill-rose-600 text-rose-600" />
                  )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Link Arrow Icon */}
          {/* <AnimatePresence> */}
          {((pathname.includes("/list") &&
            isContextMenuVisible &&
            !isFavourite) ||
            (pathname === "/search" &&
              isContextMenuVisible &&
              !isInWatchlist)) && (
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={!isInWatchlist ? { opacity: 0, x: 15 } : { opacity: 0 }}
              className="translate-z-0 absolute right-[1.5rem] z-[50]"
              style={{
                transform: "translateZ(0)",
                willChange: "transform",
              }}
            >
              <ChevronRight
                className="size-5 text-neutral-100/50"
                strokeWidth={2}
              />
            </motion.div>
          )}
          {/* </AnimatePresence> */}

          {/* Context Menu */}
          <AnimatePresence>
            {isContextMenuVisible && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute left-2.5 right-2.5 top-[100%] z-[50] mt-0 origin-top-right cursor-auto" // py-2.5
              >
                <div className="z-50 ml-auto flex w-[80vw] max-w-[16rem] flex-col overflow-hidden rounded-xl bg-neutral-800/75 text-sm backdrop-blur-xl child:flex child:items-center child:justify-between child:gap-2 child:border-neutral-700 child:px-4 child:py-2.5 child:text-left hover:child:bg-neutral-800 [&>:not(:last-child)]:border-b">
                  {!isInWatchlist && (
                    <button onClick={handleAddToWatchlist}>
                      Add to Watchlist
                      <Plus className="size-4" />
                    </button>
                  )}
                  <button onClick={toggleWatched}>
                    {!isWatched ? (
                      <>
                        Mark as Watched
                        <Eye className="size-4" />
                      </>
                    ) : (
                      <>
                        Mark as Unwatched
                        <EyeOff className="size-4" />
                      </>
                    )}
                  </button>
                  {isInWatchlist && (
                    <button onClick={toggleFavourite} className="!border-0">
                      {!isFavourite ? (
                        <>
                          Add to Favourites
                          <Heart className="size-4" />
                        </>
                      ) : (
                        <>
                          Remove from Favourites
                          <HeartOff className="size-4" />
                        </>
                      )}
                    </button>
                  )}
                  {isInWatchlist && (
                    <>
                      <span className="separator !cursor-default !border-0 !bg-neutral-950/50 !p-1" />
                      <button
                        onClick={removeFromWatchlist}
                        className="text-red"
                      >
                        Remove from Watchlist
                        <Trash2 className="size-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Move Background Blur outside the parent MovieCard */}
      {createPortal(
        <AnimatePresence
          onExitComplete={() => {
            setIsAnimating(false);
          }}
        >
          {isContextMenuVisible && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleContextMenuClose}
              className="fixed inset-0 z-40 bg-black/75 backdrop-blur-sm"
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};
