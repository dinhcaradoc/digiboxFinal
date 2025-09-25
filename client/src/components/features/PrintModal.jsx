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

    // try {
    //   // **Replace with your actual API endpoint
    //   const response = await fetch("/api/print", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ docOTP }),
    //   });

    //   if (response.ok) {
    //     const blob = await response.blob();
    //     const url = window.URL.createObjectURL(blob);

    //     //Open in a new tab
    //     window.open(url, "_blank");

    //     //Clean up Url Object but after a slight delay that ensures the tab loads the url
    //     setTimeout(() => {
    //       window.URL.revokeObjectURL(url);
    //     }, 2000);

    //     onClose();
    //   } else {
    //     const errorData = await response.json();
    //     setError(errorData.message || "Failed to get document. Please check your document otp and try again.");
    //   }
    // // }
    // catch (error) {
    //   setError("An error occurred while processing your request. Please try again.");
    // }
    // finally {
    //   setIsLoading(false);
    // }
    try {
      window.open(`/print/download/${docOTP}`, '_blank');
      setIsLoading(false);
      onClose();
    } catch (error) {
      setError("Could not open download link. Try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/90"
      onClick={(e) => { // Close modal on backdrop click
        if (e.target === e.currentTarget)
          onClose()
      }}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden border border-gray-200">
        {/* Modal header */}
        <div className="flex justify-between items-center bg-blue-600 text-white p-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Print Document
            <span className="inline-block bg-gold-500 text-black text-[9px] px-1 py-0.5 rounded font-semibold ml-1 align-middle">
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

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-1 text-[12px] bg-red-50 text-red-600 rounded border border-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="docOTP" className="block font-semibold text-[16px] text-gray-700 mb-2">
              Enter Print Code
            </label>
            <input
              type="tel"
              inputMode="numeric"
              pattern="[0-9]*"
              id="docOTP"
              value={docOTP}
              onChange={(e) => {
                /^\d*$/.test(e.target.value)
                  ? (setDocOTP(e.target.value), setError(''))
                  :
                  setError('Invalid character. OTP should be numeric!');
              }}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter document print code"
              required
              autoFocus
            />
          </div>

          <p className="text-sm text-gray-600 mb-6">
            Enter the document OTP sent to your number to receive your document.
          </p>

          <div className="flex justify-end gap-8">
            <button
              type="button"
              className="px-6 py-2.5 bg-gray-200 text-gray-600 rounded font-semibold hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-gold-400 transition"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 bg-blue-600 text-white rounded font-semibold flex items-center justify-center transition hover:bg-gold-500 hover:text-black focus:outline-none focus:ring-2 focus:ring-gold-400 
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