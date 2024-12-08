import { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";

import { TopBar } from "../components/TopBar";

import { Movie } from "../types/Movie";
import { getMovieById, getMovieCredits } from "../services/tmdbService";
import { useMovieActions } from "../hooks/useMovieActions";

import { Spinner } from "../components/ui/Spinner";
import { motion } from "framer-motion";
import {
  Star,
  Plus,
  Check,
  Heart,
  Eye,
  ArrowUpRight,
  ChevronRight,
  HeartCrack,
  Bot,
} from "lucide-react";
import { Copyrights } from "../components/Copyrights";

// TODO: Update user's movie data if it exists in user's watchlist

interface MovieDetails extends Movie {
  backdrop_path?: string;
  vote_average?: number;
  vote_count?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  overview?: string;
  status?: string;
  production_countries?: { name: string }[];
  // original_language?: string;
  spoken_languages?: { english_name: string }[];
  production_companies?: { name: string }[];
  budget?: number;
  revenue?: number;
  directors?: { name: string }[];
  writers?: { name: string }[];
  cast?: string[];
  homepage?: string;
}

export function MoviePage() {
  const location = useLocation();
  const { movieId } = useParams<{ movieId: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [backdropUrl, setBackdropUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [posterError, setPosterError] = useState(false);

  const overviewRef = useRef<HTMLParagraphElement | null>(null);
  const initialOverviewHeight = overviewRef.current?.clientHeight;

  // Temporary fix for .overflow-hidden on body
  document.body.classList.remove("overflow-hidden");

  const {
    // Movie actions
    user,
    isInWatchlist,
    isWatched,
    isFavourite, // Removed due to redeclaration
    handleAddToWatchlist,
    handleToggleWatched,
  } = useMovieActions(movie || ({} as Movie));

  // Fetch movie data
  useEffect(() => {
    const fetchMovieData = async () => {
      setLoading(true);

      try {
        if (!movieId) throw new Error("Movie ID is undefined");

        // if (user)

        const tmdbMovie = await getMovieById(movieId);
        if (tmdbMovie) {
          // console.log("tmdbData:", tmdbMovie);

          // Fetch movie credits
          const credits = await getMovieCredits(movieId);
          const cast =
            credits?.cast.map((member: { name: string }) => member.name) || [];
          const directors =
            credits?.crew
              .filter(
                (member: { job: string; name: string }) =>
                  member.job === "Director"
              )
              .map((director: { name: string }) => ({
                name: director.name,
              })) || [];
          const writers =
            credits?.crew
              .filter(
                (member: { job: string; name: string }) =>
                  member.job === "Screenplay"
              )
              .map((writer: { name: string }) => ({ name: writer.name })) || [];
          // console.log("Movie credits:", directors, writers, cast);

          setMovie({
            id: tmdbMovie.id || "", // Ensure this is always a string
            title: tmdbMovie.title || "",
            original_title: tmdbMovie.original_title || "",
            poster_path: tmdbMovie.poster_path || "",
            backdrop_path: tmdbMovie.backdrop_path || "",
            genres: tmdbMovie.genres || [],
            overview: tmdbMovie.overview || "",
            status: tmdbMovie.status || "",
            release_date: tmdbMovie.release_date || "",
            production_countries: tmdbMovie.production_countries || [],
            spoken_languages: tmdbMovie.spoken_languages || [],
            production_companies: tmdbMovie.production_companies || [],
            vote_average: tmdbMovie.vote_average || 0,
            vote_count: tmdbMovie.vote_count || 0,
            runtime: tmdbMovie.runtime || 0,
            homepage: tmdbMovie.homepage || "",
            budget: tmdbMovie.budget || 0,
            revenue: tmdbMovie.revenue || 0,
            // Credits
            directors: directors,
            cast: cast,
            writers: writers,
            // User's data
            watched: false, // TODO: Fetch user's watched status
            favourite: isFavourite || false,
          });

          setBackdropUrl(`https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}`); // prettier-ignore
          setPosterUrl(`https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}`); // prettier-ignore
        }
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [movieId, isFavourite]);

  console.log("PopcornMovie data:", movie);

  // Truncate movie overview if it is longer than poster image height and backdrop_path exists
  useEffect(() => {
    if (
      movie?.backdrop_path &&
      posterLoaded &&
      initialOverviewHeight &&
      overviewRef.current
    ) {
      const posterHeight =
        overviewRef.current.previousElementSibling?.clientHeight;

      if (!posterHeight) return;

      if (initialOverviewHeight > posterHeight) {
        overviewRef.current.classList.add("overview-truncated");
        overviewRef.current.classList.add("collapsed");
        overviewRef.current.style.height = `${posterHeight}px`;
      }
    }
  }, [movie, posterLoaded, initialOverviewHeight, overviewRef]);

  // Toggle movie overview visibility
  const toggleOverview = () => {
    const ref = overviewRef.current;
    if (!ref?.classList.contains("overview-truncated")) return;
    const posterHeight = ref.previousElementSibling?.clientHeight;
    if (ref.classList.contains("collapsed")) {
      ref.classList.remove("collapsed");
      ref.style.height = `${initialOverviewHeight}px`;
    } else {
      ref.classList.add("collapsed");
      ref.style.height = `${posterHeight}px`;
    }
  };

  // Toggle list item visibility
  const handleToggleItemVisibility = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    event.currentTarget.nextElementSibling?.classList.toggle("!hidden");
    event.currentTarget.querySelector("svg")?.classList.toggle("rotate-90");
  };

  // TODO: For server side rendering
  // Update meta tags
  // useEffect(() => {
  //   if (posterUrl) {
  //     const metaTag = document.querySelector('meta[property="og:image"]');
  //     if (metaTag) {
  //       metaTag.setAttribute("content", posterUrl);
  //     } else {
  //       const newMetaTag = document.createElement("meta");
  //       newMetaTag.setAttribute("property", "og:image");
  //       newMetaTag.setAttribute("content", posterUrl);
  //       document.head.appendChild(newMetaTag);
  //     }
  //   }
  // }, [posterUrl]);

  return (
    <>
      <TopBar
        backLink={
          location.state?.previousPath ? location.state.previousPath : "/"
        }
        movie={movie || undefined}
        loading={loading}
      />

      {!loading && movie && movie !== undefined && (
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.3, ease: "easeInOut" }}
          className="px-0 pb-24"
        >
          {/* Movie header */}
          <div
            style={ movie.backdrop_path !== "" ? { backgroundImage: `url(${backdropUrl})` } : {} } // prettier-ignore
            className={`relative bg-cover bg-top ${movie.backdrop_path !== "" ? "h-[36vh] min-h-64 sm:mx-auto sm:max-w-[64rem]" : ""}`}
          >
            {/* Movie backdrop under Top Bar */}
            {movie.backdrop_path !== "" && (
              <div
                className="absolute left-0 w-full bg-[120%_auto] before:sticky before:block before:h-[100%] before:w-full before:bg-black/50 lg:hidden"
                style={{
                  backgroundImage: `url(${backdropUrl})`,
                  backgroundPosition: "center top",
                  height: "calc(3rem + env(safe-area-inset-top))",
                  top: "0", // "calc((3rem + env(safe-area-inset-top)) * -1)",
                  transform: "scaleX(-1) rotate(180deg)", // "scaleY(3)",
                  transformOrigin: "top",
                }}
              />
            )}
            {/* Movie poster if backdrop_path is not available */}
            {!movie.backdrop_path && !posterError && movie.poster_path && (
              <div className="overflow-hidden pb-6 pt-2 after:absolute after:-top-12 after:z-10 after:block after:h-full after:w-full after:bg-gradient-to-b after:from-black after:to-transparent">
                <img
                  src={`${posterUrl}`}
                  alt=""
                  className="absolute left-1/2 top-0 z-0 w-48 -translate-x-1/2 border opacity-100 blur-3xl"
                />
                <img
                  src={`${posterUrl}`}
                  alt="Movie Poster"
                  className="relative z-20 mx-auto w-48 rounded-xl border border-white/25 shadow-lg shadow-black/25"
                  onLoad={() => setPosterLoaded(true)}
                  onError={() => setPosterError(true)}
                />
              </div>
              // : (
              // <div className="h-52 w-32 rounded-lg bg-neutral-900" />
              // )
            )}
            {/* Movie title and year */}
            <div
              className={`${movie.backdrop_path !== "" ? "absolute bottom-[-1px] left-0 flex h-[75%] w-full items-end bg-gradient-to-b from-transparent to-black p-4 pb-0" : "px-4"}`}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5, ease: "easeInOut" }}
              >
                <h2 className="mb-1 text-2xl font-semibold leading-7">
                  {movie.title}
                </h2>
                <p className="leading-5 text-neutral-100/75">
                  <span className="sr-only">Year: </span>
                  {movie.release_date &&
                    new Date(movie.release_date).toLocaleString("default", {
                      year: "numeric",
                    })}
                </p>
              </motion.div>
            </div>
          </div>

          {/* Main Movie Information */}
          <div className="mb-6 px-4">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    delay: 0.3,
                  },
                },
              }}
              className={`my-6 flex max-w-96 justify-start gap-6 child:-mt-1 child:leading-4 sm:gap-12`}
            >
              {/* Votes */}
              <div className="flex items-center gap-2.5">
                {movie.vote_average ? (
                  <>
                    <Star
                      className="size-4 shrink-0 text-orange"
                      fill={"currentColor"}
                    />
                    <p className="inline-flex flex-col text-sm leading-4 text-neutral-100/50">
                      <span>
                        <span className="sr-only">Rating: </span>
                        <span className="text-xl font-semibold text-neutral-100">
                          {movie.vote_average.toFixed(1)}
                        </span>
                        /10
                      </span>
                      {movie.vote_count && movie.vote_count > 1
                        ? `${movie.vote_count} votes`
                        : `${movie.vote_count} vote`}
                    </p>
                  </>
                ) : (
                  <p className="text-center text-sm leading-4 text-neutral-100/50">
                    <Star
                      className="mx-auto my-1 size-5 shrink-0 scale-90 text-orange"
                      fill={"currentColor"}
                    />
                    No ratings
                  </p>
                )}
              </div>
              {/* Watchlist actions */}
              <button
                onClick={() => {
                  if (!user) return;
                  if (isInWatchlist) {
                    handleToggleWatched();
                  } else {
                    handleAddToWatchlist();
                  }
                }}
                className={`text-center text-sm text-neutral-100/50 transition-all duration-150 sm:hover:opacity-50`} // w-1/3
              >
                {!isInWatchlist ? (
                  <>
                    <Plus
                      className="mx-auto my-1 size-5 scale-125 text-green"
                      fill="currentColor"
                    />
                    Add to Watchlist
                  </>
                ) : (
                  <>
                    {user && !isWatched ? (
                      <>
                        <Eye className="mx-auto my-1 size-5 scale-125 text-blue" />
                        On Watchlist
                      </>
                    ) : (
                      <>
                        <Check className="mx-auto my-1 size-5 scale-125 text-green" />
                        Watched
                      </>
                    )}
                  </>
                )}
              </button>
              {/* Favourite status */}
              {user && isFavourite && (
                <div className="text-center text-sm text-neutral-100/50">
                  <Heart
                    className="mx-auto my-1 size-5 text-rose-600"
                    fill="currentColor"
                  />
                  Favourite
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5, ease: "easeInOut" }}
              className="text-sm"
            >
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-neutral-100/75">
                {/* Movie runtime */}
                {movie.runtime ? (
                  <span>
                    <span className="sr-only">Runtime: </span>
                    {movie.runtime >= 60
                      ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`
                      : `${movie.runtime}min`}
                  </span>
                ) : null}
                {/* Movie genres */}
                {movie.genres && movie.genres.length > 0 && (
                  <>
                    <span className="sr-only">Genres: </span>
                    {movie.runtime ? <>&bull;</> : null}
                    {movie.genres.map((genre, index) => (
                      <span
                        key={index}
                        className="rounded-md bg-neutral-700/35 px-1.5 py-0.5"
                      >
                        {genre.name}
                        {/* {movie.genres && index < movie.genres.length - 1 && (
                          <span>, </span>
                        )} */}
                      </span>
                    ))}
                  </>
                )}
              </p>
              <div className="relative mt-2 flex items-start gap-4">
                {/* Movie poster */}
                {movie.backdrop_path && !posterError && movie.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                    alt="Movie poster"
                    className="relative mt-1 w-32 rounded-lg border border-neutral-700/50"
                    onLoad={() => setPosterLoaded(true)}
                    onError={() => setPosterError(true)}
                  />
                  // : (
                  // <div className="h-52 w-32 rounded-lg bg-neutral-900" />
                  // )
                )}
                {/* Movie overview */}
                {movie.overview ? (
                  <p
                    ref={overviewRef}
                    onClick={toggleOverview}
                    className="relative cursor-pointer select-none overflow-hidden rounded-lg text-neutral-100/50 transition-all duration-300"
                  >
                    <span className="sr-only">Overview: </span>
                    {movie.overview}
                  </p>
                ) : null}
              </div>
            </motion.div>
          </div>

          {/* Movie Details */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, ease: "easeInOut" }}
            // whileInView={{ opacity: 1 }}
            // viewport={{ once: true }}
            // transition={{ delay: 0.15, ease: "easeInOut" }}
            className="mt-12"
          >
            <ul className="ui-list-full">
              {movie.status && movie.status !== "Released" && (
                <li>
                  <span className="li-key">Status</span>
                  <span className="li-val">{movie.status}</span>
                </li>
              )}
              {movie.release_date && (
                <li>
                  <span className="li-key">Release Date</span>
                  <span className="li-val">
                    {new Date(movie.release_date).toLocaleString("default", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </li>
              )}
              {movie.production_countries &&
                movie.production_countries.length > 0 && (
                  <li>
                    <span className="li-key">
                      Production{" "}
                      {movie.production_countries.length === 1
                        ? "Country"
                        : "Countries"}
                    </span>
                    <span className="li-val">
                      {movie.production_countries
                        ?.map((country) => country.name)
                        .join(", ")}
                    </span>
                  </li>
                )}
              {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                <li>
                  <span className="li-key">
                    {movie.spoken_languages.length === 1
                      ? "Language"
                      : "Languages"}
                  </span>
                  <span className="li-val">
                    {movie.spoken_languages
                      ?.map((lang) => lang.english_name)
                      .join(", ")}
                  </span>
                </li>
              )}
              {movie.original_title !== movie.title && (
                <li>
                  <span className="li-key">Original Title</span>
                  <span className="li-val">{movie.original_title}</span>
                </li>
              )}
            </ul>

            {(movie.directors || movie.cast || movie.writers) && (
              <ul className="ui-list-full mt-6">
                {movie.directors && movie.directors.length > 0 && (
                  <li>
                    <span className="li-key">
                      {movie.directors.length === 1 ? "Director" : "Directors"}
                    </span>
                    <span className="li-val">
                      {movie.directors
                        .map((director) => director.name)
                        .join(", ")}
                    </span>
                  </li>
                )}
                {movie.writers && movie.writers.length > 0 && (
                  <li>
                    <span className="li-key">
                      {movie.writers.length === 1 ? "Writer" : "Writers"}
                    </span>
                    <span className="li-val">
                      {movie.writers.map((writer) => writer.name).join(", ")}
                    </span>
                  </li>
                )}
                {movie.cast && (
                  <li className="flex-col items-start gap-1.5">
                    <button
                      className="li-key"
                      onClick={handleToggleItemVisibility}
                    >
                      Cast{" "}
                      <ChevronRight
                        className="size-5 text-neutral-700 transition-transform duration-300"
                        strokeWidth={2.5}
                      />
                    </button>
                    <span className="cast li-val !hidden !text-left">
                      {movie.cast.join(", ")}
                    </span>
                  </li>
                )}
              </ul>
            )}

            <ul className="ui-list-full mt-6">
              {movie.budget ? (
                <li>
                  <span className="li-key">Budget</span>
                  <span className="li-val">
                    ${movie.budget.toLocaleString()}
                  </span>
                </li>
              ) : null}
              {movie.revenue ? (
                <li>
                  <span className="li-key">Revenue</span>
                  <span className="li-val">
                    ${movie.revenue.toLocaleString()}
                  </span>
                </li>
              ) : null}
              {movie.production_companies &&
                movie.production_companies.length > 0 && (
                  <li className="flex-col items-start gap-1.5">
                    <button
                      className="li-key"
                      onClick={handleToggleItemVisibility}
                    >
                      Production Companies
                      <ChevronRight
                        className="size-5 text-neutral-700 transition-transform duration-300"
                        strokeWidth={2.5}
                      />
                    </button>
                    <span className="li-val !hidden !text-left">
                      {movie.production_companies
                        ?.map((country) => country.name)
                        .join(", ")}
                    </span>
                  </li>
                )}
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue"
                >
                  Movie Website
                  <ArrowUpRight className="size-5 scale-75" />
                </a>
              )}
            </ul>
          </motion.div>
          {/* End movie details */}
        </motion.main>
      )}

      {/* Movie not found */}
      {!loading && !error && movie == undefined && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className={`grid h-[75vh] place-items-center text-sm text-neutral-500`}
        >
          <div className="text-center leading-5">
            <HeartCrack className="mx-auto mb-4 size-16" strokeWidth={1} />
            Movie not found
          </div>
        </motion.div>
      )}

      {/* Loading or error */}
      {(loading || error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15 }}
          className={`grid h-[75vh] place-items-center ${error ? "text-sm text-neutral-500" : ""}`}
        >
          {loading ? (
            <Spinner />
          ) : error ? (
            <div
              className="text-center leading-5"
              style={{ fontFamily: "monospace" }}
            >
              <Bot className="mx-auto mb-4 size-16" strokeWidth={1} />
              Error:
              <br />
              {error}
            </div>
          ) : null}
        </motion.div>
      )}

      {/* Copyrights for non-logged in users */}
      {!user && !loading && <Copyrights className="pb-24" />}
    </>
  );
}
