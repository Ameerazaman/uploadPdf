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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const HttpStatusCode_1 = require("../../Constants/HttpStatusCode");
const Uploads_1 = require("../../Utils/Uploads");
const pdf_lib_1 = require("pdf-lib");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const { OK, INTERNAL_SERVER_ERROR, UNAUTHORIZED, BAD_REQUEST } = HttpStatusCode_1.STATUS_CODES;
class UserServices {
    constructor(userRepository, pdfRepository, encrypt, createjwt) {
        this.userRepository = userRepository;
        this.pdfRepository = pdfRepository;
        this.encrypt = encrypt;
        this.createjwt = createjwt;
    }
    // **********check email exist*****************
    emailExist(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.userRepository.emailExistCheck(email);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************Create and save user*************************8
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userData.password);
                userData.password = yield this.encrypt.hashPassword(userData.password);
                const result = yield this.userRepository.createUser(userData);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    //    *********************Login*********************
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingUser = yield this.userRepository.emailExistCheck(userData.email);
                if (!existingUser) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'User not found',
                        }
                    };
                }
                const validPassword = yield this.encrypt.compare(userData.password, existingUser.password);
                if (!validPassword) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'Incorrect Password, Try again',
                        }
                    };
                }
                const token = this.createjwt.generateToken(existingUser.id);
                const refreshToken = this.createjwt.generateRefreshToken(existingUser.id);
                return {
                    status: OK,
                    data: {
                        success: true,
                        userId: existingUser === null || existingUser === void 0 ? void 0 : existingUser.id,
                        token: token,
                        data: existingUser,
                        refreshToken: refreshToken,
                        message: "You are login successfully"
                    }
                };
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
        });
    }
    // ****************************upload file***********************
    uploadPdf(file, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const cloudinaryResult = yield (0, Uploads_1.uploadPdfToCloudinary)(file.path);
                if ((cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.url) && userId) {
                    const result = yield this.pdfRepository.uploadPdf(cloudinaryResult === null || cloudinaryResult === void 0 ? void 0 : cloudinaryResult.url, userId, file === null || file === void 0 ? void 0 : file.originalname);
                    return result;
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
        });
    }
    // ****************************fetch pdf***************
    fetchPdf(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.pdfRepository.fetchPdf(userId);
                return {
                    status: 200,
                    success: true,
                    data: result, // Assuming result is of type IPdf[] or IPdf
                };
            }
            catch (error) {
                console.error(`Error fetching PDFs for userId ${userId}:`, error);
                return {
                    status: 500,
                    success: false,
                    message: 'Internal server error',
                };
            }
        });
    }
    // ****************************user ge by id*******************************
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let user = yield this.userRepository.getUserById(userId);
                if (!user) {
                    return {
                        status: UNAUTHORIZED,
                        data: {
                            success: false,
                            message: 'User not found',
                        }
                    };
                }
                const newAccessToken = this.createjwt.generateToken(user.id);
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
                console.log(error);
                return null;
            }
        });
    }
    // ***************************get pdf by id for pdf detail*****************
    getPdfById(pdfId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return this.pdfRepository.getPdfById(pdfId);
            }
            catch (error) {
                return null;
            }
        });
    }
    // ***************************create pdf *************************
    createPdf(originalPdfId, selectedPages) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("createPdf invoked");
                // Fetch file info from MongoDB (mock example)
                const pdfEntry = yield this.pdfRepository.getPdfById(originalPdfId);
                if (!pdfEntry) {
                    throw new Error(`PDF with ID ${originalPdfId} not found in the database.`);
                }
                const fileLocation = pdfEntry.pdfUrl;
                console.log("File Location:", fileLocation);
                let existingPdfBytes;
                // Handle file location: remote URL or local path
                if (fileLocation.startsWith('http')) {
                    console.log("File is a remote URL, downloading...");
                    const response = yield axios_1.default.get(fileLocation, { responseType: 'arraybuffer' });
                    existingPdfBytes = Buffer.from(response.data); // Convert the response to a Buffer
                }
                else {
                    console.log("File is a local path, reading...");
                    if (!fs_1.default.existsSync(fileLocation)) {
                        throw new Error(`Local file not found: ${fileLocation}`);
                    }
                    existingPdfBytes = fs_1.default.readFileSync(fileLocation); // Read the local file
                }
                console.log("PDF File Loaded Successfully");
                // Load the original PDF document
                const pdfDoc = yield pdf_lib_1.PDFDocument.load(existingPdfBytes);
                console.log("Original PDF Loaded");
                // Create a new PDF document
                const newPdfDoc = yield pdf_lib_1.PDFDocument.create();
                console.log("New PDF Document Created");
                // Add selected pages to the new PDF
                for (const pageIndex of selectedPages) {
                    if (pageIndex < 1 || pageIndex > pdfDoc.getPageCount()) {
                        throw new Error(`Invalid page index: ${pageIndex}`);
                    }
                    const [copiedPage] = yield newPdfDoc.copyPages(pdfDoc, [pageIndex - 1]); // PDF pages are 0-indexed
                    newPdfDoc.addPage(copiedPage);
                }
                // Serialize the new PDF
                const newPdfBytes = yield newPdfDoc.save();
                console.log("New PDF Bytes Generated");
                // Save the new PDF to a temporary location before uploading to Cloudinary
                const tempFilePath = './temp_new_pdf.pdf';
                fs_1.default.writeFileSync(tempFilePath, newPdfBytes);
                // Upload the generated PDF to Cloudinary
                const uploadResult = yield (0, Uploads_1.uploadPdfToCloudinary)(tempFilePath);
                console.log(uploadResult, "uploadResult");
                if (!uploadResult.success) {
                    throw new Error(uploadResult.message); // If upload failed, throw an error
                }
                // Save the Cloudinary URL and other metadata in the database (optional)
                const cloudinaryUrl = uploadResult.url;
                console.log(cloudinaryUrl, "cloudinaryUrl");
                // Cloudinary URL for the uploaded file
                const cloudinaryFilename = `${pdfEntry === null || pdfEntry === void 0 ? void 0 : pdfEntry.name}_${Date.now()}`; // Cloudinary filename
                // Assuming you have a method to save the metadata to MongoDB
                yield this.pdfRepository.uploadPdf(cloudinaryUrl, pdfEntry === null || pdfEntry === void 0 ? void 0 : pdfEntry.userId, cloudinaryFilename);
                console.log("PDF uploaded successfully to Cloudinary");
                return uploadResult; // Return the result with the URL from Cloudinary
            }
            catch (error) {
                console.error("Error in createPdf:", error);
                return null;
            }
        });
    }
}
exports.UserServices = UserServices;
