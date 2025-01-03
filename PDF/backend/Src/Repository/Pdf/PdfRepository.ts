import PdfModel, { IPdf } from "../../Model/PdfModel"

import { BaseRepository } from "../BaseRepository"
import { IPdfRepository } from "./IPdfRepository"




export class PdfRepository extends BaseRepository<typeof PdfModel> implements IPdfRepository {
    constructor() {
        super(PdfModel)
    }

    // ************************upload pdf*************************
    async uploadPdf(pdfUrl: string, userId: string, pdfName: string): Promise<IPdf | null> {
        try {

            const pdfData = {
                userId: userId,
                pdfUrl: pdfUrl,
                name: pdfName,
            }
            const result = await this.model.create(pdfData);

            return result;
        } catch (error) {
            console.error("Error in uploadPdf repository:", error);
            return null;
        }
    }

    // *********************fech pdfs*********************

    async fetchPdf(userId: string): Promise<IPdf[] | null> {
        try {

            // Correct the find query by passing the userId as a key-value pair inside an object
            const result = await this.model.find({ userId: userId });  // Directly use the model for testing


            return result as IPdf[];  // Ensure the result is of type IPdf[]
        } catch (error) {
            console.error("Error in uploadPdf repository:", error);
            return null;
        }
    }

    // *********************fetch pdf details*****************
    async getPdfById(id: string): Promise<IPdf | null> {
        try {
            
            const result = await this.model.findById(id)
            console.log(result)
            return result
        }
        catch (error) {
            return null
        }
    }

}