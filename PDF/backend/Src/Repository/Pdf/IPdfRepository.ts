import { IPdf } from "../../Model/PdfModel";



export interface IPdfRepository {
    
    uploadPdf(pdfUrl: string, userId: string, pdfName: string): Promise<IPdf | null>
    fetchPdf(userId: string): Promise<IPdf[] | null>
    getPdfById(id: string): Promise<IPdf | null>
}