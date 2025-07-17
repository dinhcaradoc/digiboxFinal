// src/components/features/ShareModal.jsx
// ShareModal component: allows sharing documents via phone number
import React, { useState } from "react";
import { XMarkIcon, DocumentTextIcon, UserIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";

// Optionally, move phone validation to a utility!
const isValidPhone = (phone) =>
  /^(\+?\d{10,15})$/.test(phone.replace(/[^\d+]/g, "")); // e.g. +254..., 07..., 254...

export default function ShareModal({ document, onSubmit, onClose }) {
  const [recipientPhone, setRecipientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    setError("");
    if (!isValidPhone(recipientPhone.trim())) {
      setError("Enter a valid recipient phone number (e.g., +254... or 07...)");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({ recipientPhone: recipientPhone.trim(), message: message.trim() });
      // Modal closes in parent after submit, so we don't reset here
    } catch (err) {
      setError("Failed to share document. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg w-full max-w-md mx-auto shadow-lg relative animate-fade-in">
        <button
          className="absolute right-3 top-3 text-gray-400 hover:text-red-500 focus:outline-none"
          onClick={onClose}
          aria-label="Close share modal"
          disabled={isSubmitting}
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        <form onSubmit={handleShare} className="p-6 space-y-4">
          <h2 className="text-xl font-bold mb-2">Share Document</h2>
          <div className="flex items-center bg-gray-50 p-2 px-3 rounded gap-2 mb-3">
            <DocumentTextIcon className="w-6 h-6 text-blue-500" />
            <div className="flex-1">
              <div className="font-medium">{document?.name}</div>
              <div className="text-xs text-gray-400">
                {document?.size} · {new Date(document?.createdAt || document?.date).toLocaleString()}
              </div>
            </div>
          </div>
          <label className="block text-sm mb-1 font-medium">
            <UserIcon className="h-5 w-5 inline-block mr-1 text-gray-400 align-text-bottom" />
            Recipient Phone
            <input
              type="text"
              value={recipientPhone}
              inputMode="tel"
              autoFocus
              required
              placeholder="+254712345678"
              className="w-full border border-gray-200 rounded px-3 py-2 mt-1 focus:ring-blue-500 focus:ring-2 outline-none"
              onChange={(e) => setRecipientPhone(e.target.value)}
              disabled={isSubmitting}
            />
          </label>
          <label className="block text-sm font-medium mb-1">
            <ChatBubbleLeftRightIcon className="h-5 w-5 inline-block mr-1 text-gray-400 align-text-bottom" />
            Message (optional)
            <textarea
              value={message}
              maxLength={140}
              rows={2}
              placeholder="Add a short message (140 chars max)"
              className="mt-1 w-full border border-gray-200 rounded px-3 py-2 focus:ring-blue-500 focus:ring-2 outline-none resize-none"
              onChange={(e) => setMessage(e.target.value)}
              disabled={isSubmitting}
            />
          </label>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold transition disabled:opacity-60`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sharing..." : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
}
// This component provides a modal for sharing documents with a recipient's phone number and an optional message.