// src/components/features/DocArea/EmptyState.jsx
// This component displays an empty state message when no documents are available or when a search yields no
import React from 'react';
import { DocumentTextIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export function EmptyState({ isSearch, searchTerm, onClear }) {
  return (
    <div className="p-8 text-center text-gray-500">
      {isSearch ? (
        <>
          <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>No documents found matching "{searchTerm}"</p>
          <button
            onClick={onClear}
            className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
          >Clear search</button>
        </>
      ) : (
        <>
          <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p>No documents found</p>
        </>
      )}
    </div>
  );
}