import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

import { Movie } from "../types/Movie";
import { useMovieActions } from "../hooks/useMovieActions";

import { usePWA } from "../context/PWAContext";
import { shareOnMobile } from "react-mobile-share";
import { motion, AnimatePresence } from "framer-motion";
import {
  CircleEllipsis,
  ChevronLeft,
  ChevronRight,
  Pencil,
  ArrowUpDown,
  Cog,
  Plus,
  Eye,
  EyeOff,
  Heart,
  HeartOff,
  List,
  Tag,
  ThumbsUp,
  Trash2,
  Share,
} from "lucide-react";

interface TopBarProps {
  loading?: boolean;
  backLink?: string;
  title?: string;
  searchBar?: boolean;
  isSearchActive?: boolean;
  movie?: Movie;
  onSortToggle?: () => void;
  children?: React.ReactNode;
}

export function TopBar({
  loading,
  backLink,
  title,
  searchBar,
  isSearchActive,
  movie,
  // onSortToggle,
  children,
}: TopBarProps) {
  const isPWA = usePWA();
  const pathname = useLocation().pathname;
  const paths = ["/search", "/list", "/movie", "/settings"];
  const isHome = pathname === "/";
  const [isSearch, isList, isMoviePage, isSettings] = paths.map((path) =>
    pathname.includes(path)
  );
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  // const [isSortMenuVisible, setIsSortMenuVisible] = useState(false);
  const {
    // Movie actions
    user,
    isInWatchlist,
    isWatched,
    isFavourite,
    handleAddToWatchlist,
    handleRemoveFromWatchlist,
    handleToggleWatched,
    handleToggleFavourite,
  } = useMovieActions(movie || ({} as Movie));
  // Context menu position
  const buttonRef = useRef<SVGSVGElement | null>(null);
  const [rightPosition, setRightPosition] = useState<number | undefined>(
    undefined
  );
  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const rightPosition = window.innerWidth - rect.right;
      setRightPosition(rightPosition - 3);
    }
  };

  // TODO: For server side rendering

  // // Fetch image when movie is available
  // // For: Open Graph meta tags and sharing via share sheet

  // const [imgBase64, setImgBase64] = useState<string | null>(null);
  // useEffect(() => {
  //   if (!movie) return;

  //   const fetchImageAsBase64 = async (url: string) => {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     return new Promise<string>((resolve) => {
  //       reader.onloadend = () => {
  //         resolve(reader.result as string);
  //       };
  //     });
  //   };

  //   if (movie.poster_path)
  //     fetchImageAsBase64(
  //       "https://image.tmdb.org/t/p/w500" + movie.poster_path
  //     ).then(setImgBase64);
  // }, [movie]);

  const toggleContextMenu = () => {
    if (!isContextMenuVisible) updatePosition();
    setIsContextMenuVisible(!isContextMenuVisible);
  };

  // const toggleSortMenu = () => {
  //   setIsSortMenuVisible(!isSortMenuVisible);
  // };

  const handleClickOutside = () => {
    // Hide context menu
    if (contextMenuRef.current) setIsContextMenuVisible(false);
  };

  const handleScroll = () => {
    // Hide context menu
    setIsContextMenuVisible(false);
  };

  // useEffect hook to add event listeners for mousedown and scroll events
  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);
    window.addEventListener("scroll", handleScroll);
    if (window.innerWidth > 640)
      window.addEventListener("resize", updatePosition);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);

      if (window.innerWidth > 640)
        window.removeEventListener("resize", updatePosition);
    };
  }, []);

  return (
    <>
      <header
        className={`container sticky top-0 z-40 w-full overflow-x-hidden bg-black/50 px-3 py-3 backdrop-blur-xl transition-all duration-300 ${
          isHome && user ? "flex flex-col gap-3" : ""
        } ${!isPWA && isSearchActive ? "!pt-0" : ""}`}
        style={
          isPWA
            ? isSearchActive
              ? { paddingTop: "env(safe-area-inset-top)" }
              : { paddingTop: "calc(0.75rem + env(safe-area-inset-top))" }
            : {}
        }
      >
        <div
          className={`${isSearch ? "hidden" : ""} flex items-start justify-between gap-4 transition-all duration-300 ${
            isContextMenuVisible
              ? backLink
                ? "cursor-pointer"
                : "ml-auto w-fit cursor-pointer"
              : ""
          } ${isSearchActive ? (!isPWA ? "-mt-6" : "-mt-6") : ""}`}
        >
          {/* Back Button */}
          {backLink ? (
            <Link
              to={isSearch || isList ? "/" : backLink}
              className={`back-btn ${
                !isMoviePage ? "-my-1" : ""
              } -ml-3 flex items-center gap-2 p-1 text-accent sm:transition-opacity sm:duration-300 sm:hover:!opacity-50`}
            >
              <div
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                className={`shrink-0 p-1 transition-all duration-300`}
              >
                <ChevronLeft
                  className={`-m-2 box-content size-6`}
                  strokeWidth={2.5}
                />
              </div>
              <motion.h1
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {isMoviePage ? " " : title ? title : "PopcornTrail"}
              </motion.h1>
            </Link>
          ) : (
            <span />
          )}
          {/* Title */}
          {isSettings && pathname.includes("/account") && (
            <motion.h1
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="absolute left-1/2 !-translate-x-1/2 font-semibold"
            >
              Account
            </motion.h1>
          )}
          {/* Share Button */}
          {!loading && isMoviePage && movie !== undefined && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3, ease: "easeInOut" }}
              onClick={() => {
                shareOnMobile({
                  text: user
                    ? isInWatchlist
                      ? "Check out this movie I have on my Watchlist on PopcornTrail!"
                      : "Check out this movie I found on PopcornTrail!"
                    : // : isWatched
                      //   ? "Check out this movie I just watched!"
                      //   : isFavourite
                      //     ? "Check out one of my favourite movies!"
                      //     : "Check out this movie I found on PopcornTrail!"
                      "Check out this movie I found on PopcornTrail!",
                  title: `${movie?.title} (${movie?.release_date?.split("-")[0]})`,
                  url: location.pathname,
                  // images: imgBase64 ? [imgBase64] : [],
                });
              }}
              className={`share-btn -m-2 p-2 text-accent active:opacity-25 sm:transition-opacity sm:duration-300 sm:hover:!opacity-50`}
              style={{ marginLeft: "auto" }}
            >
              <Share className="size-6" />
            </motion.button>
          )}
          {/* Options Button */}
          {!isSettings && user && (
            <button
              // initial={isMoviePage ? { rotate: "0deg" } : {}}
              // animate={isMoviePage ? { rotate: "180deg" } : {}}
              // transition={isMoviePage ? { duration: 0.9, type: "spring" } : {}}
              // initial={isMoviePage ? { opacity: 0 } : {}}
              // animate={isMoviePage ? { opacity: 1 } : {}}
              // transition={isMoviePage ? { delay: 0.15 } : {}}
              onClick={toggleContextMenu}
              className={`more-btn ${
                isMoviePage && movie == undefined ? "hidden" : ""
              } -m-2 p-2 text-accent transition-all duration-300 ${
                isContextMenuVisible
                  ? "pointer-events-none opacity-25"
                  : "sm:transition-opacity sm:duration-300 sm:hover:!opacity-50"
              } ${isSearchActive ? "pointer-events-none opacity-0" : ""}`}
            >
              <CircleEllipsis ref={buttonRef} className="size-6" />
            </button>
          )}
        </div>

        {searchBar && children}
      </header>

      {/* Context Menu */}
      <AnimatePresence>
        {isContextMenuVisible && (
          <motion.nav
            ref={contextMenuRef}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className={`context-menu-container overflow-hidden`}
            // className={`context-menu-container ${!isSortMenuVisible ? "overflow-hidden" : ""}`}
            style={{
              boxShadow: "0 1rem 1.5rem rgba(0, 0, 0, 0.25)",
              top: "calc(env(safe-area-inset-top) + 3rem)",
              ...(window.innerWidth > 1024 && rightPosition
                ? { right: rightPosition }
                : {}),
            }}
          >
            <ul className={`context-menu ${isList ? "with-submenu" : ""}`}>
              {(isHome || isList) && !isMoviePage && (
                <li className="disabled">
                  Edit {isList ? " list" : "lists"}
                  <Pencil className="size-4" />
                </li>
              )}
              {isList && (
                <>
                  <li
                    // onClick={onSortToggle}
                    className="disabled"
                  >
                    <ChevronRight
                      className={`absolute left-2.5 size-4`}
                      // className={`absolute left-2.5 size-4 ${isSortMenuVisible ? "rotate-90" : ""}`}
                    />
                    <span>
                      Sort by
                      <span className="-mt-0.5 block text-xs text-neutral-600">
                        Release Date
                      </span>
                    </span>
                    {/* <ChevronUp className={`size-4 scale-[140%]`} /> */}
                    <ArrowUpDown className="size-4" />
                  </li>
                </>
              )}
              {isMoviePage && (
                <>
                  {!isInWatchlist && (
                    <li onClick={handleAddToWatchlist}>
                      Add to Watchlist
                      <Plus className="size-4" />
                    </li>
                  )}
                  <li onClick={handleToggleWatched}>
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
                  </li>
                  {isInWatchlist && (
                    <li onClick={handleToggleFavourite} className="!border-0">
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
                    </li>
                  )}
                  <li className="separator" />
                  <li className="disabled">
                    Add to Custom List
                    <List className="size-4" strokeWidth={2.5} />
                  </li>
                  <li className="disabled">
                    Add Tag
                    <Tag className="size-4" />
                  </li>
                  <li className="separator" />
                  {/* <li className="disabled">
                    Show Similar Movies
                    <Icon className="size-4" strokeWidth={2.5} />
                  </li> */}
                  <li className="disabled">
                    Show Recommendations
                    <ThumbsUp className="size-4" />
                  </li>
                  {isInWatchlist && (
                    <>
                      <li className="separator" />
                      <li
                        onClick={handleRemoveFromWatchlist}
                        className="text-red"
                      >
                        Remove from Watchlist
                        <Trash2 className="size-4" />
                      </li>
                    </>
                  )}
                </>
              )}
              {!isMoviePage && (
                <>
                  <li className="separator" />
                  <li>
                    <Link to="/settings">
                      Settings <Cog className="size-4" />
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
