// src/components/features/DocArea/SearchBar.jsx
// This component renders a search bar for filtering documents in the document area.
import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

/**
 * SearchBar component.
 * @param {{
 *   value: string,
 *   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
 *   count: number,
 *   filterLabel?: string
 * }} props
 */
export default function SearchBar({ value, onChange, count, filterLabel = "documents" }) {
  return (
    <div className="mb-6">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder={`Search ${filterLabel}, senders, or messages...`}
          autoFocus
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
        />
      </div>
      {value && (
        <p className="mt-2 text-sm text-gray-600">
          {count} {filterLabel}{count !== 1 ? "s" : ""} found
        </p>
      )}
    </div>
  );
}