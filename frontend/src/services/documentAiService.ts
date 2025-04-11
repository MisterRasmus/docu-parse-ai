
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
  documentType = "GENERIC_DOCUMENT"
}: Omit<ProcessDocumentOptions, "apiKey">): Promise<DocumentAiResponse> {
  // # Reason: Now POSTs the PDF to the backend /api/parse endpoint instead of calling Google API directly.
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/parse", {
      method: "POST",
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to process document.");
    }

    // The backend currently returns a mock response with file info.
    // When real Google Documents AI integration is added, this will return structured data.
    const data = await response.json();

    return {
      documentType: documentType,
      result: data
    };
  } catch (error) {
    console.error("Error processing document with AI:", error);
    throw error;
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
