import { PdfAuthResponse } from "../../Interface/PdfAuthResponse";
import { UserAuthResponse } from "../../Interface/UserAuthResponse";
import { IPdf } from "../../Model/PdfModel";
import { IUser } from "../../Model/UserModel";

export interface IUserService {
    emailExist(email: string): Promise<IUser | null>
    createUser(userData: IUser): Promise<IUser | null>
    login(userData: IUser): Promise<UserAuthResponse | null>
    uploadPdf(file: any, userId: string): Promise<any | null>
    fetchPdf(userId: string): Promise<PdfAuthResponse | null>
    getUserById(userId: string): Promise<UserAuthResponse | null>
    getPdfById(pdfId: string): Promise<IPdf | null>
    createPdf(originalPdfId: string, selectedPages: number[]): Promise<any>
}