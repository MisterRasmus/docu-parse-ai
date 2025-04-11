
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PdfPreviewProps {
  file: File | null;
  width?: number | string;
  height?: number | string;
}

const PdfPreview = ({ file, width = "100%", height = 500 }: PdfPreviewProps) => {
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      setError(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files can be previewed");
      setUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    setError(null);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!url) {
    return (
      <Card className="flex items-center justify-center h-[300px] bg-muted/30">
        <p className="text-muted-foreground">No PDF selected</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <iframe
        src={`${url}#toolbar=0&navpanes=0`}
        width={width}
        height={height}
        title="PDF Preview"
        className="border-0 w-full"
      />
    </Card>
  );
};

export default PdfPreview;
