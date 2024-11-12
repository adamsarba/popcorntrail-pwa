import { usePWA } from "../context/PWAContext";

interface BottomBarProps {
  onSearchClick: () => void;
  onAddListClick: () => void;
}

export function BottomBar({ onSearchClick, onAddListClick }: BottomBarProps) {
  const isPWA = usePWA();

  return (
    <div
      className={`${isPWA ? "h-[5.25rem]" : "h-auto"} fixed bottom-0 flex w-full items-start justify-between gap-4 bg-black/50 px-4 py-3 backdrop-blur-xl`}
    >
      <button
        onClick={onSearchClick}
        className="flex items-center space-x-2 font-medium text-accent"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-circle-plus size-6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
        <span>Search</span>
      </button>
      <button onClick={onAddListClick} className="text-accent">
        Add List
      </button>
    </div>
  );
}
