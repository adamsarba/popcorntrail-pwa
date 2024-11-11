import { useEffect, useState } from 'react'
import { TopBar } from '../components/TopBar'
import { SearchBar } from '../components/SearchBar'
import { searchMovies } from '../services/tmdbService'
import { Movie } from '../types/Movie'
import { MovieCard } from '../components/MovieCard'
import { getUserData, initializeUser } from '../services/userService';
import { ListCard } from '../components/ListCard'
import { ListContainer } from '../components/ListContainer'
import { ListItem } from '../components/ListItem'
import { BottomBar } from '../components/BottomBar'
import PWAPrompt from 'react-ios-pwa-prompt'
import { motion, AnimatePresence } from 'framer-motion'
import { NewListCard } from '../components/NewListCard'
import { usePWA } from '../context/PWAContext'
import { Check, Calendar, Star, TrendingUp, List, Eye, Tv, Plus, Skull, ChevronDown, } from 'lucide-react' // Clapperboard, UserRound

const defaultLists = [
  { 
    title: "Upcoming",
    icon: <Calendar className="size-[1em]" />,
    iconBg: "bg-red",
    count: 0,
    listLink: true
  },
  { 
    title: "Watchlist",
    icon: <List className="size-[1em]" strokeWidth={2.5} />,
    iconBg: "bg-blue",
    count: 0,
    listLink: true
  },
  { 
    title: "Watched",
    icon: <Check className="size-[1em]" strokeWidth={4} />,
    iconBg: "bg-green",
    count: 0, // Placeholder
    listLink: true
  },
  { 
    title: "Favourites",
    icon: <Star className="size-[1em] fill-white" />,
    iconBg: "bg-orange",
    count: 0,
    listLink: true
  },
  { 
    title: "Statistics",
    icon: <TrendingUp className="size-[1em]" />,
    count: null,
    link: "/stats",
  },
  { 
    title: "Subscriptions",
    icon: <Tv className="size-[1em]" />,
    iconBg: "",
    count: 3,
    listLink: false
  },
  { 
    title: "Recently Viewed",
    icon: <Eye className="size-[1em] text-neutral-500" />,
    iconBg: "",
    count: 5,
    listLink: true
  },
];

const cards = [
  defaultLists[2],
  defaultLists[3],
  defaultLists[1],
  defaultLists[0],
  defaultLists[4],
];

const userLists = [
  { 
    title: "New List",
    icon: <List className="size-[1em]" />,
    listLink: true
  },
  { 
    title: "Favourite Horror Movies",
    icon: <Skull className="size-[1em]" />,
    count: 13,
    listLink: true
  },
];

// const likedLists = [
//   { 
//     title: "The 96th Academy Awards (2024)",
//     icon: <Clapperboard className="size-[1em]" />,
//     count: 13,
//     listLink: true
//   },
//   { 
//     title: "Top 10 Morgan Freeman Movies",
//     icon: <UserRound className="size-[1em]" />,
//     count: 10,
//     listLink: true
//   },
// ];

const tags = ['datenight', 'nostalgia', 'cool', 'torecommend' ]

