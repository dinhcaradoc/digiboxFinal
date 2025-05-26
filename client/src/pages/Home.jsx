import { useState } from 'react';
// import Navbar from '../components/layout/Navbar';
import UploadModal from '../components/features/UploadModal';
import PrintModal from '../components/features/PrintModal';
import bgImage from '../assets/landing-uni-way.JPG';
import Head from '../components/layout/Head';

const Home = () => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <>
      {/* Dynamic Head Metadata */}
      <Head title="Home" description="Manage your documents on the go." />
    <div className='min-h-screen flex flex-col bg-gray-50 relative'>
      {/*Background image */}
      <div className='absolute inset-0 w-full h-full bg-cover bg-center pointer-events-none'
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundColor: "#2A616D",
          backgroundBlendMode: "hard-light",
          backgroundRepeat: "no-repeat",
          opacity: 0.44,
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navbar */}
        <main className='flex-grow flex flex-col items-center justify-center px-4 py-12'>
          <div className='max-w-2xl text-center'>
            {/* Logo/Brand Name */}
            <h1 className='text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4 drop-shadow'>
              Digibox Chapisha
            </h1>

            {/* Compelling headline that hints about features and benefits to expect */}
            <p className='text-base sm:text-xl text-gray-800 mb-5 sm:mb-6'>
              Your one stop solution to manage your documents on the go.<br className='hidden sm:inlne' />
              Upload, share, print and more.
            </p>

            {/* Gold accent badge */}
            <div className="mb-10 flex justify-center">
              <span className="inline-block bg-gold-600 text-black px-4 py-1 rounded-full font-medium shadow-sm">
                Secure. Fast. Reliable.
              </span>
            </div>

            {/* Call-to-action buttons */}
            <div className='flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-16'>
              <button className='sm:w-32 w-full px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300'
                onClick={() => setIsUploadModalOpen(true)}
              >
                Upload
              </button>
              <button className='sm:w-32 w-full px-8 py-3 bg-blue-600 text-white text-lg font-medium rounded-md shadow-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300'
                onClick={() => setIsPrintModalOpen(true)}
              >
                Print
              </button>
            </div>

          </div>
        </main>

        {/* Modals */}
        {isUploadModalOpen && (
          <UploadModal
            onClose={() => setIsUploadModalOpen(false)}
          />
        )}
        {isPrintModalOpen && (
          <PrintModal
            onClose={() => setIsPrintModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;