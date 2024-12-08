import { useEffect, useState } from "react";
import {
  getUserData,
  initializeUser,
  saveUserData,
} from "../services/userService";

import { TopBar } from "../components/TopBar";
import { SearchBar } from "../components/SearchBar";
import { ListCard } from "../components/ListCard";
import { ListContainer } from "../components/ListContainer";
import { ListItem } from "../components/ListItem";
import { BottomBar } from "../components/BottomBar";
import { usePWA } from "../context/PWAContext";
import PWAPrompt from "react-ios-pwa-prompt";

import { NewListCard } from "../components/NewListCard";

import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  Calendar,
  Heart,
  TrendingUp,
  List,
  Eye,
  Tv,
  Plus,
  ChevronDown,
} from "lucide-react"; // Clapperboard, UserRound

const mainLists = [
  {
    title: "Upcoming",
    icon: <Calendar className="size-[1em]" />,
    iconBg: "bg-red",
    count: 0,
    listLink: true,
  },
  {
    title: "Watchlist",
    icon: <List className="size-[1em]" strokeWidth={2.5} />,
    iconBg: "bg-blue",
    count: 0,
    listLink: true,
  },
  {
    title: "Watched",
    icon: <Check className="size-[1em]" strokeWidth={4} />,
    iconBg: "bg-green",
    count: 0, // Placeholder
    listLink: true,
  },
  {
    title: "Favourites",
    icon: <Heart className="size-[1em] fill-white" />,
    iconBg: "bg-rose-600",
    count: 0,
    listLink: true,
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
    count: null,
    listLink: false,
  },
  {
    title: "Recently Viewed",
    icon: <Eye className="size-[1em] text-neutral-500" />,
    iconBg: "",
    count: null,
    listLink: true,
  },
];

const initialCards = [
  mainLists[2], // Watched
  mainLists[1], // Watchlist
  mainLists[3], // Favourites
  mainLists[0], // Upcoming
  mainLists[4], // Statistics
];

