// Google Documents AI integration logic (Node.js backend)

const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');
const fs = require('fs');

// Loads config from .env
require('dotenv').config();

const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const GOOGLE_PROCESSOR_ID = process.env.GOOGLE_PROCESSOR_ID;
const GOOGLE_LOCATION = process.env.GOOGLE_LOCATION || 'eu';
const GOOGLE_CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || path.join(__dirname, '../google-credentials.json');

// Helper: Get Google API access token using service account
async function getGoogleAccessToken() {
  const auth = new GoogleAuth({
    keyFile: GOOGLE_CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}

// Helper: Convert PDF buffer to base64 (no data URL prefix)
function bufferToBase64(buffer) {
  return buffer.toString('base64');
}

// Main: Call Google Document AI API with PDF buffer
async function parsePdfWithGoogleDocAI(pdfBuffer) {
  if (!GOOGLE_PROJECT_ID || !GOOGLE_PROCESSOR_ID) {
    throw new Error('Google project/processor ID not set in .env');
  }

  const accessToken = await getGoogleAccessToken();

  const apiUrl = `https://documentai.googleapis.com/v1/projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/processors/${GOOGLE_PROCESSOR_ID}:process`;

  const requestBody = {
    name: `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/processors/${GOOGLE_PROCESSOR_ID}`,
    rawDocument: {
      content: bufferToBase64(pdfBuffer),
      mimeType: 'application/pdf'
    }
  };

  try {
    const response = await axios.post(apiUrl, requestBody, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (err) {
    // # Reason: Surface Google API errors for debugging
    if (err.response && err.response.data) {
      throw new Error(`Google Document AI error: ${JSON.stringify(err.response.data)}`);
    }
    throw err;
  }
}

module.exports = {
  parsePdfWithGoogleDocAI
};