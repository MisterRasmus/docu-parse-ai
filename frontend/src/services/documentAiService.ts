
// This service handles communication with Google Cloud Document AI
import { mockProcessDocument } from "./mockDocumentService";

interface ProcessDocumentOptions {
  file: File;
  documentType?: string;
}

interface DocumentAiResponse {
  documentType: string;
  result: unknown;
}

export async function processDocumentWithAI({
  file,
  documentType = "GENERIC_DOCUMENT"
}: ProcessDocumentOptions): Promise<DocumentAiResponse> {
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
function determineDocumentType(aiResponse: unknown): string {
  // # Reason: Type guard for unknown input
  if (
    typeof aiResponse === "object" &&
    aiResponse !== null &&
    "document" in aiResponse &&
    typeof (aiResponse as { document?: unknown }).document === "object" &&
    (aiResponse as { document?: unknown }).document !== null &&
    "text" in (aiResponse as { document?: Record<string, unknown> }).document
  ) {
    const text = String(
      ((aiResponse as { document?: Record<string, unknown> }).document as Record<string, unknown>).text ?? ""
    ).toLowerCase();

    if (text.includes("invoice") || text.includes("bill to")) {
      return "invoice";
    } else if (text.includes("order") && (text.includes("confirmation") || text.includes("receipt"))) {
      return "order_confirmation";
    } else if (text.includes("shipping") && text.includes("label")) {
      return "shipping_label";
    }
  }
  return "generic_document";
}

// Helper to extract structured data based on document type
function extractStructuredData(aiResponse: unknown, documentType: string): Record<string, unknown> {
  // # Reason: Type guard for unknown input
  let entities: unknown[] = [];
  let formFields: unknown[] = [];
  let rawText: unknown = undefined;
  let confidenceScore: unknown = 1.0;

  if (
    typeof aiResponse === "object" &&
    aiResponse !== null &&
    "document" in aiResponse &&
    typeof (aiResponse as { document?: unknown }).document === "object" &&
    (aiResponse as { document?: unknown }).document !== null
  ) {
    const doc = (aiResponse as { document: Record<string, unknown> }).document;
    if (Array.isArray(doc.entities)) entities = doc.entities;
    if (Array.isArray(doc.formFields)) formFields = doc.formFields;
    if ("text" in doc) rawText = doc.text;
    const textChanges = (doc as Record<string, unknown>).textChanges;
    if (
      Array.isArray(textChanges) &&
      textChanges.length > 0 &&
      typeof textChanges[0] === "object" &&
      textChanges[0] !== null &&
      "confidence" in textChanges[0]
    ) {
      confidenceScore = (textChanges[0] as { confidence?: unknown }).confidence ?? 1.0;
    }
  }

  const structuredData: Record<string, unknown> = {
    document_type: documentType,
  };

  // Map entities to structured data
  entities.forEach((entity) => {
    if (
      typeof entity === "object" &&
      entity !== null &&
      "type" in entity &&
      typeof (entity as { type?: unknown }).type === "string" &&
      "mentionText" in entity
    ) {
      const key = ((entity as { type: string }).type).toLowerCase().replace(/\s+/g, '_');
      const value = (entity as { mentionText: unknown }).mentionText;
      structuredData[key] = value;
    }
  });

  // Extract form fields if available
  formFields.forEach((field) => {
    if (
      typeof field === "object" &&
      field !== null &&
      "fieldName" in field &&
      typeof (field as { fieldName?: unknown }).fieldName === "string" &&
      "fieldValue" in field &&
      typeof (field as { fieldValue?: unknown }).fieldValue === "object" &&
      (field as { fieldValue?: unknown }).fieldValue !== null &&
      "textAnchor" in (field as { fieldValue: Record<string, unknown> }).fieldValue
    ) {
      const key = ((field as { fieldName: string }).fieldName).toLowerCase().replace(/\s+/g, '_');
      const value =
        ((field as { fieldValue: { textAnchor?: { content?: unknown }; text?: unknown } }).fieldValue.textAnchor
          ?.content) ||
        (field as { fieldValue: { text?: unknown } }).fieldValue.text;
      structuredData[key] = value;
    }
  });

  // Add page text for completeness
  structuredData.rawText = rawText;

  // Add additional metadata
  structuredData.processed_at = new Date().toISOString();
  structuredData.confidence_score = confidenceScore;

  return structuredData;
}
