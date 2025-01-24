import { existsSync } from 'fs';
import { STATUS_CODES } from '../../Constants/HttpStatusCode'
import { UserAuthResponse } from "../../Interface/UserAuthResponse";
import { IUser } from '../../Model/UserModel';
import { IUserRepository } from "../../Repository/User/IUserRepository";
import Encrypt from '../../Utils/ComparedPassword';
import { IUserService } from "./IUserServices";
import { creatJWT } from '../../Utils/GenerateToken';
import cloudinary from '../../Utils/Cloudinary';
import { uploadPdfToCloudinary } from '../../Utils/Uploads';
import { IPdfRepository } from '../../Repository/Pdf/IPdfRepository';
import { IPdf } from '../../Model/PdfModel';
import { PdfAuthResponse } from '../../Interface/PdfAuthResponse';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs'
import path from 'path';
import axios from 'axios';
import { timeStamp } from 'console';

const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, BAD_REQUEST } = STATUS_CODES;

export class UserServices implements IUserService {
    constructor(
        private userRepository: IUserRepository,
        private pdfRepository: IPdfRepository,
        private encrypt: Encrypt,
        private createjwt: creatJWT
    ) { }

    // **********check email exist*****************

    async emailExist(email: string): Promise<IUser | null> {
        try {
            const result = await this.userRepository.emailExistCheck(email)
            return result
        }
        catch (error) {
            return null
        }
    }

    // *******************Create and save user*************************8

    async createUser(userData: IUser): Promise<IUser | null> {
        try {

            console.log(userData.password)
            userData.password = await this.encrypt.hashPassword(userData.password)
            const result = await this.userRepository.createUser(userData)

            return result
        }
        catch (error) {
            return null
        }
    }
    //    *********************Login*********************

    async login(userData: IUser): Promise<UserAuthResponse | null> {
        try {
            const existingUser = await this.userRepository.emailExistCheck(userData.email)
            if (!existingUser) {
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'User not found',
                    }
                };
            }
            const validPassword = await this.encrypt.compare(userData.password, existingUser.password)
            if (!validPassword) {
                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'Incorrect Password, Try again',
                    }
                };
            }
            const token = this.createjwt.generateToken(existingUser.id!);
            const refreshToken = this.createjwt.generateRefreshToken(existingUser.id!);
            return {
                status: OK,
                data: {
                    success: true,
                    userId: existingUser?.id,
                    token: token,
                    data: existingUser,
                    refreshToken: refreshToken,
                    message: "You are login successfully"
                }
            };

        } catch (error) {

            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error'
                }
            };
        }
    }

    // ****************************upload file***********************

    async uploadPdf(file: any, userId: string): Promise<any | null> {
        try {

            const cloudinaryResult = await uploadPdfToCloudinary(file.path)

            if (cloudinaryResult?.url && userId) {
                const result = await this.pdfRepository.uploadPdf(cloudinaryResult?.url, userId, file?.originalname)
                return result
            }

        }
        catch (error) {
            return {
                status: INTERNAL_SERVER_ERROR,
                data: {
                    success: false,
                    message: 'Internal server error'
                }
            };
        }
    }

    // ****************************fetch pdf***************
    async fetchPdf(userId: string): Promise<PdfAuthResponse | null> {
        try {
            const result = await this.pdfRepository.fetchPdf(userId);

            return {
                status: 200,
                success: true,
                data: result as IPdf[], // Assuming result is of type IPdf[] or IPdf

            };
        } catch (error) {
            console.error(`Error fetching PDFs for userId ${userId}:`, error);
            return {
                status: 500,
                success: false,
                message: 'Internal server error',

            };
        }
    }

    // ****************************user ge by id*******************************

    async getUserById(userId: string): Promise<UserAuthResponse | null> {
        try {
            let user = await this.userRepository.getUserById(userId)
            if (!user) {

                return {
                    status: UNAUTHORIZED,
                    data: {
                        success: false,
                        message: 'User not found',
                    }
                };
            }
            const newAccessToken = this.createjwt.generateToken(user.id!);
            return {
                status: OK,
                data: {
                    success: true,
                    userId: user.id,
                    token: newAccessToken,
                    data: user

                }
            };
        }
        catch (error) {
            console.log(error as Error);
            return null;
        }

    }

    // ***************************get pdf by id for pdf detail*****************

    async getPdfById(pdfId: string): Promise<IPdf | null> {
        try {
            return this.pdfRepository.getPdfById(pdfId)
        }
        catch (error) {
            return null
        }
    }

    // ***************************create pdf *************************


    async createPdf(originalPdfId: string, selectedPages: number[]): Promise<any | null> {
        try {
            console.log("createPdf invoked");

            // Fetch file info from MongoDB (mock example)
            const pdfEntry = await this.pdfRepository.getPdfById(originalPdfId);
            if (!pdfEntry) {
                throw new Error(`PDF with ID ${originalPdfId} not found in the database.`);
            }

            const fileLocation = pdfEntry.pdfUrl;
            console.log("File Location:", fileLocation);

            let existingPdfBytes: Buffer;

            // Handle file location: remote URL or local path
            if (fileLocation.startsWith('http')) {
                console.log("File is a remote URL, downloading...");
                const response = await axios.get(fileLocation, { responseType: 'arraybuffer' });
                existingPdfBytes = Buffer.from(response.data); // Convert the response to a Buffer
            } 
            else {
                console.log("File is a local path, reading...");
                if (!fs.existsSync(fileLocation)) {
                    throw new Error(`Local file not found: ${fileLocation}`);
                }
                existingPdfBytes = fs.readFileSync(fileLocation); // Read the local file
            }

            console.log("PDF File Loaded Successfully");

            // Load the original PDF document
            const pdfDoc = await PDFDocument.load(existingPdfBytes);
            console.log("Original PDF Loaded");

            // Create a new PDF document
            const newPdfDoc = await PDFDocument.create();
            console.log("New PDF Document Created");

            // Add selected pages to the new PDF
            for (const pageIndex of selectedPages) {
                if (pageIndex < 1 || pageIndex > pdfDoc.getPageCount()) {
                    throw new Error(`Invalid page index: ${pageIndex}`);
                }
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex - 1]); // PDF pages are 0-indexed
                newPdfDoc.addPage(copiedPage);
            }

            // Serialize the new PDF
            const newPdfBytes = await newPdfDoc.save();
            console.log("New PDF Bytes Generated");

            // Save the new PDF to a temporary location before uploading to Cloudinary
            const tempFilePath = './temp_new_pdf.pdf';
            fs.writeFileSync(tempFilePath, newPdfBytes);

            // Upload the generated PDF to Cloudinary
            const uploadResult = await uploadPdfToCloudinary(tempFilePath);
            console.log(uploadResult, "uploadResult")
            

            if (!uploadResult.success) {
                throw new Error(uploadResult.message);  // If upload failed, throw an error
            }

            // Save the Cloudinary URL and other metadata in the database (optional)
            const cloudinaryUrl = uploadResult.url as string;
            console.log(cloudinaryUrl, "cloudinaryUrl")
            // Cloudinary URL for the uploaded file
            const cloudinaryFilename = `${pdfEntry?.name}_${Date.now()}`;   // Cloudinary filename

            // Assuming you have a method to save the metadata to MongoDB
            await this.pdfRepository.uploadPdf(cloudinaryUrl, pdfEntry?.userId,cloudinaryFilename);

            console.log("PDF uploaded successfully to Cloudinary");

            return uploadResult;  // Return the result with the URL from Cloudinary

        } catch (error) {
            console.error("Error in createPdf:", error);
            return null;
        }
    }
}


