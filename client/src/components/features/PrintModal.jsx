import { useState } from "react";

const PrintModal = ({ onClose }) => {
  const [docOTP, setDocOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP
    if (!docOTP.trim()) {
      setError("Please enter a valid print code.");
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // **Replace with your actual API endpoint
      const response = await fetch("/api/print", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ docOTP }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        //Open in a new tab
        window.open(url, "_blank");

        //Clean up Url Object but after a slight delay that ensures the tab loads the url
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
        }, 2000);

        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to get document. Please check your document otp and try again.");
      }
    }
    catch (error) {
      setError("An error occurred while processing your request. Please try again.");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-300">
        <div className="flex justify-between items-center bg-blue-600 text-white p-4">
          <h2 className="text-xl font-semibold">Print Document</h2>
          <button
            className="text-white hover:text-blue-200 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="docOTP" className="block font-semibold text-gray-700 mb-2">
              Enter Print Code
            </label>
            <input
              type="text"
              id="docOTP"
              value={docOTP}
              onChange={(e) => setDocOTP(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter document print code"
              required
              autoFocus
            />
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Enter the document OTP sent to your number to get your document.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:text-gray-400 focus:outline-none"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none font-semibold flex items-center 
                ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              disabled={isLoading}
            >
              {isLoading && (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              )}
              {isLoading ? "Processing..." : "Print"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PrintModal;