function SectionHeading({ title, show, setShow }: { 
  title: string;
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  return (
    <h2 onClick={() => setShow(!show)} className="flex items-center justify-between text-xl font-bold px-3 cursor-pointer">
      {title}
      <button className="p-2 -mr-2">
        <ChevronDown className={`size-4 text-accent ${show ? '' : '-rotate-90'} transition-transform duration-300`} strokeWidth={3} />
      </button>
    </h2>
  );
}

export function HomePage() {
  const [firstLoad, setFirstLoad] = useState(() => {
    const hasLoaded = localStorage.getItem('hasLoaded');
    return !hasLoaded; // Set to true if not loaded before
  });
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showNewListCard, setShowNewListCard] = useState(false);
  const isPWA = usePWA();

  // Check if app is loaded first time
  useEffect(() => {
    if (!firstLoad) return; // If not first load, do nothing
    localStorage.setItem('hasLoaded', 'true');
    setFirstLoad(false); // Set to false after first load
  }, [firstLoad]);

  // Initialize user data if not already present
  useEffect(() => {
    if (!getUserData()) initializeUser();
  }, []);

  // Define handleCounts outside of useEffect
  const handleCounts = () => {
    const user = getUserData();
    if (!user) return;

    const watchedCount = user.watchlist.filter(item => item.movie.watched).length;
    const favouritesCount = user.watchlist.filter(item => item.movie.favourite).length;
    
    // const watchlistCount = user.watchlist.length;
    const watchlistCount = user.watchlist.filter(item => {
      const releaseDate = item.movie.release_date ? new Date(item.movie.release_date) : new Date();
      return releaseDate <= new Date() && !item.movie.watched; // Check if the release date is in the past
    }).length;
    const upcomingCount = user.watchlist.filter(item => {
      const releaseDate = item.movie.release_date ? new Date(item.movie.release_date) : new Date();
      return releaseDate > new Date() && !item.movie.watched; // Check if the release date is in the future and movie is not watched
    }).length;

    cards[0].count = watchedCount; // Watched
    cards[1].count = favouritesCount; // Favourites
    cards[2].count = watchlistCount; // Watchlist // - watchedCount
    cards[3].count = upcomingCount; // Upcoming

    console.log("Counts updated");
  };

  useEffect(() => {
    handleCounts();
  }, []);

  // State to manage visibility of lists
  const [visibility, setVisibility] = useState({
    userLists: true,
    // likedLists: false,
    home: true,
    tags: true,
    smartLists: false,
  });

  // Toggle section visibility
  const toggleVisibility = (section: keyof typeof visibility) => {
    setVisibility((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Function to activate the SearchBar
  const activateSearchBar = () => {
    setIsSearchActive(true);
    setTimeout(() => { window.scrollTo(0, 0) }, 50); // Prevent page bouncing on mobile
  };
  const deactivateSearchBar = () => {
    setIsSearchActive(false);
    if (searchResults.length > 0) handleCounts();
  };
  
  // Show NewListCard when "Add List" is clicked
  const handleAddListClick = () => {
    setShowNewListCard(true);
    document.body.classList.add("overflow-hidden"); // Disable page scroll
    document.body.classList.add("card-active");
  };
  
  // Hide NewListCard when "Cancel" is clicked
  const handleCancel = () => {
    setShowNewListCard(false);
    document.body.classList.remove("overflow-hidden"); // Re-enable page scroll
    document.body.classList.remove("card-active");
  };

  // Handle Scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Search Engine
  useEffect(() => {
    // TODO: navigate(`/search?query=${query}`);
    const handler = setTimeout(async () => {
      if (query) {
        const results = await searchMovies(query);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, 300); // axios debounce

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <>
      <TopBar searchBar scrolled={isScrolled} isSearchActive={isSearchActive}>
        <SearchBar 
          onSearch={(value) => {
            setQuery(value);
          }}
          isSearchActive={isSearchActive}
          onSearchActivate={activateSearchBar}
          onSearchDeactivate={deactivateSearchBar}
        />
      </TopBar>

      <main 
        className={`min-h-screen px-4 pb-24 flex flex-col gap-6 overflow-x-hidden overscroll-auto"} transition-all duration-300 card-active-effect-scale`}
        style={ isPWA ? { paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" } : undefined }
        // style={ isScrolled ? { paddingTop: "calc(env(safe-area-inset-top) + 2.75rem)" } : undefined }
      >
        {searchResults.length > 0 ? (
          <ul 
            className={`search-results absolute w-full z-30 left-0 h-[calc(100vh_-_3.75rem_-_env(safe-area-inset-bottom))] select-none overflow-y-scroll bg-black`}
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)"}}
          >
            {searchResults.map((movie, index) => (
              <li key={movie.id}>
                <MovieCard
                  movie={movie}
                  index={index}
                />
                <hr className="border-neutral-900 ml-[4.375rem]" />
              </li>
            ))}
          </ul>
        ) : (
          query && ( // Only show if there is a query
            <div className="absolute z-30 inset-0 flex items-center justify-center text-neutral-600 bg-black">
              <span className="sr-only">No results</span>
            </div>
          )
        )}

        <section className="grid grid-cols-2 grid-rows-3 gap-4 mt-1">
          {cards.map((category, index) => (
            <ListCard
              key={category.title}
              title={category.title}
              icon={category.icon}
              iconBg={category.iconBg}
              count={category.count}
              link={category.link ? category.link : undefined}
              index={index}
              firstLoad={firstLoad}
              className={`${index === 2 ? 'row-start-2' : ''}${index === 3 ? 'row-span-2 row-start-2 size-full' : ''}${index === 4 ? 'row-start-3' : ''}`}
            />
          ))}
        </section>

        <section>
          <SectionHeading title="My Lists" show={visibility.userLists} setShow={() => toggleVisibility('userLists')} />
          {visibility.userLists && (
            <ListContainer>
              {userLists.map((list) => (
                <ListItem
                  key={list.title}
                  title={list.title}
                  icon={list.icon}
                  count={list.count}
                  listLink={list.listLink ? list.listLink : false}
                />
              ))}
            </ListContainer>
          )}
        </section>

        <section>
          <SectionHeading title="Home" show={visibility.home} setShow={() => toggleVisibility('home')} />
          {visibility.home && (
            <ListContainer>
              {defaultLists.map((list) => (
                <ListItem
                  key={list.title}
                  title={list.title}
                  icon={list.icon}
                  iconBg={list.iconBg}
                  count={list.count}
                  listLink={list.listLink ? list.listLink : false}
                  link={list.link ? list.link : undefined}
                />
              ))}
            </ListContainer>
          )}
        </section>

        <section>
          <SectionHeading title="Tags" show={visibility.tags} setShow={() => toggleVisibility('tags')} />
          {visibility.tags && (
            <ListContainer className="!flex-row flex-wrap gap-2 text-sm p-3 child:flex child:items-center child:gap-1 child:px-3 child:py-2 child:bg-neutral-800 child:text-neutral-400 child:rounded-xl mt-3">
              {tags.map((tag) => (
                <button key={tag}>
                  #{tag}
                </button>
              ))}
              <button>
                <Plus className="size-4" /> Add Tag
              </button>
            </ListContainer>
          )}
        </section>

        <section>
          <SectionHeading title="Smart Lists" show={visibility.smartLists} setShow={() => toggleVisibility('smartLists')} />
          {visibility.smartLists && (
            <ListContainer className="py-8 text-sm text-neutral-700 items-center justify-center">
              <p className="text-sm">
                Available soon
              </p>
            </ListContainer>
          )}
        </section>
      </main>

      <AnimatePresence>
        {showNewListCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg"
            />
            <NewListCard onCancel={handleCancel} />
          </>
        )}
      </AnimatePresence>

      <BottomBar 
        onSearchClick={activateSearchBar}
        onAddListClick={handleAddListClick}
      />

      <PWAPrompt 
        appIconPath="img/icon-512.png"
        copySubtitle="PopcornTrail"
        timesToShow={2}
      />
    </>
  );
}