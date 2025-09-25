// src/pages/QuickBox.jsx
// QuickBox page: displays a quick overview of documents with options to upload, view, and manage
import React, { useEffect, useState } from "react";
import DocArea from "../components/features/DocArea";
import ShareModal from "../components/features/ShareModal";
import { getPriority, downloadDocument, deleteDocument, shareDocument } from "../services/api";
import {useAuth} from "../contexts/AuthContext";
import Head from "../components/layout/Head";

const QuickBox = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocToShare, setSelectedDocToShare] = useState(null);

  const fetchPriorityDocs = async () => {
    setIsLoading(true);
    try {
      const res = await getPriority();
      setDocuments(res.data.quickbox?.documents || []);
      setError("");
    } catch {
      setError("Failed to load priority documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorityDocs();
  }, []);

  const handleDownload = (doc) => {
    downloadDocument(doc.id || doc._id);
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`Delete "${doc.name}" from QuickBox?`)) {
      try {
        await deleteDocument(doc.id || doc._id);
        setDocuments((prev) => prev.filter((d) => (d.id || d._id) !== (doc.id || doc._id)));
      } catch {
        alert("Failed to delete document.");
      }
    }
  };

  const handleShare = (doc) => {
    setSelectedDocToShare(doc);
    setShowShareModal(true);
  };

  const handleShareSubmit = async ({ recipientPhone, message }) => {
    try {
      await shareDocument(selectedDocToShare.id || selectedDocToShare._id, recipientPhone, message);
      setShowShareModal(false);
      setSelectedDocToShare(null);
    } catch {
      alert("Failed to share document.");
    }
  };

  const handleShareClose = () => {
    setShowShareModal(false);
    setSelectedDocToShare(null);
  };

  const handlePriorityToggle = async () => {
    await fetchPriorityDocs();
  };

  return (
    <>
      <Head title="Priority Docs" description="Fast access to your high-priority documents." />
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">QuickBox: Your Priority Documents</h2>
        <DocArea
          documents={documents}
          isLoading={isLoading}
          error={error}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onShare={handleShare}
          onPriorityToggle={handlePriorityToggle}
          userPhone={user?.phone}
          filterLabel="priority document"
        />
        {showShareModal && selectedDocToShare && (
          <ShareModal
            document={selectedDocToShare}
            onSubmit={handleShareSubmit}
            onClose={handleShareClose}
          />
        )}
      </section>
    </>
  );
};

export default QuickBox;