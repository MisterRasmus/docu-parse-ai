
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download } from "lucide-react";

interface ParseResultProps {
  result: Record<string, unknown> | null;
  fileName?: string; // Add filename prop
  isLoading?: boolean;
}

const ParseResult = ({ result, fileName, isLoading = false }: ParseResultProps) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("json");
  const handleCopy = () => {
    if (!result) return;
    
    const textToCopy = JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(textToCopy);
    
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result) return;

    const format = activeTab === "json" ? "json" : "csv";
    const baseFileName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "document_data"; // Get base name or default
    let content = "";
    const downloadFilename = `${baseFileName}.${format}`; // Use base name for download

    if (format === "json") {
      content = JSON.stringify(result, null, 2);
    } else {
      // Generate CSV from lineItems if available
      if (Array.isArray(result.lineItems) && result.lineItems.length > 0 && typeof result.lineItems[0] === 'object' && result.lineItems[0] !== null) {
        const headers = Object.keys(result.lineItems[0]).join(",");
        const rows = result.lineItems.map(item =>
          Object.keys(result.lineItems[0]).map(key => {
            const value = item[key] ?? "";
            // Escape double quotes and wrap in double quotes
            return `"${value.toString().replace(/"/g, '""')}"`;
          }).join(",")
        ).join("\n");
        content = headers + "\n" + rows;
      } else {
        // Fallback if no lineItems or invalid format - maybe provide empty content or basic key-value?
        content = ""; // Defaulting to empty CSV if no lineItems
      }
    }

    const blob = new Blob([content], { type: `text/${format}` });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFilename; // Use the correct filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <div className="h-4 w-4 bg-accent rounded-full mr-2 animate-pulse-slow"></div>
            Processing document...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded animate-pulse"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-4/5"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Parsed Document Data</CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs flex gap-1"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-xs flex gap-1"
            >
              <Download className="h-3 w-3" />
              Download
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="json" onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="json">JSON</TabsTrigger>
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="csv">CSV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="json" className="mt-0">
            <pre className="bg-muted/50 p-4 rounded-md overflow-auto max-h-[400px] text-xs md:text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </TabsContent>
          
          <TabsContent value="table" className="mt-0">
            {/* Table view for lineItems */}
            {Array.isArray(result.lineItems) && result.lineItems.length > 0 ? (
              <div className="rounded-md border overflow-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr className="border-b">
                      {Object.keys(result.lineItems[0]).map((header) => (
                        <th key={header} className="text-left p-2 font-medium">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.lineItems.map((item, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        {Object.keys(result.lineItems[0]).map((header) => (
                          <td key={header} className="p-2">
                            {item[header] ?? ""}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-muted-foreground">No line items found.</div>
            )}
          </TabsContent>
          
          <TabsContent value="csv" className="mt-0">
            {/* CSV view for lineItems */}
            {Array.isArray(result.lineItems) && result.lineItems.length > 0 ? (
              <pre className="bg-muted/50 p-4 rounded-md overflow-auto max-h-[400px] text-xs md:text-sm">
                {Object.keys(result.lineItems[0]).join(",")}
                {"\n"}
                {result.lineItems.map(item =>
                  Object.keys(result.lineItems[0]).map(key => `"${(item[key] ?? "").toString().replace(/"/g, '""')}"`).join(",")
                ).join("\n")}
              </pre>
            ) : (
              <div className="text-muted-foreground">No line items found.</div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ParseResult;
