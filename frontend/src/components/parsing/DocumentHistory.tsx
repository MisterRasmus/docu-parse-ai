
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2 } from "lucide-react";

interface DocumentRecord {
  id: string;
  fileName: string;
  documentType: string;
  parseDate: string;
  result: any;
}

interface DocumentHistoryProps {
  documents: DocumentRecord[];
  onViewDocument: (document: DocumentRecord) => void;
  onDeleteDocument: (documentId: string) => void;
}

const DocumentHistory = ({
  documents,
  onViewDocument,
  onDeleteDocument
}: DocumentHistoryProps) => {
  const [sortBy, setSortBy] = useState<"date" | "name">("date");

  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(b.parseDate).getTime() - new Date(a.parseDate).getTime();
    } else {
      return a.fileName.localeCompare(b.fileName);
    }
  });

  const handleDownload = (documentRecord: DocumentRecord) => {
    // Create a JSON blob and trigger download
    const jsonString = JSON.stringify(documentRecord.result, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentRecord.fileName.replace(/\.[^/.]+$/, "")}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Document History</CardTitle>
          <div className="flex gap-2">
            <Button
              variant={sortBy === "date" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSortBy("date")}
            >
              Sort by Date
            </Button>
            <Button
              variant={sortBy === "name" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setSortBy("name")}
            >
              Sort by Name
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {documents.length > 0 ? (
          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Document</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Date</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedDocuments.map((doc) => (
                  <tr key={doc.id} className="border-t">
                    <td className="p-3 flex items-center">
                      <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="truncate max-w-[200px]">{doc.fileName}</span>
                    </td>
                    <td className="p-3 capitalize">{doc.documentType}</td>
                    <td className="p-3">
                      {new Date(doc.parseDate).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onViewDocument(doc)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownload(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDeleteDocument(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
            <p className="text-muted-foreground">No documents in history</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentHistory;