const userLists = [
  {
    title: "New List",
    icon: <List className="size-[1em]" />,
    count: null,
    listLink: true,
  },
  // {
  //   title: "Favourite Horror Movies",
  //   icon: <Skull className="size-[1em]" />,
  //   count: 13,
  //   listLink: true,
  // },
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

const tags: string[] = [];
// Sample:
// const tags = ["datenight", "nostalgia", "cool", "torecommend"];

function SectionHeading({
  title,
  show,
  setShow,
}: {
  title: string;
  show: boolean;
  setShow: (show: boolean) => void;
}) {
  return (
    <h2
      onClick={() => setShow(!show)}
      className="mb-3 flex cursor-pointer items-center justify-between px-3 text-xl font-bold"
    >
      {title}
      <button className="-mr-2 p-2">
        <ChevronDown
          className={`size-4 text-accent ${show ? "" : "-rotate-90"} transition-transform duration-300`}
          strokeWidth={3}
        />
      </button>
    </h2>
  );
}

export function HomePage() {
  const isPWA = usePWA();
  const [firstLoad, setFirstLoad] = useState(() => {
    const hasLoaded = localStorage.getItem("hasLoaded");
    return !hasLoaded; // Set to true if not loaded before
  });

  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showNewListCard, setShowNewListCard] = useState(false);

  // For future grid cards reorder function
  // const [cards, setCards] = useState(() =>
  //   initialCards.map((card) => ({
  //     ...card,
  //     id: card.title, // Unique identifier
  //   }))
  // );

  // Check if app is loaded for the first time
  useEffect(() => {
    if (!firstLoad) return; // If not first load, do nothing
    localStorage.setItem("hasLoaded", "true");
    setFirstLoad(false); // Set to false after first load
  }, [firstLoad]);

  // Initialize user data if not already present
  useEffect(() => {
    const user = getUserData();
    if (!user) initializeUser();
  }, []);

  // Update card counts
  const handleCounts = () => {
    const user = getUserData();
    if (!user) return;

    const watchedCount = user.watchlist.filter(
      (item) => item.movie.watched
    ).length;
    const favouritesCount = user.watchlist.filter(
      (item) => item.movie.favourite
    ).length;

    // const watchlistCount = user.watchlist.length;
    const watchlistCount = user.watchlist.filter((item) => {
      const releaseDate = item.movie.release_date
        ? new Date(item.movie.release_date)
        : new Date();
      return releaseDate <= new Date() && !item.movie.watched; // Check if the release date is in the past
    }).length;
    const upcomingCount = user.watchlist.filter((item) => {
      const releaseDate = item.movie.release_date
        ? new Date(item.movie.release_date)
        : new Date();
      return releaseDate > new Date() && !item.movie.watched; // Check if the release date is in the future and movie is not watched
    }).length;

    mainLists[2].count = watchedCount; // Watched
    mainLists[3].count = favouritesCount; // Favourites
    mainLists[1].count = watchlistCount; // Watchlist // - watchedCount
    mainLists[0].count = upcomingCount; // Upcoming

    // console.log("Counts updated");
  };

  handleCounts();

  // Initialize visibility state based on user settings or default values
  const [visibility, setVisibility] = useState(() => {
    const user = getUserData();
    if (user && user.display.homePage) {
      return user.display.homePage; // Load visibility state from user settings
    }
    // Default visibility settings if no user settings are found
    return {
      userLists: true,
      main: true,
      tags: true,
      smartLists: false,
    };
  });

  // Toggle section visibility
  const toggleVisibility = (section: keyof typeof visibility) => {
    setVisibility((prev) => {
      const newVisibility = { ...prev, [section]: !prev[section] };
      const user = getUserData();
      if (user) {
        user.display.homePage = newVisibility; // Save the visibility state
        saveUserData(user);
      }
      return newVisibility;
    });
  };

  // Toggle new list card
  const toggleNewListCard = () => {
    document.body.classList.toggle("overflow-hidden");
    document.body.classList.toggle("card-active");
    setShowNewListCard((prevState) => !prevState);
  };

  // Functions to handle the Search Bar
  const activateSearchBar = () => {
    setIsSearchActive(true);
    console.log("Search activated");
  };

  const deactivateSearchBar = () => {
    setIsSearchActive(false);
    console.log("Search deactivated");
  };

  /*
   *
   */

  return (
    <>
      <TopBar searchBar isSearchActive={isSearchActive}></TopBar>

      <main
        className={`card-active-effect-scale flex min-h-screen flex-col gap-3 overflow-x-hidden px-3 pb-24 transition-all duration-300`}
        style={
          isPWA
            ? { paddingBottom: "calc(env(safe-area-inset-bottom) + 6rem)" }
            : {}
        }
      >
        <SearchBar
          isSearchActive={isSearchActive}
          onSearchActivate={activateSearchBar}
          onSearchDeactivate={deactivateSearchBar}
          className="mb-1"
        />

        <section className="mb-3 grid grid-cols-2 grid-rows-3 gap-4">
          {/* <Reorder.Group
          values={cards}
          onReorder={setCards}
          className="space-y-2"
          as="section"
        > */}
          {initialCards.map((card, index) => (
            // <Reorder.Item key={card.id} value={card} as="div">
            <ListCard
              key={card.title}
              title={card.title}
              icon={card.icon}
              iconBg={card.iconBg}
              count={card.count}
              link={card.link ? card.link : undefined}
              index={index}
              firstLoad={firstLoad}
              className={`${index === 2 ? "row-start-2" : ""}${index === 3 ? "row-span-2 row-start-2 size-full" : ""}${index === 4 ? "row-start-3" : ""}`}
            />
            // </Reorder.Item>
          ))}
          {/* </Reorder.Group> */}
        </section>

        <section>
          <SectionHeading
            title="My Lists"
            show={visibility.userLists}
            setShow={() => toggleVisibility("userLists")}
          />
          <AnimatePresence initial={false}>
            {visibility.userLists && (
              <ListContainer accordion>
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
          </AnimatePresence>
        </section>

        <section>
          <SectionHeading
            title="Main Lists"
            show={visibility.main}
            setShow={() => toggleVisibility("main")}
          />
          <AnimatePresence initial={false}>
            {visibility.main && (
              <ListContainer accordion>
                {mainLists.map((list) => (
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
          </AnimatePresence>
        </section>

        <section>
          <SectionHeading
            title="Tags"
            show={visibility.tags}
            setShow={() => toggleVisibility("tags")}
          />
          <AnimatePresence initial={false}>
            {visibility.tags && (
              <ListContainer accordion>
                <div className="flex flex-wrap gap-2 p-3 text-xs font-medium child:flex child:items-center child:gap-1 child:rounded-xl child:bg-neutral-800 child:px-3 child:py-2 child:text-neutral-400">
                  {tags.length > 0 ? (
                    tags.map((tag) => <button key={tag}>#{tag}</button>)
                  ) : (
                    <button>
                      <Plus className="size-4" /> Add Tag
                    </button>
                  )}
                </div>
              </ListContainer>
            )}
          </AnimatePresence>
        </section>

        <section>
          <SectionHeading
            title="Smart Lists"
            show={visibility.smartLists}
            setShow={() => toggleVisibility("smartLists")}
          />
          <AnimatePresence initial={false}>
            {visibility.smartLists && (
              <ListContainer accordion>
                <div className="grid place-items-center py-8 text-sm text-neutral-700">
                  <p>Available soon</p>
                </div>
              </ListContainer>
            )}
          </AnimatePresence>
        </section>
      </main>

      <AnimatePresence>
        {showNewListCard && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-lg"
            />
            <NewListCard onCancel={toggleNewListCard} />
          </>
        )}
      </AnimatePresence>

      <BottomBar
        onSearchClick={activateSearchBar}
        onAddListClick={toggleNewListCard}
      />

      {!isPWA && (
        <PWAPrompt
          appIconPath="img/icon-512.png"
          copySubtitle="PopcornTrail"
          timesToShow={2}
        />
      )}
    </>
  );
}
