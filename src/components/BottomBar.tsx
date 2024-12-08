interface BottomBarProps {
  onSearchClick: () => void;
  onAddListClick: () => void;
}

export function BottomBar({ onSearchClick, onAddListClick }: BottomBarProps) {
  return (
    <div
      className={`fixed bottom-0 w-full bg-black/50 py-3 backdrop-blur-xl`}
      style={{
        paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))",
      }}
    >
      <div className="container flex items-start justify-between gap-4 px-3">
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
          <span>Add Movie</span>
        </button>
        <button onClick={onAddListClick} className="text-accent">
          Add List
        </button>
      </div>
    </div>
  );
}
