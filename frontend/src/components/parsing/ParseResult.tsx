
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Check, Copy, Download } from "lucide-react";

interface ParseResultProps {
  result: Record<string, any> | null;
  isLoading?: boolean;
}

const ParseResult = ({ result, isLoading = false }: ParseResultProps) => {
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
    let content = "";
    let filename = `document_data.${format}`;
    
    if (format === "json") {
      content = JSON.stringify(result, null, 2);
    } else {
      // Very simple CSV conversion for demo purposes
      // In a real app, this would need to be more sophisticated
      const headers = Object.keys(result).join(",");
      const values = Object.values(result).join(",");
      content = headers + "\n" + values;
    }
    
    const blob = new Blob([content], { type: `text/${format}` });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
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
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr className="border-b">
                    <th className="text-left p-2 font-medium">Field</th>
                    <th className="text-left p-2 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(result).map(([key, value]) => (
                    <tr key={key} className="border-b last:border-0">
                      <td className="p-2 font-medium">{key}</td>
                      <td className="p-2">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          <TabsContent value="csv" className="mt-0">
            <pre className="bg-muted/50 p-4 rounded-md overflow-auto max-h-[400px] text-xs md:text-sm">
              {Object.keys(result).join(",")}
              <br />
              {Object.values(result).join(",")}
            </pre>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ParseResult;
