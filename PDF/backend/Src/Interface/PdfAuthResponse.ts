
import { IPdf } from "../Model/PdfModel"


export interface PdfAuthResponse {
    status: number,
    success: boolean,
    data?: IPdf[] | IPdf,
    userId?: string,
    message?: string

}