import { Movie } from "./Movie";

export type User = {
  username: string;
  password: string; // Use a hashed password in real app
  country: string;
  display: {
    darkMode: boolean;
  };
  watchlist: Watchlist[];
  recentlyViewed: { movieId: string }[];
  // statistics: Record<string, unknown>; // Placeholder for future statistics
  subscriptions: StreamingSubscription[];
};

export type Watchlist = {
  movie: Movie;
};

export type StreamingSubscription = {
  name: string;
  date: string;
  price: number;
};
