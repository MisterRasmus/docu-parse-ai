// Express router for /api/parse endpoint

const express = require('express');
const multer = require('multer');
const path = require('path');
const { parsePdfWithGoogleDocAI } = require('../services/googleDocAI');
const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    // Accept only PDF files
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  }
});

// TODO: Implement file upload and call to Google Documents AI
// Reason: This is a placeholder for the PDF parsing endpoint.

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    // Call the real Google Documents AI logic
    // # Reason: This now sends the PDF to Google Document AI and returns the parsed result.
    const result = await parsePdfWithGoogleDocAI(req.file.buffer);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Internal server error.' });
  }
});

module.exports = router;