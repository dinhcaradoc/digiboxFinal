// src/pages/Inbox.jsx
// Inbox page: displays received documents with options to download, delete, and share
import React, { useEffect, useState } from "react";
import DocArea from "../components/features/DocArea";
import ShareModal from "../components/features/ShareModal";
import { getInbox, downloadDocument, deleteDocument, shareDocument } from "../services/api";
import Head from "../components/layout/Head";
import { useAuth } from "../contexts/AuthContext"; 

const Inbox = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedDocToShare, setSelectedDocToShare] = useState(null);
  const { user } = useAuth(); 

  const fetchInbox = async () => {
    setIsLoading(true);
    try {
      const res = await getInbox();
      setDocuments(res.data || []);
      setError("");
    } catch (err) {
      setError("Failed to fetch inbox documents.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInbox();
  }, []);

  const handleDownload = (doc) => {
    downloadDocument(doc.id || doc._id);
  };

  const handleDelete = async (doc) => {
    if (window.confirm(`Delete "${doc.name}" from your inbox?`)) {
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
    await fetchInbox();
  };

  return (
    <>
      <Head title="Inbox" description="View and manage your received documents" />
      <section className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Inbox</h2>
        <DocArea
          documents={documents}
          isLoading={isLoading}
          error={error}
          onDownload={handleDownload}
          onDelete={handleDelete}
          onShare={handleShare}
          filterLabel="inbox document"
          onPriorityToggle={handlePriorityToggle}
          userPhone={user?.phone}
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

export default Inbox;