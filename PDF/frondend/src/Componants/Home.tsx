import React, { useEffect, useState } from 'react';
import HomePage from '../Pages/HomePage';
import { useSelector } from 'react-redux';
import { RootState } from '../App/Store';
import { UserInterface } from '../Interface/UserInterface';
import { fetchPdf } from '../Api/User';

import Navbar from '../Pages/Navbar';
import UploadPdfModal from '../Pages/UploadPdfModal';
import { PdfInterface } from '../Interface/PdfInterface';
import { useNavigate } from 'react-router-dom';

function Home() {
  const user = useSelector((state: RootState) => state.user?.currentUser) as UserInterface | null;
  const [pdfData, setPdfData] = useState<PdfInterface[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?._id) {
          const result: PdfInterface[] = await fetchPdf(user._id);
          console.log(result)
          setPdfData(result)
        } else {
          setPdfData([]);
          navigate('/login') // Default to empty array if user ID is not available
        }
      } catch (error) {
        console.error('Error fetching PDF:', error);
        setPdfData([]); // Set to empty array in case of error
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [user?._id]);





  const handleUploadClick = () => {
    setShowModal(true)
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        {loading ? (
          <div className="animate-spin text-red-500 w-10 h-10 border-4 border-red-500 border-t-transparent rounded-full"></div>
        ) : pdfData.length > 0 ? (
          <HomePage pdfData={pdfData} />
        ) : (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">No PDFs found!</p>
            <p className="text-sm text-gray-500 mb-4">You haven't uploaded any PDFs yet.</p>
            <button
              onClick={handleUploadClick}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              Upload PDF
            </button>
          </div>
        )}
      </div>
      {showModal && (
        <UploadPdfModal
          onClose={() => setShowModal(false)}
          onUploadSuccess={(newPdf) => {
            setPdfData((prev) => [...prev, newPdf]); // Ensure the type matches PdfInterface
          }}
        />

      )}
    </div>
  );
}

export default Home;
