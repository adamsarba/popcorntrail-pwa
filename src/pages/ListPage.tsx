import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { TopBar } from '../components/TopBar'
import { getUserData } from '../services/userService';
import { Movie } from '../types/Movie'
import { MovieCard } from '../components/MovieCard'
import { usePWA } from '../context/PWAContext'
import { motion } from 'framer-motion'
import { Rabbit, Bird, Cat, Snail, Turtle } from 'lucide-react'

const icons = [
  <Rabbit className="size-[1em]" strokeWidth={1} />,
  <Bird className="size-[1em]" strokeWidth={1} />,
  <Cat className="size-[1em]" strokeWidth={1} />,
  <Snail className="size-[1em]" strokeWidth={1} />,
  <Turtle className="size-[1em]" strokeWidth={1} />,
];

export function ListPage() {
  const { listName } = useParams();
  const [userMovies, setUserMovies] = useState<Movie[]>([]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>([]);
  const isPWA = usePWA();
  const [randomIcon, setRandomIcon] = useState<JSX.Element | null>(null);
  
  useEffect(() => {
    // Fetch user data when the component mounts
    const user = getUserData();
    if (!user) return;

    // setUserMovies(user.watchlist.map(item => item.movie));

    // Set userMovies and sort them by release date in reverse order
    setUserMovies(user.watchlist.map(item => item.movie).sort((a, b) => new Date(a.release_date || '').getTime() - new Date(b.release_date || '').getTime())); 

    // Select a random icon
    const randomIndex = Math.floor(Math.random() * icons.length);
    setRandomIcon(icons[randomIndex]);
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    
    const filterMovies = () => {
      if (listName === "watchlist") {
        setFilteredMovies(userMovies.filter(movie => !movie.watched && new Date(movie.release_date || '') <= currentDate));
      } else if (listName === "watched") {
        setFilteredMovies(userMovies.filter(movie => movie.watched));
      } else if (listName === "favourites") {
        setFilteredMovies(userMovies.filter(movie => movie.favourite));
      } else if (listName === "upcoming") {
        setFilteredMovies(userMovies.filter(movie => new Date(movie.release_date || '') > currentDate));
      }
    };
  
    filterMovies();
  }, [userMovies, listName]);

  const handleMovieStatusChange = (movieId: string) => {
    setFilteredMovies(prev => prev.filter(movie => movie.id !== movieId));
  };

  return (
    <>
      <TopBar backLink />
      <motion.h1 
        initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
        className={`px-4 text-3xl font-bold capitalize truncate`}
      >
        {listName?.replace(/-/g, ' ')}
      </motion.h1>

      <motion.main 
        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        className={`pt-3 pb-24`}
        style={ isPWA ? { paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" } : undefined }
      >
        {filteredMovies.length > 0 ? (
          <ul>
            {filteredMovies.map((movie, index) => (
              <li key={movie.id}>
                <MovieCard
                  movie={movie}
                  index={index}
                  onMovieStatusChange={handleMovieStatusChange}
                />
                <hr className="border-neutral-900 ml-[4.375rem]" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="h-[calc(50vh)] grid place-items-center px-4 text-neutral-500">
            <div>
              <span className="text-6xl mb-2 flex justify-center text-center">
                {randomIcon}
              </span>
              <p>
                No movies in this list yet. Add some!
              </p>
            </div>
          </div>
        )}
      </motion.main>
    </>
  );
}