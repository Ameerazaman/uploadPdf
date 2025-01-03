import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PdfInterface } from "../Interface/PdfInterface";
import UploadPdfModal from "./UploadPdfModal";

interface HomePageProps {
  pdfData: PdfInterface[];
}

const HomePage: React.FC<HomePageProps> = ({ pdfData }) => {
  const [pdfList, setPdfList] = useState<PdfInterface[]>(pdfData);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(pdfList, "pdfList");
  }, [pdfList]);

  return (
    <div>
      <h1 className="text-center text-2xl font-bold mb-4">PDF List</h1>
      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600"
        >
          Upload New PDF
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center">
        {pdfList.map((pdf) => (
          <div
            key={pdf?._id}
            className="w-80 border shadow-lg rounded-lg overflow-hidden cursor-pointer"
            onClick={() => navigate(`/pdf-detail/${pdf._id}`)} // Navigate to PdfDetail
          >
            <iframe
              src={pdf?.pdfUrl}
              width="100%"
              height="300px"
              title={`PDF Preview - ${pdf?._id}`}
              className="rounded-t-lg"
            ></iframe>
            <div className="p-2 text-center">
              <p>{pdf?.name || "Untitled PDF"}</p>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <UploadPdfModal
          onClose={() => setShowModal(false)}
          onUploadSuccess={(newPdf) => {
            setPdfList((prev) => [...prev, newPdf]);
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
