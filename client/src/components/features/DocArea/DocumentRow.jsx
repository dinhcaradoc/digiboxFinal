// src/components/features/DocArea/DocumentRow.jsx
// This component renders a single row for a document in the document list.
import React, { useState } from "react";
import {
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  TrashIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { setDocumentPriority } from "../../../services/api"; // <-- Ensure this import

// Infer file type for color and styling
function getFileType(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return { color: "text-red-600", bg: "bg-red-100" };
  if (["doc", "docx"].includes(ext)) return { color: "text-blue-600", bg: "bg-blue-100" };
  if (["xls", "xlsx", "csv"].includes(ext)) return { color: "text-green-600", bg: "bg-green-100" };
  if (["ppt", "pptx"].includes(ext)) return { color: "text-orange-600", bg: "bg-orange-100" };
  return { color: "text-gray-600", bg: "bg-gray-100" };
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const today = new Date();
  if (date.toDateString() === today.toDateString())
    return `Today, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  const yest = new Date();
  yest.setDate(yest.getDate() - 1);
  if (date.toDateString() === yest.toDateString())
    return `Yesterday, ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  return date.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

/**
 * Renders one row of a document in the list, including priority (star) toggle.
 */
export default function DocumentRow({
  doc,
  onView, onDownload, onDelete, onShare,
  onPriorityToggle,
  userPhone,
}) {
  const fileType = getFileType(doc.name);
  const [isTogglingPriority, setIsTogglingPriority] = useState(false);
  const isOwner = userPhone && doc.attributes && doc.attributes.owner === userPhone;
  const [isPriority, setIsPriority] = useState(!!doc.priority);

  const handlePriorityToggle = async () => {
    setIsTogglingPriority(true);
    try {
      await setDocumentPriority(doc._id || doc.id);
      setIsPriority((val) => !val);
      if (onPriorityToggle) onPriorityToggle(doc._id || doc.id);
    } catch (err) {
      // You can show a toast/snackbar here for error feedback
    } finally {
      setIsTogglingPriority(false);
    }
  };

  return (
    <div 
      className="flex items-start p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50 transition-colors"
      key={doc.id || doc._id}
    >
      <div className={`p-3 rounded-lg ${fileType.bg} mr-4 hidden sm:block`}>
        <DocumentTextIcon className={`w-6 h-6 ${fileType.color}`} />
      </div>
      {/* Info */}
      <div className="flex flex-col sm:flex-row flex-1 min-w-0">
        <div className="flex-none w-full sm:w-1/3 pr-0 sm:pr-4 mb-2 sm:mb-0">
          <h3
            className="font-medium text-gray-900 truncate mb-1"
            title={doc.name}
          >{doc.name}</h3>
          <div className="flex items-center text-xs text-gray-500 gap-x-2">
            <span>{formatDate(doc.date || doc.createdAt)}</span>
            {doc.size && (
              <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {doc.size}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-blue-600 mb-1 truncate" title={doc.sender}>
            {doc.sender}
          </div>
          <p className="text-sm text-gray-700 line-clamp-2">{doc.message}</p>
        </div>
      </div>
      {/* Actions */}
      <div className="flex gap-1 ml-0 sm:ml-4 mt-2 sm:mt-0 shrink-0 justify-end sm:justify-start">
        {onView && (
          <button
            onClick={() => onView(doc)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="View document"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
        )}
        {onDownload && (
          <button
            onClick={() => onDownload(doc)}
            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Download document"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        )}
        {onShare && (
          <button
            onClick={() => onShare(doc)}
            className="p-2 text-gray-500 hover:text-gold-600 hover:bg-gold-50 rounded-full transition-colors"
            title="Share document"
          >
            <ShareIcon className="w-5 h-5" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(doc)}
            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete document"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
        {/* ----- Priority Star Toggle ----- */}
        {isOwner && (
          <button
            onClick={handlePriorityToggle}
            className={`p-2 text-xl rounded-full transition-colors ${
              isPriority ? "text-yellow-500" : "text-gray-300"
            } hover:text-yellow-500`}
            title={isPriority ? "Remove from QuickBox" : "Add to QuickBox"}
            aria-label={isPriority ? "Unstar (Remove from QuickBox)" : "Star (Add to QuickBox)"}
            disabled={isTogglingPriority}
          >
            {isPriority ? "★" : "☆"}
          </button>
        )}
      </div>
    </div>
  );
}
