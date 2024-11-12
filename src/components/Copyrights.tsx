import { Popcorn } from "lucide-react";
import packageJson from "../../package.json"; // Adjust the path if necessary

export function Copyrights() {
  return (
    <footer className="!my-4 space-y-1 text-center text-xs text-neutral-600">
      <Popcorn
        className="mx-auto mb-2 size-[1em] text-3xl text-neutral-600"
        strokeWidth={1.5}
      />
      <p className="flex items-center justify-center gap-1">
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
            className="mx-auto mt-1.5 h-[1em] brightness-50 grayscale filter"
            src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg"
          />
        </a>
      </p>

      {/* {process.env.NODE_ENV === 'development' && window.location.pathname === '/settings' && (
        <div className="text-xs text-left text-neutral-700 !mt-20 mb-[3.5rem]" style={{ fontFamily: "Courier" }}>
          <div className="border-t border-neutral-900 py-4">
            Develop:
            <ul>
              <li>
                isPWA: {isPWA ? "true" : "false"}
              </li>
            </ul>
          </div>
        </div>
      )} */}
    </footer>
  );
}
