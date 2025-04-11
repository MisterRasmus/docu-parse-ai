
/**
 * This is a mock service that simulates document AI processing
 * It's used as a fallback when the real API isn't available
 */

interface MockProcessOptions {
  file: File;
}

interface MockAiResponse {
  documentType: string;
  result: any;
}

export async function mockProcessDocument({
  file
}: MockProcessOptions): Promise<MockAiResponse> {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Generate random document type based on filename
  const documentTypes = ["invoice", "order_confirmation", "shipping_label", "receipt"];
  const randomType = documentTypes[Math.floor(Math.random() * documentTypes.length)];
  
  // Generate mock result based on document type
  let mockResult: Record<string, any> = {
    document_type: randomType
  };
  
  if (randomType === "invoice") {
    mockResult = {
      document_type: "invoice",
      invoice_number: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      vendor: {
        name: "Sample Vendor, Inc.",
        address: "123 Business St, Industry City, CA 90210",
        email: "billing@samplevendor.com"
      },
      customer: {
        name: "Customer Company LLC",
        address: "456 Commerce Ave, Enterprise, NY 10001",
        email: "accounts@customercompany.com"
      },
      items: [
        {
          description: "Premium Service Package",
          quantity: 2,
          unit_price: 299.99,
          amount: 599.98
        },
        {
          description: "Consulting Hours",
          quantity: 10,
          unit_price: 150.00,
          amount: 1500.00
        }
      ],
      subtotal: 2099.98,
      tax_rate: 8.5,
      tax_amount: 178.50,
      total: 2278.48,
      payment_terms: "Net 30",
      payment_instructions: "Please make payment via bank transfer to Account #12345678"
    };
  } else if (randomType === "order_confirmation") {
    mockResult = {
      document_type: "order_confirmation",
      order_number: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      customer: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        address: "123 Main St, Anytown, AN 12345"
      },
      items: [
        {
          product_id: "P-1001",
          description: "Premium Widget Pro",
          quantity: 2,
          unit_price: 79.99,
          total: 159.98
        },
        {
          product_id: "P-2002",
          description: "Gadget Deluxe Package",
          quantity: 1,
          unit_price: 129.99,
          total: 129.99
        }
      ],
      subtotal: 289.97,
      tax: 17.40,
      shipping: 12.99,
      total: 320.36,
      payment_method: "Credit Card",
      shipping_method: "Express Delivery"
    };
  } else {
    // Generic document with some basic fields
    mockResult = {
      document_type: randomType,
      document_id: `DOC-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split("T")[0],
      title: file.name.replace(/\.[^/.]+$/, ""),
      metadata: {
        file_size: `${(file.size / 1024).toFixed(2)} KB`,
        file_type: file.type,
        processed_on: new Date().toISOString()
      },
      contents: {
        paragraph_count: Math.floor(5 + Math.random() * 20),
        extracted_text_sample: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      }
    };
  }
  
  return {
    documentType: randomType,
    result: mockResult
  };
}
