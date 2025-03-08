"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "@heroicons/react/outline";

const INDONESIAN_CITIES = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Makassar", 
  "Semarang", "Palembang", "Tangerang", "Depok", "Padang", 
  "Denpasar", "Yogyakarta", "Manado", "Banjarmasin", "Malang",
  "Batam", "Jayapura", "Pekanbaru", "Balikpapan", "Pontianak"
];

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length > 1) {
      const filteredSuggestions = INDONESIAN_CITIES.filter(city => 
        city.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/city/${encodeURIComponent(query.trim())}`);
    }
  };

  const selectSuggestion = (city: string) => {
    setQuery(city);
    setSuggestions([]);
    router.push(`/city/${encodeURIComponent(city)}`);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="flex w-full">
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={handleChange}
            placeholder="Search for a city in Indonesia..."
            className="w-full px-4 py-3 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {suggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {suggestions.map((city) => (
                <div
                  key={city}
                  onClick={() => selectSuggestion(city)}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </div>
        <button
          type="submit"
          className="bg-primary text-white px-4 py-3 rounded-r-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <SearchIcon className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}
