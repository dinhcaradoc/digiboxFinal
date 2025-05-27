import React, { useState, useEffect } from 'react';
import { ExclamationTriangleIcon, DocumentTextIcon, EyeIcon, ArrowDownTrayIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

// Sample data for development and fallback
const sampleDocs = [
  {
    id: '1',
    name: 'Project Proposal.pdf',
    size: '2.4 MB',
    sender: 'john@example.com',
    message: 'Please review this proposal for the upcoming project.',
    date: '2025-05-19T14:30:00Z'
  },
  {
    id: '2',
    name: 'Invoice #1234.pdf',
    size: '1.1 MB',
    sender: 'billing@company.com',
    message: 'Your monthly invoice is ready for review.',
    date: '2025-05-18T09:15:00Z'
  },
  {
    id: '3',
    name: 'Meeting Notes.docx',
    size: '0.8 MB',
    sender: 'team@digibox.com',
    message: 'Notes from yesterday\'s strategy meeting.',
    date: '2025-05-17T16:45:00Z'
  }
];

// Format date to a more readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // If today, show time
  if (date.toDateString() === today.toDateString()) {
    return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // If yesterday, show "Yesterday"
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  // Otherwise show date
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

// Get file type icon or color based on extension
const getFileType = (filename) => {
  const extension = filename.split('.').pop().toLowerCase();
  
  if (['pdf'].includes(extension)) {
    return { color: 'text-red-600', bg: 'bg-red-100' };
  } else if (['doc', 'docx'].includes(extension)) {
    return { color: 'text-blue-600', bg: 'bg-blue-100' };
  } else if (['xls', 'xlsx', 'csv'].includes(extension)) {
    return { color: 'text-green-600', bg: 'bg-green-100' };
  } else if (['ppt', 'pptx'].includes(extension)) {
    return { color: 'text-orange-600', bg: 'bg-orange-100' };
  } else {
    return { color: 'text-gray-600', bg: 'bg-gray-100' };
  }
};

const DocArea = ({ selectedFile }) => {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      // Check if we're in development mode
      const isDev = process.env.NODE_ENV === 'development';
      
      if (isDev) {
        // In development, use sample data immediately
        setDocuments(sampleDocs);
        setIsLoading(false);
        return;
      }
      
      try {
        const res = await fetch('/api/getAll');
        if (!res.ok) throw new Error('Failed to fetch documents');
        setDocuments(await res.json());
      } catch (err) {
        console.error('Error fetching documents:', err);
        // Fall back to sample data when API fails
        setDocuments(sampleDocs);
        setError('Using sample data (API unavailable)');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, []);

  const handleView = (docId) => {
    console.log(`View document ${docId}`);
    // Implementation would go here
  };

  const handleDownload = (docId) => {
    console.log(`Download document ${docId}`);
    // Implementation would go here
  };

  const handleDelete = (docId) => {
    console.log(`Delete document ${docId}`);
    // Implementation would go here
    // For now, remove from local state
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="border-0 rounded-xl overflow-hidden"> {/*rounded-lg border-gray-200 shadow-sm*/}
      <div className="p-4 sm:p-6">
        {/* Search bar instead of heading */}
        <div className="mb-6">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents, senders, or messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
          </div>
          {searchTerm && (
            <p className="mt-2 text-sm text-gray-600">
              {filteredDocuments.length} document{filteredDocuments.length !== 1 ? 's' : ''} found
            </p>
          )}
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <ExclamationTriangleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        {selectedFile && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
            New file selected: {selectedFile.name}
          </div>
        )}

        <div className="space-y-2 ">
          {isLoading ? (
            <div className="p-4">
              <div className="animate-pulse space-y-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ) : filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => {
              const fileType = getFileType(doc.name);
              return (
                <div 
                  key={doc.id} 
                  className="flex items-start p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-blue-50 transition-colors"
                >
                  {/* File type icon */}
                  <div className={`p-3 rounded-lg ${fileType.bg} mr-4 hidden sm:block`}>
                    <DocumentTextIcon className={`w-6 h-6 ${fileType.color}`} />
                  </div>
                  
                  {/* Main content container - responsive layout */}
                  <div className="flex flex-col sm:flex-row flex-1 min-w-0">
                    {/* Column 1: Document info, date, size - smaller proportion */}
                    <div className="flex-none w-full sm:w-1/3 pr-0 sm:pr-4 mb-2 sm:mb-0">
                      <h3 
                        className="font-medium text-gray-900 truncate mb-1" 
                        title={doc.name}
                      >
                        {doc.name}
                      </h3>
                      <div className="flex items-center text-xs text-gray-500 gap-x-2">
                        <span>{formatDate(doc.date)}</span>
                        <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{doc.size}</span>
                      </div>
                    </div>
                    
                    {/* Column 2: Sender and message - larger proportion */}
                    <div className="flex-1 min-w-0">
                      <div 
                        className="text-sm font-medium text-blue-600 mb-1 truncate" 
                        title={doc.sender}
                      >
                        {doc.sender}
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2">{doc.message}</p>
                    </div>
                  </div>
                  
                  {/* Column 3: Actions */}
                  <div className="flex gap-1 ml-0 sm:ml-4 mt-2 sm:mt-0 shrink-0 justify-end sm:justify-start">
                    <button 
                      onClick={() => handleView(doc.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="View document"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDownload(doc.id)}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Download document"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc.id)}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete document"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })
          ) : searchTerm ? (
            <div className="p-8 text-center text-gray-500">
              <MagnifyingGlassIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No documents found matching "{searchTerm}"</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <DocumentTextIcon className="w-12 h-12 mx-auto text-gray-300 mb-3" />
              <p>No documents found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocArea;