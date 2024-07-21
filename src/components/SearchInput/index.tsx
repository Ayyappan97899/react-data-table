/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceTime?: number; // Optional debounce time in milliseconds
}

// styles

const SearchInputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const StyledSearchInput = styled.input`
  width: 100%;
  padding: 14px 100px 14px 14px;
  border: 1px solid #cdcdcd;
  border-radius: 8px;
  font-size: 16px;
`;

const SearchSubmitButton = styled.button`
  position: absolute;
  right: 0;
  border: none;
  background: none;
  padding: 8px;
  cursor: pointer;
`;

const SearchClearButton = styled.button`
  position: absolute;
  right: 40px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 18px;
  color: #999;
`;

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
    <SearchInputContainer>
      <StyledSearchInput
        type="text"
        value={inputValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {inputValue && (
        <SearchClearButton onClick={handleClear}>&times;</SearchClearButton>
      )}
      <SearchSubmitButton>
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
      </SearchSubmitButton>
    </SearchInputContainer>
  );
};

export default SearchInput;
