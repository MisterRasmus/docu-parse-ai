
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import FileUploader from "@/components/upload/FileUploader";
import PdfPreview from "@/components/upload/PdfPreview";
import ParseResult from "@/components/parsing/ParseResult";
import DocumentHistory from "@/components/parsing/DocumentHistory";
import { processDocumentWithAI } from "@/services/documentAiService";
import { FileText, FileUp, Sparkles, History, Settings, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentRecord {
  id: string;
  fileName: string;
  documentType: string;
  parseDate: string;
  result: unknown;
}

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<Record<string, unknown> | null>(null);
  const [documentHistory, setDocumentHistory] = useState<DocumentRecord[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  useEffect(() => {
    // Load document history from localStorage
    const savedHistory = localStorage.getItem("documentHistory");
    if (savedHistory) {
      try {
        setDocumentHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse document history:", e);
      }
    }
    
  }, []);

  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    setParseResult(null); // Reset any previous results
    setErrorMessage(null); // Clear any previous errors
  };

  const handleProcessDocument = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please upload a document first.",
        variant: "destructive",
      });
      return;
    }
    
    // No longer require or check for googleApiKey

    setIsProcessing(true);
    setParseResult(null);
    setErrorMessage(null);

    try {
      // Process the document with Google Document AI
      const result = await processDocumentWithAI({
        file: selectedFile
      });
      
      if (
        typeof result.result === "object" &&
        result.result !== null &&
        !Array.isArray(result.result)
      ) {
        setParseResult(result.result as Record<string, unknown>);
      } else {
        setParseResult(null);
        setErrorMessage("Invalid document result format.");
      }
      
      // Add to document history
      const newDocument: DocumentRecord = {
        id: `doc-${Date.now()}`,
        fileName: selectedFile.name,
        documentType: result.documentType,
        parseDate: new Date().toISOString(),
        result: result.result
      };
      
      // Limit history to 10 most recent documents
      const updatedHistory = [newDocument, ...documentHistory].slice(0, 10);
      setDocumentHistory(updatedHistory);

      // Save to localStorage
      localStorage.setItem("documentHistory", JSON.stringify(updatedHistory));

      toast({
        title: "Document processed successfully",
        description: "Your document has been analyzed and parsed.",
      });
    } catch (error) {
      console.error("Error processing document:", error);
      
      const errorMsg = error instanceof Error 
        ? error.message 
        : "Failed to process document with AI.";
        
      setErrorMessage(errorMsg);
      
      toast({
        title: "Processing failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleViewDocument = (documentRecord: DocumentRecord) => {
    if (
      typeof documentRecord.result === "object" &&
      documentRecord.result !== null &&
      !Array.isArray(documentRecord.result)
    ) {
      setParseResult(documentRecord.result as Record<string, unknown>);
    } else {
      setParseResult(null);
      setErrorMessage("Invalid document result format.");
    }
    setActiveTab("upload");
    
    // Scroll to the results section
    setTimeout(() => {
      const resultsElement = document.getElementById("results-section");
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  
  const handleDeleteDocument = (documentId: string) => {
    const updatedHistory = documentHistory.filter(doc => doc.id !== documentId);
    setDocumentHistory(updatedHistory);
    localStorage.setItem("documentHistory", JSON.stringify(updatedHistory));
    
    toast({
      title: "Document removed",
      description: "The document has been removed from your history.",
    });
  };
  
  // Removed handleSaveApiKey and related logic (no longer needed)

  return (
    <Layout>
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Document Parser</h1>
          <p className="text-muted-foreground mb-8">
            Upload a PDF document to extract its data into structured format
          </p>

          <Tabs defaultValue="upload" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                Upload & Parse
              </TabsTrigger>
              <TabsTrigger value="history" className="flex items-center gap-2">
                <History className="h-4 w-4" />
                Document History
              </TabsTrigger>
              {/* Settings tab removed */}
            </TabsList>
            
            <TabsContent value="upload">
              {errorMessage && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}
            
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileUp className="h-5 w-5" />
                      Upload Document
                    </CardTitle>
                    <CardDescription>
                      Drag and drop your PDF or click to browse files
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <FileUploader 
                      onFileUpload={handleFileUpload}
                      maxFileSizeMB={10}
                      allowedFileTypes={["application/pdf"]}
                      multiple={false}
                    />
                    
                    {selectedFile && (
                      <div className="mt-6">
                        <Button 
                          onClick={handleProcessDocument}
                          disabled={isProcessing}
                          className="w-full flex items-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          {isProcessing ? "Processing..." : "Process Document"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Preview Section */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Document Preview
                    </CardTitle>
                    <CardDescription>
                      Preview of the selected document
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PdfPreview file={selectedFile} height={400} />
                  </CardContent>
                </Card>
              </div>

              {/* Results Section */}
              <div id="results-section">
                <ParseResult result={parseResult} fileName={selectedFile?.name} isLoading={isProcessing} />
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <DocumentHistory 
                documents={documentHistory}
                onViewDocument={handleViewDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </TabsContent>
            
            {/* Settings tab content removed */}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
