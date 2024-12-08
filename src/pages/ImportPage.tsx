import { useEffect, useState } from "react";

import { TopBar } from "../components/TopBar";
import { Import } from "../components/Import";

import { motion, AnimatePresence } from "framer-motion";
import { DownloadIcon } from "lucide-react";

export function ImportPage() {
  const [learnMore, setLearnMore] = useState(false);

  const handleClickOutside = () => {
    setLearnMore(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleClickOutside);

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      document.removeEventListener("mouseup", handleClickOutside);
    };
  });

  return (
    <>
      <TopBar backLink="/settings" title={"Settings"} />

      {/* <div className="flex items-center justify-between px-3 text-3xl font-bold capitalize">
        <motion.h1
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          Import
        </motion.h1>
      </div> */}
      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col gap-6 px-3 pb-12 pt-4 text-neutral-100"
      >
        <div className="rounded-xl bg-neutral-900 px-4 py-5 text-center">
          <span className="mx-auto mt-1 inline-block rounded-[0.85rem] bg-blue p-2">
            <DownloadIcon className="size-11" strokeWidth={1.5} />
          </span>
          <h1 className="mb-2 text-2xl font-bold capitalize">Import</h1>
          <div className="relative text-[0.8125rem] leading-[1.125rem] text-neutral-300">
            <p>
              If you have data from another service or a large collection of
              movies, easily import them using TMDB IDs. Enter your movies
              according to the format below, and we'll handle the rest.{" "}
              <button
                className="text-blue"
                onClick={() => {
                  setLearnMore(!learnMore);
                }}
              >
                Learn more...
              </button>
            </p>
            <AnimatePresence>
              {learnMore && (
                <motion.p
                  initial={{ opacity: 0, y: 0, x: "-50%", scale: 0.25 }}
                  animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                  exit={{ opacity: 0, y: 0, x: "-50%", scale: 0.25 }}
                  className="tooltip-arrow-up w-[calc(100%-.375rem)] max-w-96"
                >
                  Currently, it is only possible to import Movies using
                  The&nbsp;Movie Database (TMDB) IDs. TV Shows and import from
                  IMDb or Trakt will be available in the future.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <section className="text-sm text-neutral-500">
          <Import />
        </section>
      </motion.main>
    </>
  );
}
