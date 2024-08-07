// src/types/cloudinaryConfig.d.ts
declare module '../config/cloudinaryConfig' {
    import { UploadApiResponse } from 'cloudinary';
    
    const cloudinary: {
        uploader: {
            upload: (file: string) => Promise<UploadApiResponse>;
        };
    };

    export default cloudinary;
}
