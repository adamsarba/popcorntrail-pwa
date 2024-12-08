import packageJson from "../../package.json"; // Adjust the path if necessary

import { motion } from "framer-motion";
import { Popcorn } from "lucide-react";

export function Copyrights({ className }: { className?: string }) {
  return (
    <footer
      className={`!my-4 space-y-1 text-center text-xs text-neutral-600 ${className ? className : ""}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 1 }}
        transition={{
          delay: 0.15,
          type: "spring",
          stiffness: 150,
        }}
        className="mx-auto inline-block"
      >
        <Popcorn
          className="size-[1em] text-3xl text-neutral-600 transition-colors duration-300 hover:text-red"
          strokeWidth={1.5}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.75 }}
        transition={{
          delay: 0.3,
          type: "spring",
          stiffness: 150,
        }}
      >
        <p className="mt-2 flex items-center justify-center gap-1">
          PopcornTrail {packageJson.version} (beta)
        </p>
        <p>
          Copyrights &copy; 2024{" "}
          <a href="https://github.com/adamsarba" target="_blank">
            Adam Sarba
          </a>
        </p>
        <p className={`!mt-4`}>
          Powered by
          <a href="https://www.themoviedb.org/" target="_blank">
            <img
              className="/grayscale mx-auto mt-1.5 h-[1em] brightness-[40%] filter transition-all duration-300 hover:brightness-100 hover:grayscale-0"
              src="/img/tmdb.svg"
            />
          </a>
        </p>
      </motion.div>
    </footer>
  );
}
