
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import FileUploader from "@/components/upload/FileUploader";
import PdfPreview from "@/components/upload/PdfPreview";
import ParseResult from "@/components/parsing/ParseResult";
import DocumentHistory from "@/components/parsing/DocumentHistory";
import ApiKeyForm from "@/components/settings/ApiKeyForm";
import { processDocumentWithAI } from "@/services/documentAiService";
import { FileText, FileUp, Sparkles, History, Settings, AlertTriangle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DocumentRecord {
  id: string;
  fileName: string;
  documentType: string;
  parseDate: string;
  result: any;
}

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [parseResult, setParseResult] = useState<Record<string, any> | null>(null);
  const [documentHistory, setDocumentHistory] = useState<DocumentRecord[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const [googleApiKey, setGoogleApiKey] = useState<string>("");
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
    
    // Load API key from localStorage
    const savedApiKey = localStorage.getItem("googleApiKey");
    if (savedApiKey) {
      setGoogleApiKey(savedApiKey);
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
    
    if (!googleApiKey) {
      toast({
        title: "OAuth Token Required",
        description: "Please provide your Google Document AI OAuth token in the Settings tab.",
        variant: "destructive",
      });
      setActiveTab("settings");
      return;
    }

    setIsProcessing(true);
    setParseResult(null);
    setErrorMessage(null);

    try {
      // Process the document with Google Document AI
      const result = await processDocumentWithAI({
        file: selectedFile,
        apiKey: googleApiKey
      });
      
      setParseResult(result.result);
      
      // Add to document history
      const newDocument: DocumentRecord = {
        id: `doc-${Date.now()}`,
        fileName: selectedFile.name,
        documentType: result.documentType,
        parseDate: new Date().toISOString(),
        result: result.result
      };
      
      const updatedHistory = [newDocument, ...documentHistory];
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
    setParseResult(documentRecord.result);
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
  
  const handleSaveApiKey = (apiKey: string) => {
    setGoogleApiKey(apiKey);
    localStorage.setItem("googleApiKey", apiKey);
    setErrorMessage(null); // Clear any previous errors when updating the key
  };

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
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              {errorMessage && (
                <Alert variant="destructive" className="mb-6">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {errorMessage}
                    {errorMessage.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED") && (
                      <div className="mt-2">
                        You need to use a valid OAuth 2.0 token, not an API key or Client ID. Please check the Settings tab for instructions.
                      </div>
                    )}
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
                <ParseResult result={parseResult} isLoading={isProcessing} />
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <DocumentHistory 
                documents={documentHistory}
                onViewDocument={handleViewDocument}
                onDeleteDocument={handleDeleteDocument}
              />
            </TabsContent>
            
            <TabsContent value="settings">
              <div className="max-w-lg mx-auto">
                <ApiKeyForm 
                  onSaveApiKey={handleSaveApiKey}
                  initialApiKey={googleApiKey}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Upload;
