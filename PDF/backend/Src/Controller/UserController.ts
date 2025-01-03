import { NextFunction, Request, Response } from "express";
import { IUserService } from "../Services/User/IUserServices";
import { STATUS_CODES } from '../Constants/HttpStatusCode'
import { verifyRefreshToken } from "../Utils/VerifyTokens";

const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = STATUS_CODES;
export class UserController {
    constructor(
        private userServices: IUserService
    ) { }
    // ********************************refresh access token for user******************


    async refreshToken(req: Request, res: Response, next: NextFunction): Promise<Response | any> {

        const refreshToken = req.cookies.refresh_token;
        console.log(refreshToken, "refreshtoken")
        if (!refreshToken)
            res.status(401).json({ success: false });

        try {
            const decoded = verifyRefreshToken(refreshToken);

            if (!decoded || !decoded.data) {

                res.status(401).json({ success: false, message: "Refresh Token Expired" });
            }

            const result = await this.userServices.getUserById(decoded.data);

            const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10)
                : 5 * 60 * 1000;

            const newAccessToken = result?.data?.token

            res.cookie('access_token', newAccessToken, {
                maxAge: accessTokenMaxAge,
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            })

            res.status(200).json({ success: true });
        }
        catch (error) {
            next(error);
        }
    }
    // *********************************signup*********************
    async userSignup(req: Request, res: Response): Promise<void> {
        try {

            const userData = req.body.userData
            const existingUser = await this.userServices.emailExist(userData.email)

            if (existingUser) {
                res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' })
            }

            const createUser = await this.userServices.createUser(userData)
            console.log(createUser, "createUser")
            res.status(OK).json({
                success: true,
                message: 'Your account is successfully created',
                user: createUser,
            });
        }
        catch (error) {
            res.status(500).json({ message: "Internal Server Error" })
        }

    }

    // *******************user Login*************
    async userLogin(req: Request, res: Response): Promise<void> {
        try {

            const userData = req.body.userData
            const result = await this.userServices.login(userData)

            if (result?.data.success) {

                const access_token = result.data.token;
                const refresh_token = result.data.refreshToken;
                const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                    ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10) : 5 * 60 * 1000;

                const refreshTokenMaxAge = process.env.REFRESH_TOKEN_MAX_AGE
                    ? parseInt(process.env.REFRESH_TOKEN_MAX_AGE, 10) : 48 * 60 * 60 * 1000;

                res.status(200)
                    .cookie('access_token', access_token, {
                        maxAge: accessTokenMaxAge,
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                    })
                    .cookie('refresh_token', refresh_token, {
                        maxAge: refreshTokenMaxAge,
                        httpOnly: true,
                        secure: true,
                        sameSite: 'none',
                    })
                    .json({ success: true, user: result.data, message: result.data.message });

            } else {

                res.status(BAD_REQUEST).json({ success: false, message: result?.data.message });
            }
        } catch (error) {

            res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
        }
    }


    // ********************user Logout****************************8

    async userLogout(req: Request, res: Response): Promise<void> {
        try {
            res.clearCookie('access_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });

            res.clearCookie('refresh_token', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
            });

            res.status(200).json({ success: true, message: "Logged out successfully" });

        }
        catch (error) {
            res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" })
        }
    }

    // ***********************fetch pdf********************
    async fetchPdf(req: Request, res: Response): Promise<void> {
        try {
            const userId: string = req.query.userId as string;
            if (!userId) {
                res.status(400).json({ message: "User ID is required" });
                return;
            }
            const result = await this.userServices.fetchPdf(userId)

            if (result) {
                res.status(200).json({
                    sucess: true,
                    data: result?.data,
                });
            }
        } catch (error) {
            console.error("Error in uploadPdf:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // **********************upload pdf********************


    async uploadPdf(req: Request, res: Response): Promise<void> {
        try {

            const userId: string = req.query.userId as string;

            if (!userId) {
                res.status(400).json({ message: "User ID is required" });
                return;
            }

            if (!req.file) {
                res.status(400).json({ message: "No file provided for upload" });
                return;
            }

            // Call the service method to handle PDF upload and database update
            const result = await this.userServices.uploadPdf(req.file, userId);

            if (result) {
                res.status(200).json({
                    message: "PDF uploaded and URL saved successfully",
                    data: result,
                });
            } else {
                res.status(500).json({
                    message: result.message || "Failed to upload PDF",
                });
            }
        } catch (error) {
            console.error("Error in uploadPdf:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // ******************fetch pdf details by id*********************

    async getPdfById(req: Request, res: Response): Promise<void> {
        try {
            const pdfId: string = req.query.pdfId as string;
            console.log(pdfId,"pdfid")
            if (!pdfId) {
                res.status(400).json({ message: "pdf ID is required" });
                return;
            }
            const result=await this.userServices.getPdfById(pdfId)
            console.log(result,"result getpdfId")
            if (result) {
                res.status(200).json({
                    data: result,
                });
            } else {
                res.status(500).json({
                    message: "Failed to Fetch PDF",
                });
            }
        }
        catch (error) {
            console.error("Error in uploadPdf:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    // ******************************create new pdf*******************

    async createPdf(req: Request, res: Response): Promise<void> {
        try {
            console.log(req.body, "req.body");
            const { pdfId, pages }: { pdfId: string; pages: number[] } = req.body;
            console.log(pdfId, "originalPdfId", pages, "selectedPages");

            if (!pdfId || !Array.isArray(pages) || pages.length === 0) {
                res.status(400).json({ message: 'Invalid request. Provide originalPdfId and selectedPages.' });  // Make sure to return here
            }

            const result = await this.userServices.createPdf(pdfId, pages);
            console.log(result, "result in controller");

            if (result) {
                // If PDF creation is successful, send the result
                res.status(200).json({ message: 'PDF created successfully', pdf: result });
            } else {
                // If no result or error occurs in PDF creation
                res.status(500).json({ message: 'Error creating PDF' });
            }
        } catch (error) {
            console.error("Error in uploadPdf:", error);
            if (!res.headersSent) { // Prevent sending headers if they've already been sent
                res.status(500).json({ message: "Internal Server Error" });
            }
        }
    }

}