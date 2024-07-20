/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import styles from "./searchInput.module.css";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number; // Optional debounce time in milliseconds
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  debounceTime = 300,
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [timer, setTimer] = useState<any>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setInputValue(newValue);

    // Clear the previous timer
    if (timer) {
      clearTimeout(timer);
    }

    // Set a new timer to handle debouncing
    const newTimer = setTimeout(() => {
      onChange(newValue);
    }, debounceTime);

    setTimer(newTimer);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <div className={styles?.["search-input-container"]}>
      <input
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={styles?.["search-input"]}
      />
      {inputValue && (
        <button
          onClick={handleClear}
          className={styles?.["search-clear-button"]}
        >
          &times;
        </button>
      )}
      <button className={styles?.["search-submit-button"]}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            color: "#878787",
          }}
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </div>
  );
};

export default SearchInput;
