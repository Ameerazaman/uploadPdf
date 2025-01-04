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
exports.uploadPdfToCloudinary = void 0;
const Cloudinary_1 = __importDefault(require("./Cloudinary")); // Correct import
const fs_1 = __importDefault(require("fs"));
// export const uploadPdfToCloudinary = async (file: Express.Multer.File | undefined) => {
//     try {
//         // Validate the file exists and has a valid path
//         if (!file || !file.path) {
//             throw new Error('No valid file provided for upload');
//         }
//         const filePath = file.path;
//         // Function to handle the upload to Cloudinary
//         const uploadToCloudinary = async (filePath: string) => {
//             try {
//                 // Check if file exists at the given path
//                 if (!fs.existsSync(filePath)) {
//                     throw new Error('File does not exist: ' + filePath);
//                 }
//                 // Upload the file to Cloudinary
//                 const result = await cloudinary.uploader.upload(filePath, {
//                     folder: 'uploads',  // Specify the folder for Cloudinary
//                     resource_type: 'raw',  // Ensure PDF is treated as raw
//                 });
//                 return result;  // Return the result from Cloudinary
//             } catch (error) {
//                 throw new Error('Upload failed: ');  // Include the actual error message
//             }
//         };
//         // Upload the file
//         const result = await uploadToCloudinary(filePath);
//         // Remove the file from local storage after successful upload
//         fs.unlinkSync(filePath);
//         return {
//             success: true,
//             message: 'PDF uploaded successfully',
//             url: result.secure_url,  // Return the Cloudinary URL
//         };
//     } catch (error) {
//         // console.error('Error uploading PDF:', error.message);  // Log the error for debugging
//         return {
//             success: false,
//             message: 'Failed to upload PDF',
//             // error: error.message,  // Return the error message
//         };
//     }
// };
const uploadPdfToCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate the file exists and has a valid path
        if (!filePath) {
            throw new Error('No valid file provided for upload');
        }
        // Function to handle the upload to Cloudinary
        const uploadToCloudinary = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Check if file exists at the given path
                if (!fs_1.default.existsSync(filePath)) {
                    throw new Error('File does not exist: ' + filePath);
                }
                // Upload the file to Cloudinary
                const result = yield Cloudinary_1.default.uploader.upload(filePath, {
                    folder: 'uploads', // Specify the folder for Cloudinary
                    resource_type: 'raw', // Ensure PDF is treated as raw
                });
                return result; // Return the result from Cloudinary
            }
            catch (error) {
                throw new Error('Upload failed: '); // Include the actual error message
            }
        });
        // Upload the file
        const result = yield uploadToCloudinary(filePath);
        // Remove the file from local storage after successful upload
        fs_1.default.unlinkSync(filePath);
        return {
            success: true,
            message: 'PDF uploaded successfully',
            url: result.secure_url, // Return the Cloudinary URL
        };
    }
    catch (error) {
        // console.error('Error uploading PDF:', error.message);  // Log the error for debugging
        return {
            success: false,
            message: 'Failed to upload PDF',
            // error: error.message,  // Return the error message
        };
    }
});
exports.uploadPdfToCloudinary = uploadPdfToCloudinary;
