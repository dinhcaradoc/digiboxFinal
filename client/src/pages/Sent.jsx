import React, { useEffect, useState } from 'react';
import DocArea from '../components/features/DocArea';
import { getSentDocs, downloadDocument } from '../services/api';
import Head from '../components/layout/Head';

const Sent = () => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getSentDocs()
      .then(res => setDocuments(res.data || []))
      .catch(() => setError("Failed to fetch sent documents."))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDownload = (doc) => downloadDocument(doc._id || doc.id);

  return (
    <section className="container mx-auto px-4 py-6">
      <Head title="Sent Documents" description="See files you've shared" />
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">Sent Box</h2>
      <DocArea
        documents={documents}
        isLoading={isLoading}
        error={error}
        onDownload={handleDownload}
        filterLabel="sent document"
      />
    </section>
  );
};

export default Sent;