import React, { useState } from 'react';
import Head from '../components/layout/Head';
import DocArea from '../components/features/DocArea';

const QuickBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      console.log('Selected file:', file.name);
    }
  };

  return (
    <>
      <Head
        title="Priority Docs"
        description="Fast access to your high-priority documents."
      />
      
      <div className="h-full flex flex-col">
        {/* Header area - Fixed height */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200 flex sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-blue-700">
            QuickBox: Your Priority Documents
          </h1>

          <label className="inline-flex items-center bg-blue-600 hover:bg-gold-500 text-white hover:text-black font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400">
            Upload a File
            <input
              type="file"
              className="hidden"
              onChange={handleFileChange}
              aria-label="Upload priority document"
            />
          </label>
        </div>

        {/* Document area - Scrollable */}
        <div className="flex-1 overflow-auto">
          <DocArea selectedFile={selectedFile} />
        </div>
      </div>
    </>
  );
};

export default QuickBox;