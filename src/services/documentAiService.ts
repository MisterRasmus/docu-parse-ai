
// This service handles communication with Google Cloud Document AI
import { mockProcessDocument } from "./mockDocumentService";

interface ProcessDocumentOptions {
  file: File;
  documentType?: string;
  apiKey: string;
}

interface DocumentAiResponse {
  documentType: string;
  result: any;
}

export async function processDocumentWithAI({
  file,
  documentType = "GENERIC_DOCUMENT",
  apiKey
}: ProcessDocumentOptions): Promise<DocumentAiResponse> {
  if (!apiKey) {
    throw new Error("Google Document AI OAuth token is required");
  }
  
  try {
    // Convert the file to base64
    const base64String = await fileToBase64(file);
    
    // Google Cloud project and processor settings
    // In a production app, these should be securely stored in environment variables
    const projectId = "pdf-processor-456411";
    const processorId = "475c2bee366cfad3"; 
    const location = "eu";
    
    // Create properly formatted request body for Google Document AI
    const requestBody = {
      name: `projects/${projectId}/locations/${location}/processors/${processorId}`,
      rawDocument: {
        content: base64String.split(",")[1], // Remove data URL prefix
        mimeType: file.type
      }
    };
    
    console.log("Making request to Google Document AI API");
    const response = await fetch(
      `https://documentai.googleapis.com/v1/projects/${projectId}/locations/${location}/processors/${processorId}:process`, 
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Document AI API error:", errorData);
      
      // Check for specific error types to give more helpful messages
      if (errorData.error?.status === "INVALID_ARGUMENT") {
        throw new Error("Invalid request format: Check that your document format is supported and your OAuth token has the correct permissions.");
      } else if (errorData.error?.details?.some(d => d.reason === "ACCESS_TOKEN_TYPE_UNSUPPORTED")) {
        throw new Error("Authentication failed: You need to use an OAuth 2.0 access token, not a client ID or API key. Use the Google OAuth Playground to generate a token with the correct scopes.");
      } else if (errorData.error?.code === 403) {
        throw new Error("Authorization failed: Your token doesn't have permission to access Document AI. Make sure it has the 'https://www.googleapis.com/auth/cloud-platform' scope.");
      } else if (errorData.error?.code === 404) {
        throw new Error(`Resource not found: Check that project ID (${projectId}), location (${location}), and processor ID (${processorId}) are correct.`);
      } else if (errorData.error?.code === 401) {
        throw new Error("Unauthorized: Your OAuth token has expired or is invalid. Generate a new access token.");
      } else {
        throw new Error(`API error: ${errorData.error?.message || errorData.error?.status || 'Unknown error'}`);
      }
    }
    
    const data = await response.json();
    console.log("Document AI API response received");
    
    // Process and normalize the response
    const detectedDocType = determineDocumentType(data);
    const structuredData = extractStructuredData(data, detectedDocType);
    
    return {
      documentType: detectedDocType,
      result: structuredData
    };
  } catch (error) {
    console.error("Error processing document with AI:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

// Helper to convert File to base64
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Helper to determine document type from AI response
function determineDocumentType(aiResponse: any): string {
  // This would be more sophisticated in a production environment
  const text = aiResponse.document?.text?.toLowerCase() || "";
  
  if (text.includes("invoice") || text.includes("bill to")) {
    return "invoice";
  } else if (text.includes("order") && (text.includes("confirmation") || text.includes("receipt"))) {
    return "order_confirmation";
  } else if (text.includes("shipping") && text.includes("label")) {
    return "shipping_label";
  } else {
    return "generic_document";
  }
}

// Helper to extract structured data based on document type
function extractStructuredData(aiResponse: any, documentType: string): any {
  // Extract entities if available
  const entities = aiResponse.document?.entities || [];
  const structuredData: Record<string, any> = {
    document_type: documentType,
  };
  
  // Map entities to structured data
  entities.forEach((entity: any) => {
    if (entity.type && entity.mentionText) {
      const key = entity.type.toLowerCase().replace(/\s+/g, '_');
      const value = entity.mentionText;
      structuredData[key] = value;
    }
  });
  
  // Extract form fields if available
  const formFields = aiResponse.document?.formFields || [];
  formFields.forEach((field: any) => {
    if (field.fieldName && field.fieldValue && field.fieldValue.textAnchor) {
      const key = field.fieldName.toLowerCase().replace(/\s+/g, '_');
      const value = field.fieldValue.textAnchor.content || field.fieldValue.text;
      structuredData[key] = value;
    }
  });
  
  // Add page text for completeness
  structuredData.rawText = aiResponse.document?.text;
  
  // Add additional metadata
  structuredData.processed_at = new Date().toISOString();
  structuredData.confidence_score = aiResponse.document?.textChanges?.[0]?.confidence || 1.0;
  
  return structuredData;
}
