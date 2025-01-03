import React, { useState } from 'react';
import { PdfInterface } from '../Interface/PdfInterface';
import toast from 'react-hot-toast';
import { uploadPdf } from '../Api/User';
import { useSelector } from 'react-redux';
import { RootState } from '../App/Store';
import { UserInterface } from '../Interface/UserInterface';

interface UploadPdfModalProps {
  onClose: () => void;
  onUploadSuccess: (newPdf: PdfInterface) => void; // Update this based on your API response
}

const UploadPdfModal: React.FC<UploadPdfModalProps> = ({ onClose, onUploadSuccess }) => {
  const user = useSelector((state: RootState) => state.user?.currentUser) as UserInterface | null;

  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file?.type !== 'application/pdf') {
      toast.error('Only pdf files are allowed')
    }
    if (!file?.name.endsWith('pdf')) {
      toast.error('Only pdf files are allowed')
    }
    setPdfFile(file);
  };


  const handleUpload = async () => {
    if (!pdfFile) {
      alert('Please select a PDF file to upload.');
      return;
    }
    console.log(user, "user")
    if (!user?._id) {
      alert('User ID is required.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('pdf', pdfFile);

      const result = await uploadPdf(user._id, formData);
      console.log(result) // Pass user.id directly
      if (result) {
        toast.success("Your pdf upload successfully")
        onUploadSuccess(result?.data); // Pass the new PDF data to parent
      }
      onClose(); // Close the modal
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload PDF.');
    } finally {
      setUploading(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Upload PDF</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            disabled={uploading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadPdfModal;
