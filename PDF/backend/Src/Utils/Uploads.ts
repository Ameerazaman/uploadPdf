import cloudinary from './Cloudinary'; // Correct import
import fs from 'fs';

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
export const uploadPdfToCloudinary = async (filePath: string) => {
    try {
        // Validate the file exists and has a valid path
        if (!filePath) {
            throw new Error('No valid file provided for upload');
        }
        // Function to handle the upload to Cloudinary
        const uploadToCloudinary = async (filePath: string) => {
            try {
                // Check if file exists at the given path
                if (!fs.existsSync(filePath)) {
                    throw new Error('File does not exist: ' + filePath);
                }

                // Upload the file to Cloudinary
                const result = await cloudinary.uploader.upload(filePath, {
                    folder: 'uploads',  // Specify the folder for Cloudinary
                    resource_type: 'raw',  // Ensure PDF is treated as raw
                });

                return result;  // Return the result from Cloudinary
            } catch (error) {
                throw new Error('Upload failed: ');  // Include the actual error message
            }
        };

        // Upload the file
        const result = await uploadToCloudinary(filePath);
     
        // Remove the file from local storage after successful upload
        fs.unlinkSync(filePath);

        return {
            success: true,
            message: 'PDF uploaded successfully',
            url: result.secure_url,  // Return the Cloudinary URL
        };
    } catch (error) {
        // console.error('Error uploading PDF:', error.message);  // Log the error for debugging
        return {
            success: false,
            message: 'Failed to upload PDF',
            // error: error.message,  // Return the error message
        };
    }
};