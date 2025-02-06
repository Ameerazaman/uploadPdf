import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PdfInterface } from "../Interface/PdfInterface";
import UploadPdfModal from "./UploadPdfModal";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useSelector } from "react-redux";
import { RootState } from "../App/Store";
import { UserInterface } from "../Interface/UserInterface";

interface HomePageProps {
  pdfData: PdfInterface[];
}

const HomePage: React.FC<HomePageProps> = ({ pdfData }) => {
  const user = useSelector((state: RootState) => state.user?.currentUser) as UserInterface | null;

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
            onClick={() => navigate(`/pdf-detail/${pdf._id}`)}
          >
            <div className="w-full h-[300px] overflow-hidden flex items-center justify-center bg-gray-100 rounded-t-lg">
              {/* Wrapping Viewer in a div for styling */}
              <div style={{ width: "100%", height: "100%" }}>
                <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
                  <Viewer fileUrl={pdf?.pdfUrl || ""} defaultScale={0.8} withCredentials={false} />
                </Worker>

              </div>
            </div>
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
