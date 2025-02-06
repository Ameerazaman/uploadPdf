import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createNewPdf, pdfDetails } from "../Api/User";
import { PdfInterface } from "../Interface/PdfInterface";
import { PDFDocumentProxy, getDocument } from "pdfjs-dist";
import Navbar from "./Navbar";
import toast from "react-hot-toast";

function PdfDetail() {
  const { id } = useParams<{ id: string }>(); // Get the id from the route parameters
  const [pdfDetail, setPdfDetail] = useState<PdfInterface | null>(null);
  const [pageChecked, setPageChecked] = useState<{ [page: number]: boolean }>({});
  const [numPages, setNumPages] = useState<number>(0); // State to hold the number of pages
  const navigate = useNavigate()
  // Fetch PDF details by ID and load the PDF
  useEffect(() => {
    const fetchPdfDetail = async () => {
      try {
        if (id) {
          const response = await pdfDetails(id); // Assuming pdfDetails is an Axios call
          if (response && response.data) {
            const fetchedPdfDetail = response.data.data;
            setPdfDetail(fetchedPdfDetail); // Set PDF details in state

            // Load PDF if url exists
            if (fetchedPdfDetail.pdfUrl) {
              await loadPdf(fetchedPdfDetail.pdfUrl); // Load the PDF to get the number of pages
            }
          }
        }
        else{
          navigate('/login')
        }
      } catch (error) {
        console.error("Error fetching PDF details:", error);
      }
    };

    fetchPdfDetail();
  }, [id]);

  // Function to load PDF and get the number of pages
  const loadPdf = async (pdfUrl: string) => {
    try {
      const loadingTask = getDocument(pdfUrl);
      const pdf: PDFDocumentProxy = await loadingTask.promise;
      setNumPages(pdf.numPages); // Set the total number of pages in state
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
  };

  // Handle checkbox change for selecting/deselecting pages
  const handleCheckboxChange = (page: number) => {
    setPageChecked((prev) => ({
      ...prev,
      [page]: !prev[page], // Toggle checkbox state for the page
    }));
  };

  // Handle button click to create new PDF
  const handleButtonClick = async () => {
    // Collect selected pages
    const selectedPages = Object.keys(pageChecked)
      .filter((page) => pageChecked[parseInt(page)]) // Filter only the selected pages
      .map((page) => parseInt(page)); // Convert the page keys to integers

    if (selectedPages.length === 0) {
      alert("Please select at least one page to create a new PDF.");
      return;
    }

    // Ensure id is defined before passing to createNewPdf
    if (!id) {
      alert("PDF ID is missing.");
      return;
    }

    try {
      // Send selected pages to backend to create new PDF
      const response = await createNewPdf(id, selectedPages);
      console.log(response, "response");
      
      if (response) {
        toast.success("Created new pdf successfully")
        navigate('/home')
      }
    } catch (error) {
      console.error("Error creating new PDF:", error);
      alert("An error occurred while creating the new PDF.");
    }
  };


  return (
    <div><Navbar />
      <div className="p-4">

        <h1 className="text-2xl font-bold text-center mb-4">PDF Details</h1>
        {pdfDetail ? (
          <div>
            <h2 className="text-xl font-semibold">{pdfDetail.name}</h2>
            <div className="w-full">
              <iframe
                src={pdfDetail.pdfUrl}
                width="100%"
                height="600px"
                title="PDF Viewer"
                className="border rounded"
              ></iframe>
            </div>

            {/* Pages Checklist */}
            {numPages >= 2 && (
              <div className="mt-4">
                <h3 className="font-semibold text-center mb-4">Pages Checklist:</h3>

                {/* Pages Checklist */}
                <div className="flex flex-wrap justify-center gap-4">
                  {[...Array(numPages)].map((_, index) => (
                    <div key={index} className="flex items-center mb-2">
                      <input
                        type="checkbox"
                        id={`page-${index + 1}`}
                        checked={pageChecked[index + 1] || false}
                        onChange={() => handleCheckboxChange(index + 1)}
                        className="mr-2"
                      />
                      <label htmlFor={`page-${index + 1}`} className="text-center">
                        Page {index + 1}
                      </label>
                    </div>
                  ))}
                </div>

                {/* Button to create new PDF */}
                <div className="mt-6 flex justify-center">
                  <button
                    onClick={handleButtonClick}
                    className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
                  >
                    Create New PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p>Loading PDF details...</p>
        )}
      </div>
    </div>
  );
}

export default PdfDetail;
