import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

const UploadModal = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recepientPhone, setRecepientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    setFiles(prev => [
      ...prev,
      ...acceptedFiles
    ]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    accept: {
      'application/pdf': [],
      'application/msword': [],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [],
      'application/vnd.ms-excel': [],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [],
      'text/plain': [],
    }
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (files.length === 0) {
      setError("Select at least one file to upload.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    files.forEach(file => formData.append("userdoc", file));
    formData.append("phoneNumber", phoneNumber);
    formData.append("recepientPhone", recepientPhone);
    formData.append("message", message);

    try {
      const response = await fetch("/api/upload", {  //Insert actual api route
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        alert("Document upload was successful!: " + result);
        onClose();
      } else {
        const error = await response.json();
        setError(error.message || "File upload failed. Please try again.");
      }
    } catch (error) {
      setError("An error occurred while uploading the files. Please try again.");
    }
    finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md mx-4 p-2 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center bg-blue-600 text-white p-4">
          <h2 className="text-xl font-semibold">Upload Document</h2>
          <button
            className="text-white hover:text-blue-200 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div
            {...getRootProps({
              className: `border-2 ${isDragActive ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"} rounded-lg p-6 mb-4 
            flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50`
            })}
          >
            <input {...getInputProps()} ref={fileInputRef} />
            <svg className="w-12 h-12 text-blue-600 mb-4" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-blue-600 font-medium">
              {isDragActive ? "Drop files here..." : "Drag and drop files here, or click to select files"}
            </p>
            <p className="text-gray-500 text-sm mt-1">or</p>
            <button
              type="button"
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none"
              onClick={e => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
            >
              Browse Files
            </button>
          </div>
          {files.length > 0 && (
            <div className="mb-4">
              <p className="font-medium mb-2">Selected Files:</p>
              <ul className="max-h-32 overflow-y-auto border border-gray-300 rounded p-2">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center 
                  py-1">
                    <span className="truncate max-w-xs">{file.name}</span>
                    <button
                      type="button"
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      onClick={() => removeFile(index)}
                      aria-label={`Remove file ${file.name}`}
                    >
                      &times;
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center mb-2">
            <label htmlFor="phoneNumber" 
            className="w-35 font-semibold text-gray-700 mb-1">
              Your Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="flex-1 rounded border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+254 xxx xxx xxx"
              required
            />
          </div>

          <div className="flex items-center mb-2">
            <label
              htmlFor="recepientPhone"
              className="w-35 font-semibold text-gray-700 mb-1"
            >
              Recepient Phone (Optional)
            </label>
            <input
              type="tel"
              id="recipientPhone"
              value={recepientPhone}
              onChange={e => setRecipientPhone(e.target.value)}
              className="flex-1 rounded border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+254 xxx xxx xxx"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="message" className="mb-2 font-semibold text-gray-700">
              Message (Optional)
            </label>
            <textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your message here"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none 
                ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadModal;