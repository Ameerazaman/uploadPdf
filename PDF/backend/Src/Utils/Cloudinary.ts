import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();


cloudinary.config({ 
    cloud_name: 'daolqrbp2', 
    api_key: '275178154791847', 
    api_secret: 'VtY5UFLU8R3fJWMlZ7PGyOm-weE' // Click 'View API Keys' above to copy your API secret
});
export default cloudinary;