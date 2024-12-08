import { useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  isSearchActive?: boolean;
  onSearchActivate?: () => void;
  onSearchDeactivate?: () => void;
  className?: string;
}

export function SearchBar({
  onSearch,
  isSearchActive,
  onSearchActivate,
  onSearchDeactivate,
  className,
}: SearchBarProps) {
  const pathname = useLocation().pathname;
  const navigate = useNavigate();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const query = urlSearchParams.get("query"); // For passing to the SearchResultsPage
  const inputRef = useRef<HTMLInputElement | null>(null);
  const cancelBtn = document.querySelector(".search-bar .cancel") as HTMLElement; // prettier-ignore
  const cancelWidth = cancelBtn?.textContent?.length ?? 0;

  // Call onSearch with the new value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSearch?.(newValue);

    // Navigate to search page
    if (newValue) {
      navigate(`/search?query=${encodeURIComponent(newValue)}`);
    } else {
      navigate(`/search`);
    }
  };

  // Set input value to the search query
  useEffect(() => {
    if (pathname === "/search" && query && inputRef.current)
      inputRef.current.value = query;
  }, [query, pathname]);

  const handleFocus = () => {
    if (pathname === "/") document.body.classList.add("overflow-hidden"); // Disable page scroll
    onSearchActivate?.(); // Call the new prop when search is activated (show "Cancel" button)
  };

  // Handle auto focus on search page
  const handleAutoFocus = () => {
    if (pathname === "/search" && query?.length === 1) return true;
  };

  // Handle focus after search is activated on Home Page from <BottomBar />
  if (pathname === "/" && isSearchActive) inputRef.current?.focus();

  // Handle "Cancel" button click
  const handleCancel = (event: React.MouseEvent) => {
    // Reset query
    onSearch?.("");

    if (event.target === cancelBtn) {
      if (pathname === "/search") {
        // Go back to home on cancelBtn click
        navigate(`/`);
        return;
      }

      if (pathname === "/") {
        // Hide "Cancel" button
        onSearchDeactivate?.();
        // Re-enable page scroll
        document.body.classList.remove("overflow-hidden");
      }
    } else {
      // Clear the input on "Clear" click
      if (inputRef.current) inputRef.current.value = "";
      if (inputRef.current) inputRef.current.focus();
      // Clear the URL query when the input is cleared
      if (pathname === "/search") navigate(`/search`);
    }
  };

  // Handle Escape key to deactivate search on Home Page
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") inputRef.current?.blur();
    if (pathname === "/") onSearchDeactivate?.();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  return (
    <div
      className={`search-bar ${pathname === "/search" ? "container" : ""} relative flex items-center overflow-hidden rounded-xl ${className ? className : ""}`}
    >
      <div className="relative flex w-full items-center gap-2 rounded-xl bg-neutral-900 px-3 py-1.5">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          className="size-4 flex-shrink-0 text-neutral-500"
        >
          {/* prettier-ignore */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for Movies"
          className={`w-full truncate bg-transparent text-sm text-white placeholder-neutral-500 outline-none ${query ? "pr-6" : ""}`}
          onFocus={handleFocus}
          onChange={handleChange}
          autoFocus={handleAutoFocus()}
        />
        {/* {query ? "query" : "not"} */}
        <button
          aria-label="Clear search"
          onClick={handleCancel}
          className={`clear absolute right-1 box-content size-[1.125rem] p-1 text-neutral-600 transition-opacity duration-150 ${query ? "opacity-1 user-select" : "user-select-none cursor-default opacity-0"}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 800"
            fill="currentColor"
          >
            <path d="M400,78.8c-179.5,0-325,145.5-325,325s145.5,325,325,325,325-145.5,325-325c-.2-179.4-145.6-324.8-325-325ZM533.1,541.9c-6.2,6.2-14.5,9.7-23.3,9.7s-17.1-3.4-23.3-9.6h0c-1-.9-2.3-2.3-4.6-4.6,0,0-75.4-75.4-82-82l-86.5,86.5c-6.2,6.2-14.5,9.6-23.3,9.6-8.8,0-17.1-3.4-23.3-9.7-12.8-12.8-12.8-33.7,0-46.5l86.5-86.5-86.5-86.5c-12.8-12.9-12.8-33.8,0-46.6,6.2-6.2,14.5-9.6,23.3-9.6s17.1,3.4,23.3,9.6l86.5,86.5,86.5-86.5c6.2-6.2,14.5-9.6,23.3-9.6s17.1,3.4,23.3,9.7c12.8,12.8,12.8,33.7,0,46.5l-86.5,86.5,86.5,86.5c12.9,12.8,12.9,33.7,0,46.6Z" />
          </svg>
        </button>
      </div>
      <button
        aria-label="Close search"
        onClick={handleCancel}
        className={`cancel text-nowrap text-right text-accent ${window.location.pathname === "/" ? "transition-all duration-300" : ""} ${!isSearchActive ? "w-0 translate-x-full opacity-0" : ""}`}
        style={
          isSearchActive
            ? {
                width: cancelWidth + "ch",
                opacity: 1,
                transform: "translateX(0)",
                paddingLeft: "0.75rem",
              }
            : {}
        }
      >
        Cancel
      </button>
    </div>
  );
}
