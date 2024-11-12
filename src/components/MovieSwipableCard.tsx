import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { Plus, Minus, Eye } from "lucide-react";

interface SwipableMovieProps {
  movie: {
    id: string;
    title: string;
    poster_path: string;
    release_date: string;
  };
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  // isScrolling: boolean;
}

const SWIPE_THRESHOLD = 300; // Minimum movement to start swiping

export const SwipableMovie: React.FC<SwipableMovieProps> = ({
  movie,
  onSwipeLeft,
  onSwipeRight,
}) => {
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [swipeWidth, setSwipeWidth] = useState<number>(0);
  // const [isSwiping, setIsSwiping] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (swipeDirection) {
        // Disable page scroll on swipe start
        document
          .querySelector(".search-results")
          ?.classList.add("!overflow-hidden");
      } else {
        // Re-enable scroll after swipe
        document
          .querySelector(".search-results")
          ?.classList.remove("!overflow-hidden");
      }
    }, SWIPE_THRESHOLD);

    return () => {
      document
        .querySelector(".search-results")
        ?.classList.remove("!overflow-hidden");
    };
  }, [swipeDirection]);

  const handlers = useSwipeable({
    onSwipedRight: () => {
      onSwipeRight();
      if (swipeWidth < window.innerWidth / 2.5) {
        setSwipeDirection(null); // Reset after swipe
        setSwipeWidth(0); // Reset width
      }
      // if (isSwiping) {
      //   setIsSwiping(false);
      // }
    },
    onSwipedLeft: () => {
      onSwipeLeft();
      if (swipeWidth > -window.innerWidth / 4) {
        setSwipeDirection(null);
        setSwipeWidth(0);
      }
      // if (isSwiping) {
      //   setIsSwiping(false);
      // }
    },
    onSwiping: (eventData) => {
      // if (isScrolling) return; // Prevent swipe actions if page is scrolling

      // Determine swipe or scroll based on threshold
      // if (Math.abs(eventData.deltaX) > SWIPE_THRESHOLD) {
      //   setIsSwiping(true); // Trigger swipe

      //   const limit = window.innerWidth;
      //   setSwipeWidth(
      //     eventData.dir === 'Right' ? Math.min(eventData.deltaX, limit / 2.5) : Math.max(eventData.deltaX, -limit / 4)
      //   );
      //   setSwipeDirection(eventData.dir.toLowerCase());
      // }

      const limit = window.innerWidth;
      setSwipeWidth(
        eventData.dir === "Right"
          ? Math.min(eventData.deltaX, limit / 2.5)
          : Math.max(eventData.deltaX, -limit / 4),
      );
      setSwipeDirection(eventData.dir.toLowerCase());
    },
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className={`-hover:bg-neutral-900 relative flex cursor-grab items-center gap-4 px-4 py-2 ${swipeWidth ? "bg-neutral-900/0" : ""}`}
      style={{ marginLeft: `${swipeWidth}px`, marginRight: `${-swipeWidth}px` }}
    >
      <div className="h-[3.75rem] w-10 flex-shrink-0 overflow-hidden rounded-md">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            alt="Movie Poster"
            className="block size-full object-cover"
          />
        ) : (
          <div className="size-full bg-neutral-900"></div>
        )}
      </div>
      <div>
        <span className="line-clamp-2 text-lg font-medium leading-6">
          {movie.title}
        </span>
        <span className="block text-sm text-neutral-700">
          {movie.release_date.split("-")[0]}
        </span>
      </div>
      {swipeDirection === "right" && (
        <div
          className="absolute left-0 flex h-full"
          style={{
            width: `calc(${swipeWidth}px - 10px)`,
            marginLeft: `${-swipeWidth}px`,
          }}
        >
          <div className={`grid w-1/2 place-items-center bg-green`}>
            <Plus
              className="size-5 rounded-full border-2 border-white bg-white text-green"
              strokeWidth={3.5}
              style={{ opacity: `calc(${swipeWidth}% - 50%)` }}
            />
          </div>
          <div className={`grid w-1/2 place-items-center bg-blue`}>
            <Eye
              className="size-6 text-white"
              style={{ opacity: `calc(${swipeWidth}% - 50%)` }}
            />
          </div>
        </div>
      )}
      {swipeDirection === "left" && (
        <div
          className={`absolute right-0 flex h-full`}
          style={{
            width: `calc(${-swipeWidth}px - 10px)`,
            marginRight: `${swipeWidth}px`,
          }}
        >
          <div className={`grid w-full place-items-center bg-red`}>
            <Minus
              className="size-5 rounded-full border-2 border-white bg-white text-red"
              strokeWidth={3.5}
              style={{ opacity: `calc(${-swipeWidth}% - 5%)` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

{
  /*
  const [isScrolling, setIsScrolling] = useState(false);  

  useEffect(() => {
    setIsScrolling(true);
    setTimeout(() => setIsScrolling(false), 100); // Reset after scroll ends
  };

  <SwipableMovie
    key={movie.id}
    movie={movie}
    onSwipeLeft={() => console.log('Swiped left on', movie.title)}
    onSwipeRight={() => console.log('Swiped right on', movie.title)}
    isScrolling={isScrolling}
  />
*/
}
