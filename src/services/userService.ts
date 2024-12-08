import { User } from "../types/User";

const USER_KEY = "userData"; // Key to store user data in local storage

// Get user data
export const getUserData = (): User | null => {
  const data = localStorage.getItem(USER_KEY);
  return data ? JSON.parse(data) : null;
};

// Initialize user data (temporarily in localStorage)
export const initializeUser = () => {
  const defaultUser: User = {
    username: "user",
    password: "password",
    country: "Unknown",
    display: {
      darkMode: true,
      homePage: {
        userLists: true,
        main: true,
        tags: true,
        smartLists: false,
      },
    },
    watchlist: [],
  };
  saveUserData(defaultUser);
};

// Save user data
export const saveUserData = (user: User) => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Error saving user data:", error);
  }
};

// Handle user actions
export const addMovieToWatchlist = (
  movieId: string,
  movieTitle: string,
  moviePoster: string,
  releaseDate: string
) => {
  const user = getUserData();
  if (!user) return;

  const movieExists = user.watchlist.find((item) => item.movie.id === movieId);
  if (!movieExists) {
    user.watchlist.push({
      movie: {
        id: movieId,
        title: movieTitle,
        poster_path: moviePoster,
        release_date: releaseDate,
        watched: false,
        favourite: false,
      },
    });
    saveUserData(user);
    console.log("Movie added to Watchlist");
  }
};

export const removeMovieFromWatchlist = (movieId: string) => {
  const user = getUserData();
  if (!user) return;

  user.watchlist = user.watchlist.filter((item) => item.movie.id !== movieId);
  saveUserData(user);
  console.log("Movie removed from Watchlist");
};

export const toggleWatchedStatus = (
  movieId: string,
  movieTitle: string,
  moviePoster?: string,
  releaseDate?: string
) => {
  const user = getUserData();
  if (!user) return;

  const movie = user.watchlist.find((item) => item.movie.id === movieId);
  if (movie) {
    movie.movie.watched = !movie.movie.watched;
    console.log(
      `Movie marked as ${movie.movie.watched ? "Watched" : "Unwatched"}`
    );
    saveUserData(user);
  } else {
    user.watchlist.push({
      movie: {
        id: movieId,
        title: movieTitle,
        poster_path: moviePoster,
        watched: true,
        favourite: false,
        release_date: releaseDate,
      },
    });
    saveUserData(user);
    console.log("Movie added to Watchlist and marked as Watched");
  }
};

export const toggleFavouriteStatus = (movieId: string) => {
  const user = getUserData();
  if (!user) return;

  const movie = user.watchlist.find((item) => item.movie.id === movieId);
  if (movie) {
    movie.movie.favourite = !movie.movie.favourite;
    console.log(
      movie.movie.favourite
        ? "Movie added to Favourites"
        : "Movie removed from Favourites"
    );
    saveUserData(user);
  }
};

// export const addRecentlyViewed = (movieId: string) => {
//   const user = getUserData();
//   if (!user) return;

//   user.recentlyViewed.push({ movieId });
//   saveUserData(user);
//   console.log("Movie added to Recently Watched");
// };
