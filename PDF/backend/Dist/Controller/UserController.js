"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const HttpStatusCode_1 = require("../Constants/HttpStatusCode");
const VerifyTokens_1 = require("../Utils/VerifyTokens");
const { BAD_REQUEST, OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, } = HttpStatusCode_1.STATUS_CODES;
class UserController {
    constructor(userServices) {
        this.userServices = userServices;
    }
    // ********************************refresh access token for user******************
    refreshToken(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const refreshToken = req.cookies.refresh_token;
            console.log(refreshToken, "refreshtoken");
            if (!refreshToken)
                res.status(401).json({ success: false });
            try {
                const decoded = (0, VerifyTokens_1.verifyRefreshToken)(refreshToken);
                if (!decoded || !decoded.data) {
                    res.status(401).json({ success: false, message: "Refresh Token Expired" });
                }
                const result = yield this.userServices.getUserById(decoded.data);
                const accessTokenMaxAge = process.env.ACCESS_TOKEN_MAX_AGE
                    ? parseInt(process.env.ACCESS_TOKEN_MAX_AGE, 10)
                    : 5 * 60 * 1000;
                const newAccessToken = (_a = result === null || result === void 0 ? void 0 : result.data) === null || _a === void 0 ? void 0 : _a.token;
                res.cookie('access_token', newAccessToken, {
                    maxAge: accessTokenMaxAge,
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                });
                res.status(200).json({ success: true });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // *********************************signup*********************
    userSignup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body.userData;
                const existingUser = yield this.userServices.emailExist(userData.email);
                if (existingUser) {
                    res.status(BAD_REQUEST).json({ success: false, message: 'The email is already in use!' });
                }
                const createUser = yield this.userServices.createUser(userData);
                console.log(createUser, "createUser");
                res.status(OK).json({
                    success: true,
                    message: 'Your account is successfully created',
                    user: createUser,
                });
            }
            catch (error) {
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // *******************user Login*************
    userLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body.userData;
                const result = yield this.userServices.login(userData);
                if (result === null || result === void 0 ? void 0 : result.data.success) {
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
                }
                else {
                    res.status(BAD_REQUEST).json({ success: false, message: result === null || result === void 0 ? void 0 : result.data.message });
                }
            }
            catch (error) {
                res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal server error" });
            }
        });
    }
    // ********************user Logout****************************8
    userLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                res.status(INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
            }
        });
    }
    // ***********************fetch pdf********************
    fetchPdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    res.status(400).json({ message: "User ID is required" });
                    return;
                }
                const result = yield this.userServices.fetchPdf(userId);
                if (result) {
                    res.status(200).json({
                        sucess: true,
                        data: result === null || result === void 0 ? void 0 : result.data,
                    });
                }
            }
            catch (error) {
                console.error("Error in uploadPdf:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // **********************upload pdf********************
    uploadPdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                if (!userId) {
                    res.status(400).json({ message: "User ID is required" });
                    return;
                }
                if (!req.file) {
                    res.status(400).json({ message: "No file provided for upload" });
                    return;
                }
                // Call the service method to handle PDF upload and database update
                const result = yield this.userServices.uploadPdf(req.file, userId);
                if (result) {
                    res.status(200).json({
                        message: "PDF uploaded and URL saved successfully",
                        data: result,
                    });
                }
                else {
                    res.status(500).json({
                        message: result.message || "Failed to upload PDF",
                    });
                }
            }
            catch (error) {
                console.error("Error in uploadPdf:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // ******************fetch pdf details by id*********************
    getPdfById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pdfId = req.query.pdfId;
                console.log(pdfId, "pdfid");
                if (!pdfId) {
                    res.status(400).json({ message: "pdf ID is required" });
                    return;
                }
                const result = yield this.userServices.getPdfById(pdfId);
                console.log(result, "result getpdfId");
                if (result) {
                    res.status(200).json({
                        data: result,
                    });
                }
                else {
                    res.status(500).json({
                        message: "Failed to Fetch PDF",
                    });
                }
            }
            catch (error) {
                console.error("Error in uploadPdf:", error);
                res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    // ******************************create new pdf*******************
    createPdf(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "req.body");
                const { pdfId, pages } = req.body;
                console.log(pdfId, "originalPdfId", pages, "selectedPages");
                if (!pdfId || !Array.isArray(pages) || pages.length === 0) {
                    res.status(400).json({ message: 'Invalid request. Provide originalPdfId and selectedPages.' }); // Make sure to return here
                }
                const result = yield this.userServices.createPdf(pdfId, pages);
                console.log(result, "result in controller");
                if (result) {
                    // If PDF creation is successful, send the result
                    res.status(200).json({ message: 'PDF created successfully', pdf: result });
                }
                else {
                    // If no result or error occurs in PDF creation
                    res.status(500).json({ message: 'Error creating PDF' });
                }
            }
            catch (error) {
                console.error("Error in uploadPdf:", error);
                if (!res.headersSent) { // Prevent sending headers if they've already been sent
                    res.status(500).json({ message: "Internal Server Error" });
                }
            }
        });
    }
}
exports.UserController = UserController;
