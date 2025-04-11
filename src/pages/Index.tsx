
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, FileText, FileUp, FileJson, Zap, LineChart, Globe, CheckCircle } from "lucide-react";

const features = [
  {
    icon: FileUp,
    title: "Easy File Upload",
    description: "Drag & drop or browse to upload your PDF documents in seconds."
  },
  {
    icon: Zap,
    title: "AI-Powered Parsing",
    description: "Advanced AI algorithms extract and structure data from your documents."
  },
  {
    icon: FileJson,
    title: "Structured Output",
    description: "Get your document data as clean JSON or CSV for immediate use."
  },
  {
    icon: Globe,
    title: "REST API Access",
    description: "Integrate document parsing into your applications with our simple API."
  }
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-6 py-16 md:py-24">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Transform Document Data with 
                <span className="gradient-text block mt-2">AI-Powered Parsing</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 md:max-w-xl">
                Extract structured data from your PDFs, invoices, receipts, and more. 
                Turn messy document data into clean, actionable information.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Button asChild size="lg" className="px-8">
                  <Link to="/upload">Try it now</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/api-docs">View API Docs</Link>
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-1 rounded-lg">
                <div className="bg-card rounded-md shadow-xl">
                  <div className="bg-muted/80 p-3 rounded-t-md flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-xs ml-2 text-muted-foreground">document-parser.json</div>
                  </div>
                  <pre className="p-4 text-xs overflow-auto max-w-full">
                    {`{
  "document_type": "invoice",
  "metadata": {
    "invoice_number": "INV-2023-05628",
    "date": "2025-02-15",
    "due_date": "2025-03-15",
    "total_amount": 1250.00,
    "currency": "USD"
  },
  "vendor": {
    "name": "Acme Corporation",
    "email": "billing@acme.com",
    "address": "123 Business Ave, Suite 500"
  },
  "line_items": [
    {
      "description": "Professional Services",
      "quantity": 5,
      "unit_price": 200.00,
      "amount": 1000.00
    },
    {
      "description": "Support Package",
      "quantity": 1,
      "unit_price": 250.00,
      "amount": 250.00
    }
  ],
  "payment_terms": "Net 30",
  "payment_method": "Credit Card"
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Powerful Document Processing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered document parsing can handle invoices, receipts, order confirmations, 
              and more - extracting the information you need in seconds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-card shadow-sm rounded-lg p-6 border border-border hover:border-accent/50 hover:shadow-md transition-all">
                <feature.icon className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to transform your document data
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <FileUp className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Your Document</h3>
            <p className="text-muted-foreground text-sm">
              Upload your PDFs through our user interface or API. We support various document types.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-medium mb-2">AI Processing</h3>
            <p className="text-muted-foreground text-sm">
              Our AI analyzes your document, recognizes its type, and extracts the relevant data.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
              <FileJson className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-lg font-medium mb-2">Get Structured Data</h3>
            <p className="text-muted-foreground text-sm">
              Receive clean, structured JSON or CSV data ready to use in your applications.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent">
        <div className="container mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-white">
              Ready to transform your document workflow?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Join thousands of businesses that use DocuParse.AI to automate data extraction and processing.
            </p>
            <Button asChild size="lg" variant="secondary" className="px-8">
              <Link to="/signup">Get Started for Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
