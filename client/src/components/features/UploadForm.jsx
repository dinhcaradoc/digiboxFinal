import React, { useRef, useState } from 'react';
import { uploadDocument, getDocuments } from '../services/api';

const MAX_FILES = 10;
const MAX_SIZE_MB = 20;

const UploadForm = ({ onUploadSuccess }) => {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length + files.length > MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} files at once.`);
      return;
    }
    for (const file of selected) {
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`File "${file.name}" exceeds the ${MAX_SIZE_MB}MB limit.`);
        return;
      }
    }
    setFiles((prev) => [...prev, ...selected]);
    setError('');
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (files.length === 0) {
      setError('Please select at least one file to upload.');
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => formData.append('userdoc', file));
    try {
      await uploadDocument(formData);
      setFiles([]);
      // Refresh document list after upload
      const response = await getDocuments();
      onUploadSuccess(response.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'An error occurred during upload. Please try again.'
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow flex flex-col gap-4">
      <div>
        <label className="block font-medium mb-1">Select Files</label>
        <input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
          onChange={handleFileChange}
          ref={fileInputRef}
          disabled={isUploading}
          className="block w-full border border-gray-300 rounded px-3 py-2"
        />
        <small className="text-gray-500">
          Max {MAX_FILES} files, {MAX_SIZE_MB}MB each.
        </small>
      </div>
      {files.length > 0 && (
        <div>
          <p className="font-medium mb-1">Selected Files:</p>
          <ul className="max-h-32 overflow-y-auto border border-gray-200 rounded p-2">
            {files.map((file, idx) => (
              <li key={idx} className="flex justify-between items-center py-1">
                <span className="truncate max-w-xs">{file.name}</span>
                <button
                  type="button"
                  className="text-red-500 hover:text-red-700 ml-2"
                  onClick={() => removeFile(idx)}
                  aria-label={`Remove file ${file.name}`}
                >
                  &times;
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button
        type="submit"
        className={`bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700 transition ${
          isUploading ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload'}
      </button>
    </form>
  );
};

export default UploadForm;