import { Movie } from "./Movie";

export type User = {
  username: string;
  password: string; // Use a hashed password in real app
  country: string;
  display: {
    darkMode: boolean;
    homePage: {
      userLists: boolean;
      main: boolean;
      tags: boolean;
      smartLists: boolean;
    };
  };
  watchlist: Watchlist[];
  // recentlyViewed: { movieId: string }[];
  // statistics: Record<string, unknown>;
  // subscriptions: StreamingService[];
};

export type Watchlist = {
  movie: Movie;
  // tvShow: TVShow;
};

// export type StreamingService = {
//   name: string;
//   date: string;
//   price: number;
// };
