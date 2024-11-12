import { useRef } from "react";
// import { useState, useRef, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isSearchActive?: boolean;
  onSearchActivate?: () => void;
  onSearchDeactivate?: () => void;
}

export function SearchBar({
  onSearch,
  isSearchActive,
  onSearchActivate,
  onSearchDeactivate,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchBarRef = useRef<HTMLDivElement | null>(null);
  const cancelElement = document.querySelector(
    ".search-bar .cancel"
  ) as HTMLElement;
  const cancelWidth = cancelElement?.textContent?.length ?? 0;

  // Focus input when search is active
  if (isSearchActive) inputRef.current?.focus();

  const handleFocus = () => {
    document.body.classList.add("overflow-hidden"); // Disable page scroll
    onSearchActivate?.(); // Call the new prop when search is activated
  };

  // Call onSearch with the new value
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onSearch?.(newValue);
  };

  // Hide search results
  const handleCancel = () => {
    const searchResultsElement = document.querySelector(
      ".search-results"
    ) as HTMLElement;
    if (searchResultsElement) searchResultsElement.style.display = "none"; // Hide search results instantly (ignore axios debounce)
    if (inputRef.current) inputRef.current.value = ""; // Clear input
    onSearch?.(""); // Reset query
    onSearchDeactivate?.(); // Call the new prop when search is deactivated
    document.body.classList.remove("overflow-hidden"); // Re-enable page scroll
  };

  return (
    <div
      ref={searchBarRef}
      className={`search-bar relative z-40 flex items-center`}
    >
      <div className="flex w-full items-center gap-2 rounded-xl bg-neutral-900 px-3 py-1.5">
        <svg
          className="size-4 flex-shrink-0 text-neutral-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          {/* prettier-ignore */}
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for Movies"
          className="w-full truncate bg-transparent text-sm text-white placeholder-neutral-500 outline-none"
          onFocus={handleFocus}
          onChange={handleChange}
        />
      </div>
      <button
        onClick={handleCancel}
        className={`cancel w-0 translate-x-full text-nowrap text-right text-accent opacity-0 transition-all duration-300`}
        style={
          isSearchActive
            ? {
                width: cancelWidth + "ch",
                opacity: 1,
                transform: "translateX(0)",
                paddingLeft: "0.75rem",
              }
            : undefined
        }
      >
        Cancel
      </button>
    </div>
  );
}
