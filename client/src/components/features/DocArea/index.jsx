// client/src/components/features/DocArea/index.jsx
// This module exports the main DocArea component for document management.
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import DocumentRow from "./DocumentRow";
import { EmptyState } from "./EmptyState";

/**
 * DocArea: Presentational document listing/searching and action triggers.
 * 
 * Props:
 * - documents: Array of documents
 * - isLoading: boolean
 * - error: string or null
 * - onView(doc), onDownload(doc), onDelete(doc), onShare(doc): action handlers
 */
export default function DocArea({
  documents = [],
  isLoading = false,
  error = null,
  onView,
  onDownload,
  onDelete,
  onShare,
  onPriorityToggle,
  filterLabel = "document",
  selectedFile = null,
  userPhone,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filtering by match over any main text fields
  const filteredDocuments = documents.filter((doc) =>
    (
      doc.name +
      (doc.sender || "") +
      (doc.message || "")
    ).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border-0 rounded-xl overflow-hidden bg-white">
      <div className="p-4 sm:p-6">
        {/* Search bar */}
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          count={filteredDocuments.length}
          filterLabel={filterLabel}
        />

        {/* Error message */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <span>{error}</span>
          </div>
        )}

        {/* Selected file preview */}
        {selectedFile && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            New file selected: {selectedFile.name}
          </div>
        )}

        {/* Main content (loading, docs, empty states) */}
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-4">
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : filteredDocuments.length > 0 ? (
          <div className="space-y-2">
            {filteredDocuments.map((doc) => (
              <DocumentRow
                key={doc.id || doc._id}
                doc={doc}
                onView={onView}
                onDownload={onDownload}
                onDelete={onDelete}
                onShare={onShare}
                onPriorityToggle={onPriorityToggle}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            isSearch={Boolean(searchTerm)}
            searchTerm={searchTerm}
            onClear={() => setSearchTerm("")}
          />
        )}
      </div>
    </div>
  );
}