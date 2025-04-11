
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ApiDocs = () => {
  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
          <p className="text-muted-foreground mb-8">
            Integrate document parsing capabilities into your applications
          </p>

          <Tabs defaultValue="overview">
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="authentication">Authentication</TabsTrigger>
              <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>API Overview</CardTitle>
                  <CardDescription>
                    DocuParse.AI provides a RESTful API for document parsing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The DocuParse.AI API allows you to programmatically upload documents and receive structured data in return. 
                    Our API is designed to be simple to integrate with any application, providing flexible output formats and 
                    easy-to-use endpoints.
                  </p>
                  
                  <h3 className="text-lg font-medium mt-6">Base URL</h3>
                  <pre className="bg-muted/50 p-3 rounded-md text-sm">https://api.docuparse.ai/v1</pre>
                  
                  <h3 className="text-lg font-medium mt-6">Response Formats</h3>
                  <p>The API returns responses in JSON format by default. You can request CSV output by setting the appropriate header.</p>
                  
                  <h3 className="text-lg font-medium mt-6">Rate Limits</h3>
                  <p>API rate limits depend on your subscription tier:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Free:</strong> 50 requests per day</li>
                    <li><strong>Pro:</strong> 500 requests per day</li>
                    <li><strong>Enterprise:</strong> Custom limits</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="authentication">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>
                    Learn how to authenticate your API requests
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    All API requests must be authenticated using an API key. You can find your API key in your account dashboard.
                  </p>
                  
                  <h3 className="text-lg font-medium mt-6">API Key Authentication</h3>
                  <p>Include your API key in the request headers:</p>
                  
                  <pre className="bg-muted/50 p-3 rounded-md text-sm">
{`// Example header
Authorization: Bearer YOUR_API_KEY`}
                  </pre>
                  
                  <h3 className="text-lg font-medium mt-6">API Key Security</h3>
                  <p>Your API key grants access to your account and should be kept secure:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Never share your API key in publicly accessible areas</li>
                    <li>Do not include your API key directly in code that will be shared</li>
                    <li>Use environment variables or secure vaults to store your API key</li>
                    <li>You can regenerate your API key at any time from your dashboard</li>
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="endpoints">
              <Card>
                <CardHeader>
                  <CardTitle>API Endpoints</CardTitle>
                  <CardDescription>
                    Available API endpoints and their usage
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium">Parse Document</h3>
                    <pre className="bg-muted/50 p-3 rounded-md text-sm mt-2">
{`POST /documents/parse

// Form data:
file: <PDF file>

// Optional parameters:
output_format: json|csv (default: json)
webhook_url: https://your-domain.com/webhook (optional)`}
                    </pre>
                    
                    <h4 className="font-medium mt-4">Response:</h4>
                    <pre className="bg-muted/50 p-3 rounded-md text-sm mt-1">
{`{
  "job_id": "job_123456789",
  "status": "processing",
  "estimated_completion_time": "2023-04-10T15:30:45Z"
}`}
                    </pre>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium">Get Parse Result</h3>
                    <pre className="bg-muted/50 p-3 rounded-md text-sm mt-2">
{`GET /documents/result/:job_id

// Parameters:
job_id: The job ID returned from the parse request`}
                    </pre>
                    
                    <h4 className="font-medium mt-4">Response:</h4>
                    <pre className="bg-muted/50 p-3 rounded-md text-sm mt-1">
{`{
  "job_id": "job_123456789",
  "status": "completed",
  "document_type": "invoice",
  "result": {
    // Structured document data
    "invoice_number": "INV-2023-001",
    "date": "2023-03-15",
    "total": 1250.00,
    ...
  }
}`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="examples">
              <Card>
                <CardHeader>
                  <CardTitle>Code Examples</CardTitle>
                  <CardDescription>
                    Example API usage in different programming languages
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="javascript">
                    <TabsList className="mb-4">
                      <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                      <TabsTrigger value="python">Python</TabsTrigger>
                      <TabsTrigger value="curl">cURL</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="javascript" className="mt-0">
                      <pre className="bg-muted/50 p-3 rounded-md text-sm">
{`// Upload and parse a document using fetch
// Note: The frontend no longer requires a user-supplied OAuth token or API key.
// Authentication is handled server-side. For direct API usage, see below.

async function parseDocument(file) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.docuparse.ai/v1/documents/parse', {
    method: 'POST',
    body: formData
  });

  const data = await response.json();

  // Check job status
  const jobId = data.job_id;

  // Poll for results
  let result;
  while (true) {
    const resultResponse = await fetch(\`https://api.docuparse.ai/v1/documents/result/\${jobId}\`);
    result = await resultResponse.json();

    if (result.status === 'completed' || result.status === 'failed') {
      break;
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return result;
}`}
                      </pre>
                    </TabsContent>
                    
                    <TabsContent value="python" className="mt-0">
                      <pre className="bg-muted/50 p-3 rounded-md text-sm">
{`import requests
import time

def parse_document(file_path, api_key):
    # Upload and initiate parsing
    with open(file_path, 'rb') as f:
        response = requests.post(
            'https://api.docuparse.ai/v1/documents/parse',
            headers={'Authorization': f'Bearer {api_key}'},
            files={'file': f}
        )
    
    data = response.json()
    job_id = data['job_id']
    
    # Poll for results
    while True:
        result_response = requests.get(
            f'https://api.docuparse.ai/v1/documents/result/{job_id}',
            headers={'Authorization': f'Bearer {api_key}'}
        )
        
        result = result_response.json()
        
        if result['status'] in ['completed', 'failed']:
            break
            
        # Wait before polling again
        time.sleep(1)
    
    return result`}
                      </pre>
                    </TabsContent>
                    
                    <TabsContent value="curl" className="mt-0">
                      <pre className="bg-muted/50 p-3 rounded-md text-sm">
{`# Upload and parse a document
curl -X POST \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -F "file=@/path/to/document.pdf" \\
  https://api.docuparse.ai/v1/documents/parse

# Get parsing results
curl -X GET \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.docuparse.ai/v1/documents/result/job_123456789`}
                      </pre>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default ApiDocs;
