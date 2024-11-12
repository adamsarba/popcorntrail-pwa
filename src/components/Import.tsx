import { useState } from "react";
import { saveUserData, getUserData } from "../services/userService";
import { Movie } from "../types/Movie";
import { getMovieById } from "../services/tmdbService";
import { motion } from "framer-motion";
import { Spinner } from "../components/ui/Spinner";
import { File, Check } from "lucide-react";

const tabs = [
  { id: "csv", label: "CSV" },
  { id: "textarea", label: "Text" },
];

export function Import() {
  const [inputMethod, setInputMethod] = useState<"csv" | "textarea">("csv");
  const [inputValue, setInputValue] = useState("");
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setInputValue("");
      const reader = new FileReader();
      // reader.onload = (e) => {
      //   const text = e.target?.result as string;
      //   if (inputMethod === 'textarea') {
      //     setInputValue(text);
      //   } else {
      //     setInputValue('');
      //   }
      // };
      reader.readAsText(file);
      // Reset messages if there was any import before
      setMessage("");
      setError("");
    }
  };

  const handleImport = async () => {
    const user = getUserData();
    if (!user) {
      setMessage("User data not found");
      return;
    }

    // const movieIds = inputMethod === 'textarea'
    // ? inputValue.split(',').map(id => id.trim())
    // // inputMethod === 'csv'
    // : inputValue.split('\n').map(line => line.split(';')[0].trim());

    const movieIds: string[] = [];
    const watchedStatus: boolean[] = [];
    const favouriteStatus: boolean[] = [];

    const rows =
      inputMethod === "csv"
        ? inputValue.split("\n").map((row) => row.trim())
        : inputValue.split(",").map((id) => id.trim()); // For textarea

    const headers =
      inputMethod === "csv"
        ? rows[0].split(/[,;]/).map((header) => header.trim().toLowerCase())
        : ["id"]; // For textarea, assuming that IDs are provided directly

    const idIndex = headers.findIndex(
      (header) => header === "id" || header === "the movie database id",
    );
    const watchedIndex = headers.findIndex((header) => header === "watched");
    const favouriteIndex = headers.findIndex(
      (header) => header === "favourite",
    );

    if (idIndex === -1) {
      setMessage("ID column is required");
      return;
    }

    for (let i = inputMethod === "csv" ? 1 : 0; i < rows.length; i++) {
      const cells = rows[i]
        .split(/[,;]/)
        .map((cell) => cell.trim().replace(/^"|"$/g, "")); // Remove quotes if present
      const id = cells[idIndex];

      if (id) {
        movieIds.push(id);
        watchedStatus.push(
          watchedIndex !== -1 ? cells[watchedIndex] === "1" : false,
        );
        favouriteStatus.push(
          favouriteIndex !== -1 ? cells[favouriteIndex] === "1" : false,
        );
      }
    }

    const moviesToAdd: Movie[] = [];
    // Use a Set to track unique IDs from the textarea
    const uniqueIds = new Set<string>();

    // Create a Set of existing IDs in the user's watchlist for quick lookup
    const existingWatchlistIds = new Set(
      user.watchlist.map((item) => item.movie.id.toString()),
    );

    const notFoundIds: string[] = []; // To track IDs not found in TMDB
    const alreadyInWatchlistIds: string[] = []; // To track IDs already in the watchlist

    setLoading(true);

    for (const id of movieIds) {
      setMessage("");
      setError("");

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
        const movieData = await getMovieById(id);

        if (movieData) {
          const index = movieIds.indexOf(id);
          const watched = watchedStatus[index];
          const favourite = favouriteStatus[index];

          moviesToAdd.push({
            id: movieData.id,
            title: movieData.title,
            poster_path: movieData.poster_path,
            release_date: movieData.release_date,
            watched,
            favourite,
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
    }

    setLoading(false);

    // Add movies to the user's watchlist only if there are movies to add
    if (moviesToAdd.length > 0) {
      console.log("Movies to add:", moviesToAdd);
      user.watchlist.push(...moviesToAdd.map((movie) => ({ movie })));
      console.log("Updated user watchlist:", user.watchlist);
      saveUserData(user);
      setMessage("success");
    } else {
      setMessage("No movies were added.");
    }

    // Show messages for IDs that were not found or already in the watchlist
    if (notFoundIds.length > 0) {
      setError(
        (prev) => `
        <span class="text-red">IDs not found in TMDB:</span>
        <br />${notFoundIds.join(", ")}
        ${prev ? `<br />${prev}` : ""}
      `,
      );
    }
    if (alreadyInWatchlistIds.length > 0) {
      setError(
        (prev) => `
        <span class="text-orange">IDs already in watchlist:</span>
        <br />${alreadyInWatchlistIds.join(", ")}
        ${prev ? `<br />${prev}` : ""}
      `,
      );
    }

    setInputValue("");
  };

  return (
    <div className="text-sm text-neutral-500">
      <p className="mb-4">
        Currently, it is only possible to import Movies using The Movie Database
        (TMDB) IDs. TV Shows and import from IMDb or Trakt will be available in
        the future.
      </p>

      <div className="mb-2 flex gap-1 rounded-xl bg-neutral-900 p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setInputMethod(tab.id as "csv" | "textarea");
              // setMessage('');
              // setError('');
            }}
            className={`${
              inputMethod === tab.id
                ? "font-semibold text-black"
                : "--md:hover:opacity-50"
            } relative flex-grow px-3 py-1.5 text-sm text-neutral-100 transition-all duration-150`}
          >
            <span className="relative z-10">{tab.label}</span>
            {inputMethod === tab.id && (
              <motion.span
                layoutId="bubble"
                className="absolute inset-0 rounded-lg bg-neutral-800"
                transition={{ type: "spring", bounce: 0, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      <div className={`rounded-xl bg-neutral-900 px-4 pt-3`}>
        {inputMethod === "csv" ? (
          <>
            Your file should contain the following columns:
            <ul className="mb-1.5 list-disc [&>li]:ml-4">
              <li>Movie ID</li>
              <li>Watched (optional)</li>
              <li>Favourite (optional)</li>
            </ul>
            The first line should contain the column names.
            <input
              id="file"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="sr-only"
            />
            <label
              htmlFor="file"
              className={`${fileName ? "flex gap-2" : ""} relative mt-3 block w-full border-t border-neutral-800 py-3 text-center`}
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
            placeholder="Enter movie IDs separated by commas"
            className={`block min-h-32 w-full resize-y bg-neutral-900 pb-3 placeholder-neutral-500 outline-none`}
          />
        )}
        {(inputMethod === "textarea" && inputValue) ||
        (inputMethod === "csv" && fileName) ? (
          <button
            onClick={handleImport}
            className="relative w-full border-t border-neutral-800 py-3 text-blue"
          >
            {loading ? (
              <>
                <Spinner className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                &nbsp;
              </>
            ) : (
              "Import"
            )}
            &nbsp;
          </button>
        ) : null}
      </div>

      {message && (
        <>
          <p className="mt-4" />
          {message === "success" ? (
            <span className="flex items-center gap-2">
              <Check className="size-4 rounded-full border border-green p-0.5 text-green" />
              Movies imported successfully!
            </span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: message }} />
          )}
        </>
      )}
      {error && (
        <p className="mt-4" dangerouslySetInnerHTML={{ __html: error }} />
      )}
    </div>
  );
}
