import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";

const UploadModal = ({ onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const onDrop = (acceptedFiles) => {
    const MAX_FILES = 5;
    if (files.length + acceptedFiles.length > MAX_FILES) {
      setError(`You can upload a maximum of ${MAX_FILES} files.`);
      return;
    }
    setFiles((prev) => [...prev, ...acceptedFiles]);
    setFiles((prev) => [...prev, ...acceptedFiles]);
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
    },
  });

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!phoneNumber || !/^\+\d{10,15}$/.test(phoneNumber)) {
      setError("Please enter a valid phone number in the specified format (e.g., +254712345678).");
      return;
    }

    if (files.length === 0) {
      setError("Select at least one file to upload.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("userdoc", file));
    formData.append("phoneNumber", phoneNumber);
    formData.append("recipientPhone", recipientPhone);
    formData.append("message", message);

    try {
      const response = await fetch("/api/upload", {
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
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/90"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="
          bg-white rounded-lg shadow-2xl w-full
          max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl
          mx-4 p-2 max-h-[90vh] overflow-y-auto border border-gray-200
        "
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Modal header */}
        <div className="flex justify-between items-center bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Upload Document
            <span className="inline-block bg-gold-500 text-black text-xs px-1 py-0.5 rounded font-semibold ml-1 align-middle">
              Secure
            </span>
          </h2>
          <button
            className="text-white hover:text-gold-300 focus:outline-none focus:ring-2 focus:ring-gold-400 rounded"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-3 [&>*]:mb-4 last:[&>*]:mb-0"
        >
          {/* Dropzone */}
          <div
            {...getRootProps({
              className: `border-2 ${isDragActive ? "border-blue-500 bg-blue-50" : "border-dashed border-gray-300"} rounded-lg p-4 text-center mb-4 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition w-full`
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
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-gold-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-gold-400 transition w-full sm:w-auto"
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
                  <li key={index} className="flex justify-between items-center py-1">
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

          {/* Phone Number - Improved responsive layout */}
          <div className="grid grid-cols-1 mt-2 sm:grid-cols-3 gap-2 items-start">
            <label
              htmlFor="phoneNumber"
              className="font-semibold text-gray-700 text-sm sm:text-base sm:pt-2"
            >
              Your Phone Number
            </label>
            <div className="sm:col-span-2">
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                placeholder="+254 xxx xxx xxx"
                required
              />
            </div>
          </div>

          {/* Recipient Phone - Improved responsive layout */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
            <label
              htmlFor="recipientPhone"
              className="font-semibold text-gray-700 text-sm sm:text-base sm:pt-2"
            >
              Recipient Phone <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <div className="sm:col-span-2">
              <input
                type="tel"
                id="recipientPhone"
                value={recipientPhone}
                onChange={e => setRecipientPhone(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
                placeholder="+254 xxx xxx xxx"
              />
            </div>
          </div>

          {/* Message - Improved layout */}
          <div className="flex flex-col">
            <label
              htmlFor="message"
              className="mb-2 font-semibold text-gray-700 text-sm sm:text-base"
            >
              Message <span className="text-gray-500 font-normal">(Optional)</span>
            </label>
            <textarea
              id="message"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full"
              placeholder="Enter your message here"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-2">
            <button
              type="button"
              className="px-6 py-2.5 bg-gray-200 text-gray-600 rounded font-semibold hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-gold-400 transition w-full sm:w-auto"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 bg-blue-600 text-white rounded font-semibold flex items-center justify-center transition hover:bg-gold-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-gold-400 w-full sm:w-auto
                ${isUploading ? "opacity-70 cursor-not-allowed" : ""}`}
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