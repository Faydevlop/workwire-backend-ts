"use strict";
// import multer from 'multer';
// import path from 'path';
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const uploadPath = path.join(__dirname, '../../../uploads'); // Ensure it's outside the src directory
//         cb(null, uploadPath);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     },
// });
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
//     fileFilter: (req, file, cb) => {
//         const fileTypes = /jpeg|jpg|png/;
//         const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());
//         const mimeType = fileTypes.test(file.mimetype);
//         if (mimeType && extName) {
//             return cb(null, true);
//         } else {
//             cb(new Error('Only images are allowed'));
//         }
//     },
// });
// export default upload;
