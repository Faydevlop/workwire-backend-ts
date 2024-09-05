import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary';

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: 'resumes', // Folder name in Cloudinary
      allowed_formats: ['pdf', 'doc', 'docx','jpg', 'png', 'jpeg'], // Format can be 'pdf', 'doc', or 'docx'
      resource_type: 'auto', // Automatically determine the type (image, raw, etc.)
    };
  },
});

const upload = multer({ storage });

export default upload;
