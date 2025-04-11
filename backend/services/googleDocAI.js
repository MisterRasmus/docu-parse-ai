// Google Document AI integration logic (Node.js backend)

const path = require('path');
require('dotenv').config();

const { DocumentProcessorServiceClient } = require('@google-cloud/documentai');

const GOOGLE_PROJECT_ID = process.env.GOOGLE_PROJECT_ID;
const GOOGLE_PROCESSOR_ID = process.env.GOOGLE_PROCESSOR_ID;
const GOOGLE_LOCATION = process.env.GOOGLE_LOCATION || 'eu';
const GOOGLE_CREDENTIALS_PATH = process.env.GOOGLE_CREDENTIALS_PATH || path.join(__dirname, '../google-credentials.json');

// Main: Call Google Document AI API with PDF buffer using official client and explicit EU endpoint
async function parsePdfWithGoogleDocAI(pdfBuffer) {
  if (!GOOGLE_PROJECT_ID || !GOOGLE_PROCESSOR_ID) {
    throw new Error('Google project/processor ID not set in .env');
  }

  // Initialize Document AI client with explicit EU endpoint
  const client = new DocumentProcessorServiceClient({
    keyFilename: GOOGLE_CREDENTIALS_PATH,
    apiEndpoint: 'eu-documentai.googleapis.com'
  });

  const name = `projects/${GOOGLE_PROJECT_ID}/locations/${GOOGLE_LOCATION}/processors/${GOOGLE_PROCESSOR_ID}`;

  const request = {
    name,
    rawDocument: {
      content: pdfBuffer,
      mimeType: 'application/pdf'
    }
  };

  try {
    const [result] = await client.processDocument(request);

    // Improved: Merge split line items (e.g., description-only followed by product_code/quantity)
    const rawLineItems = [];
    if (
      result &&
      result.document &&
      Array.isArray(result.document.entities)
    ) {
      for (const entity of result.document.entities) {
        if (entity.type === "line_item" && Array.isArray(entity.properties)) {
          const item = {};
          for (const prop of entity.properties) {
            if (prop.type && prop.mentionText) {
              const key = prop.type.split("/").pop();
              item[key] = prop.mentionText;
            }
          }
          rawLineItems.push(item);
        }
      }
    }

    // Merge logic: If a line item has only description, and the next has product_code/quantity but no description, merge them
    const lineItems = [];
    for (let i = 0; i < rawLineItems.length; i++) {
      const curr = rawLineItems[i];
      const prev = lineItems[lineItems.length - 1];
      const hasOnlyDescription = Object.keys(curr).length === 1 && curr.description;
      const hasNoDescription = !curr.description && (curr.product_code || curr.quantity || curr.unit_price);

      if (
        hasOnlyDescription &&
        prev &&
        (!prev.description || prev.product_code || prev.quantity)
      ) {
        // Merge description into previous item if previous is missing description
        prev.description = curr.description;
      } else if (
        hasNoDescription &&
        prev &&
        !prev.product_code &&
        prev.description &&
        !prev.quantity
      ) {
        // Merge product_code/quantity into previous description-only item
        Object.assign(prev, curr);
      } else {
        lineItems.push(curr);
      }
    }

    // Return only the structured line items and the original document metadata
    return {
      lineItems,
      documentMetadata: {
        pageCount: result.document?.pages?.length || 0,
        entities: result.document?.entities?.length || 0
      }
    };
  } catch (err) {
    // # Reason: Surface Google API errors for debugging
    if (err.details) {
      throw new Error(`Google Document AI error: ${JSON.stringify(err.details)}`);
    }
    throw err;
  }
}

module.exports = {
  parsePdfWithGoogleDocAI
};