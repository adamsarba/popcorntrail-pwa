import { useState, useRef } from "react";

import { saveUserData, getUserData } from "../services/userService";
import { Movie } from "../types/Movie";

import { getMovieById } from "../services/tmdbService";
import { usePapaParse } from "react-papaparse";

// import { Spinner } from "../components/ui/Spinner";
import { motion } from "framer-motion";
import { File, Info, Check, WifiOff } from "lucide-react";
import { confettiAnimation } from "../utils/confettiUtils";

const tabs = [
  { id: "csv", label: "CSV" },
  { id: "textarea", label: "Text" },
];

export function Import() {
  // const {
  //   confettiBasic,
  //   // confettiCanon, // emojiConfetti
  // } = Confetti();

  const { readString } = usePapaParse();
  const [importMethod, setImportMethod] = useState<"csv" | "textarea">("csv");
  const [inputValue, setInputValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState<string[][]>([]);
  const [totalIds, setTotalIds] = useState(0);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const isCancelledRef = useRef(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Clear previous data
      setFileData([]);
      // Reset messages if there was any import before
      setMessage("");
      setError("");

      console.log("Reading file...");

      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;

        readString(text, {
          worker: true,
          // step: (row) => {
          //   console.log("Row:", row.data);
          // },
          complete: (results) => {
            console.log(results);
            setFileData((results.data as Array<string>[]) || []);
            // Clear input
            event.target.value = "";
          },
        });
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    // Check if the user is online
    if (!navigator.onLine) {
      setMessage("offline");
      return;
    }

    const user = getUserData();
    if (!user) {
      setMessage("User data not found");
      return;
    }

    // const moviesToImport: string[] = [];
    const moviesToImport: Array<{
      id: string;
      watched: boolean;
      favourite: boolean;
    }> = [];

    if (importMethod === "csv") {
      // Handle CSV data
      const columnNames = fileData[0];
      console.log("Columns:", columnNames);

      // Find the index of the column
      const findIndex = (keyword: string): number => {
        return columnNames.findIndex((name) =>
          name.toLowerCase().includes(keyword)
        );
      };
      const indexOfId: number = findIndex("id");
      const indexOfWatched: number = findIndex("watched");
      const indexOfFavourite = findIndex("favourite");

      if (indexOfId === -1) {
        const msg = "ID column not found";
        console.error(msg);
        setMessage(msg);
        return;
      }

      const csvData = fileData.slice(1).map((row) => {
        const id = row[indexOfId];
        const watched = row[indexOfWatched] === "1" ? true : false; // prettier-ignore
        const favourite = row[indexOfFavourite] === "1" ? true : false; // prettier-ignore

        const movie = { id, watched, favourite };
        return movie;
      });

      moviesToImport.push(...csvData);
    } else {
      // Handle textarea value
      const movieIdStrings = inputValue.split(",").map((id) => id.trim());
      for (let i = 0; i < movieIdStrings.length; i++) {
        const id = movieIdStrings[i];
        if (id) {
          moviesToImport.push({ id, watched: false, favourite: false });
        }
      }
    }

    console.log("Movies:", moviesToImport);

    // Use a Set to track unique IDs from the textarea
    const uniqueIds = new Set<string>();

    // Create a Set of existing IDs in the user's watchlist for quick lookup
    const existingWatchlistIds = new Set(
      user.watchlist.map((item) => item.movie.id.toString())
    );

    const notFoundIds: string[] = []; // Track IDs not found in TMDB
    const alreadyInWatchlistIds: string[] = []; // Track IDs already in the watchlist
    const moviesToAdd: Movie[] = [];

    // Set total IDs based on the import method
    if (importMethod === "csv") {
      setTotalIds(moviesToImport.length);
    } else {
      const movieIdStrings = inputValue.split(",").map((id) => id.trim());
      setTotalIds(movieIdStrings.length);
    }

    setProgress(0);
    setLoading(true);
    setMessage("");
    setError("");
    isCancelledRef.current = false;

    console.groupCollapsed("Importing movies...");

    for (const movie of moviesToImport) {
      if (isCancelledRef.current) {
        setMessage("Import cancelled");
        break;
      }

      const id = movie.id;

      if (id === undefined) continue;

      // Check if the ID is already in the Set
      if (uniqueIds.has(id)) {
        console.warn(`Movie with ID ${id} is already in the input list`);
        continue; // Skip adding this movie
      }

      // Add the ID to the Set to track it
      uniqueIds.add(id);

      // Check if the movie already exists in the user's watchlist
      if (existingWatchlistIds.has(id)) {
        console.warn(`Movie with ID ${id} already exists in the watchlist`);
        alreadyInWatchlistIds.push(id); // Track this ID
        continue; // Skip to the next ID
      }

      try {
        console.log(`Fetching movie details for ID: ${id}`);
        // setMessage("Getting " + msg);
        const movieData = await getMovieById(id);

        if (movieData) {
          moviesToAdd.push({
            id: movieData.id,
            title: movieData.title,
            poster_path: movieData.poster_path,
            release_date: movieData.release_date,
            watched: movie.watched,
            favourite: movie.favourite,
          });
        } else {
          console.warn(`No results found for ID: ${id}`);
          notFoundIds.push(id); // Track this ID
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
        setMessage(`Error fetching movie with ID ${id}`);
        return;
      }

      // Update progress after each movie is processed
      setProgress((prev) => prev + 1);
    }

    console.groupEnd();

    // Add movies to the user's watchlist only if there are movies to add
    if (moviesToAdd.length > 0) {
      console.log("Movies to add:", moviesToAdd);
      user.watchlist.push(...moviesToAdd.map((movie) => ({ movie })));
      // console.log("Updated user watchlist:", user.watchlist);
      saveUserData(user);
      setMessage("success");
      confettiAnimation();
    } else {
      setMessage("No movies were added");
    }

    // Show messages for IDs that were not found or already in the watchlist
    if (notFoundIds.length > 0) {
      setError(
        (prev) => `
        <span>These IDs were not found in TMDB:</span>
        <br />${notFoundIds.join(", ")}
        ${prev ? `<br />${prev}` : ""}
      `
      );
    }
    if (alreadyInWatchlistIds.length > 0) {
      setError(
        (prev) => `
        <span class="${prev ? "inline-block pb-2" : ""}">Some IDs are already in your watchlist</span>
        ${prev ? `<br />${prev}` : ""}
        `
        // These IDs are already in your watchlist:
        // <br />${alreadyInWatchlistIds.join(", ")}
      );
    }

    if (importMethod === "csv") {
      setFileName("");
      setFileData([]);
    } else {
      setInputValue("");
    }

    setLoading(false);

    console.log("Import completed");
  };

  const cancelImport = () => {
    isCancelledRef.current = true;
    console.warn("Import cancelled");
  };

  return (
    <>
      {/* Import method tabs */}
      <div
        className={`mb-2 flex gap-1 rounded-xl bg-neutral-900 p-1 ${loading ? "child:cursor-not-allowed" : ""}`}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (!loading) setImportMethod(tab.id as "csv" | "textarea");
            }}
            className={`${
              importMethod === tab.id
                ? "font-semibold text-black"
                : "sm:hover:opacity-50"
            } relative flex-1 px-3 py-1.5 text-sm text-neutral-100 transition-all duration-150`}
          >
            <span className="relative z-10">{tab.label}</span>
            {importMethod === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 rounded-lg bg-neutral-800"
                transition={{ type: "spring", bounce: 0, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Import method specific content */}
      <div className={`rounded-xl bg-neutral-900 px-4 pt-3`}>
        {!loading && (
          <>
            {importMethod === "csv" ? (
              <>
                Your file should contain the following columns:
                <ul className="mb-1.5 list-disc [&>li]:ml-4">
                  <li>Movie ID</li>
                  <li>Watched (optional)</li>
                  <li>Favourite (optional)</li>
                </ul>
                Ensure the first line includes column headers.
                <input
                  id="file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="sr-only"
                />
                <label
                  htmlFor="file"
                  className={`${fileName ? "flex gap-2" : ""} relative mt-3 block w-full cursor-pointer border-t border-neutral-800 py-3 text-center`}
                >
                  <span className="flex-shrink-0 text-blue">
                    {!fileName ? "Choose file" : "Selected file:"}
                  </span>
                  {fileName && (
                    <span className="truncate">
                      <File className="-mt-[0.2em] mr-0.5 inline-block size-[1em] flex-shrink-0" />
                      {fileName}
                    </span>
                  )}
                </label>
              </>
            ) : (
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter movie IDs separated by commas. Example: 680, 11, 1726, 13"
                className={`block min-h-32 w-full resize-y bg-neutral-900 pb-3 placeholder-neutral-500 outline-none`}
              />
            )}
          </>
        )}

        {/* Import button and progress bar */}
        {(importMethod === "textarea" && inputValue) ||
        (importMethod === "csv" && fileName) ? (
          <div
            className={`relative w-full text-blue ${!loading ? "border-t border-neutral-800" : "cursor-wait"}`}
          >
            {loading ? (
              <>
                Importing: {progress || 0}/{totalIds || 0}
                {/* <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" /> &nbsp; */}
                <div className="relative mt-2 h-2 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="absolute h-[100%] w-0 rounded-r-full bg-blue transition-all duration-300"
                    style={{ width: `${(progress / totalIds) * 100}%` }}
                  ></div>
                </div>
                <button onClick={cancelImport} className="w-full py-3 text-red">
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleImport}
                  className={`w-full py-3 transition-opacity duration-150 ${importMethod === "csv" && fileData.length === 0 ? "opacity-50" : ""}`}
                >
                  Import
                  {/* {importMethod === "csv" && fileData.length === 0 ? (
                    <>
                      <Spinner className="!absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                      &nbsp;
                    </>
                  ) : (
                    "Import"
                  )} */}
                </button>
              </>
            )}
          </div>
        ) : null}
      </div>

      {message && (
        <p
          className={`mt-4 flex items-center gap-2 px-4 ${message === "success" ? "rounded-xl font-medium" : ""}`}
        >
          {message === "success" ? (
            <>
              <Check
                className={`size-4 rounded-full border-[1.5px] border-[currentColor] p-[2px] text-green`}
                strokeWidth={4}
              />
              Movies imported successfully!
            </>
          ) : message === "offline" ? (
            <>
              <WifiOff
                className="size-4 shrink-0 text-orange"
                strokeWidth={2}
              />
              You are currently offline. Please check your internet connection
              to import movies.
            </>
          ) : (
            <>
              <Info className="size-4" strokeWidth={2} />
              {message}
            </>
          )}
        </p>
      )}

      {error && (
        <div className="mt-4 px-4">
          <p
            className="select-text border-t border-neutral-800/75 py-4"
            dangerouslySetInnerHTML={{ __html: error }}
          />
        </div>
      )}

      {/* {loading && (
        <div className="relative mt-4 h-8 w-full overflow-hidden rounded-full bg-neutral-900 dark:bg-neutral-900">
          <div
            className="h-8 w-0 bg-blue transition-all duration-300"
            style={{ width: `${(progress / totalIds) * 100}%` }}
          ></div>
          <div className="absolute inset-0 grid place-items-center text-xs leading-none text-neutral-100/50">
            <span>
              {progress || 0}/{totalIds || 0}
            </span>
          </div>
        </div>
      )} */}
    </>
  );
}
