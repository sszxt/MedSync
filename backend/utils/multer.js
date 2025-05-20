// backend/utils/multer.js
import multer from 'multer';
import ErrorResponse from './errorResponse.js';

// Set up storage for uploaded files
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Accept only certain file types
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(
      new ErrorResponse(
        'Invalid file type. Only PDF, JPEG, JPG, and PNG files are allowed',
        400
      ),
      false
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export default upload;