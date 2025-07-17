// src/pages/Uploads.jsx
// Uploads page: handles document upload, listing, search, download, delete, and share

import React, { useEffect, useState } from "react";
import UploadForm from "../components/features/UploadForm";
import DocArea from "../components/features/DocArea";
import ShareModal from "../components/features/ShareModal"; // if implemented
import {
  getDocuments,
  downloadDocument,
  deleteDocument,
  shareDocument,
} from "../services/api";

const Uploads = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Share modal state
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocToShare, setSelectedDocToShare] = useState(null);

  // Fetch uploaded documents on mount and after upload/delete/share
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const res = await getDocuments();
      setDocuments(res.data || []);
      setError("");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // After a successful upload, refetch documents
  const handleUploadSuccess = (newDocs) => setDocuments(newDocs);

  // Download handler
  const handleDownload = (doc) => {
    downloadDocument(doc.id || doc._id);
    // Optionally: show toast/snackbar on fail
  };

  // Delete handler with confirmation
  const handleDelete = async (doc) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${doc.name}"? This cannot be undone.`
      )
    ) {
      try {
        await deleteDocument(doc.id || doc._id);
        setDocuments((prev) =>
          prev.filter((d) => (d.id || d._id) !== (doc.id || doc._id))
        );
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete document.");
      }
    }
  };

  // Share handler (opens share modal)
  const handleShare = (doc) => {
    setSelectedDocToShare(doc);
    setShowShareModal(true);
  };

  // Callback for share modal submission
  const handleShareSubmit = async ({ recipientPhone, message }) => {
    try {
      await shareDocument(
        selectedDocToShare.id || selectedDocToShare._id,
        recipientPhone,
        message
      );
      setShowShareModal(false);
      setSelectedDocToShare(null);
      // Optionally: refetch documents or show a notification
    } catch (err) {
      alert("Failed to share document.");
    }
  };

  // Optional: cancel share
  const handleShareClose = () => {
    setShowShareModal(false);
    setSelectedDocToShare(null);
  };

  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Uploads</h2>
      <div className="mb-6">
        <UploadForm onUploadSuccess={handleUploadSuccess} />
      </div>
      <DocArea
        documents={documents}
        isLoading={isLoading}
        error={error}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onShare={handleShare}
        filterLabel="document"
      />

      {/* Share Modal, if in use */}
      {showShareModal && selectedDocToShare && (
        <ShareModal
          document={selectedDocToShare}
          onSubmit={handleShareSubmit}
          onClose={handleShareClose}
        />
      )}
    </section>
  );
};

export default Uploads;