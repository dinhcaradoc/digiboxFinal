import React, { useEffect, useState } from 'react';
import UploadForm from '../components/features/UploadForm';
import { getDocuments } from '../services/api';

const Uploads = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch uploaded documents on mount
  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      try {
        const response = await getDocuments(); // Authenticated endpoint
        setDocuments(response.data || []);
      } catch (err) {
        console.error('Failed to fetch documents:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, []);

  return (
    <section className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Uploads</h2>

      {/* Upload Form */}
      <div className="mb-6">
        <UploadForm onUploadSuccess={setDocuments} />
      </div>

      {/* Uploaded Files Table */}
      {loading ? (
        <p className="text-gray-500">Loading documents...</p>
      ) : documents.length === 0 ? (
        <p className="text-gray-600">No documents uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto border rounded">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Size</th>
                <th className="px-4 py-2 text-left">Uploaded</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td className="px-4 py-2">{doc.name}</td>
                  <td className="px-4 py-2">{(+doc.attributes.size / 1024).toFixed(1)} KB</td>
                  <td className="px-4 py-2">{new Date(doc.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-2 space-x-2">
                    {doc.storageType === 'google_drive' ? (
                      <a
                        href={doc.attributes.location}
                        className="text-blue-600 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </a>
                    ) : (
                      <a
                        href={`/public/${doc.attributes.location}`}
                        download
                        className="text-blue-600 underline"
                      >
                        Download
                      </a>
                    )}
                    {/* Additional actions (delete, share, etc.) can go here */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Uploads;