
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Key, AlertCircle, Info, CheckCircle2, ExternalLink } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKeyFormProps {
  onSaveApiKey: (apiKey: string) => void;
  initialApiKey?: string;
}

const ApiKeyForm = ({ onSaveApiKey, initialApiKey = "" }: ApiKeyFormProps) => {
  const [apiKey, setApiKey] = useState(initialApiKey);
  const [isVisible, setIsVisible] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "Access Token Required",
        description: "Please enter your Google Document AI OAuth 2.0 access token.",
        variant: "destructive",
      });
      return;
    }
    
    // Simple validation to check if it's likely an OAuth token and not a client ID
    if (apiKey.includes(".apps.googleusercontent.com")) {
      toast({
        title: "Invalid Token Format",
        description: "You've entered a Client ID, not an OAuth access token. Please generate an OAuth 2.0 access token using Google OAuth Playground.",
        variant: "destructive",
      });
      return;
    }
    
    // Save the API key
    onSaveApiKey(apiKey);
    
    toast({
      title: "OAuth Token Saved",
      description: "Your Document AI OAuth token has been saved.",
    });
    
    // Hide the key again for security
    setIsVisible(false);
  };

  const validateKey = async () => {
    if (!apiKey) {
      toast({
        title: "Invalid Token",
        description: "Please enter a valid Google OAuth token to validate.",
        variant: "destructive"
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Simple validation to check if it's likely an OAuth token and not a client ID
      if (apiKey.includes(".apps.googleusercontent.com")) {
        throw new Error("This looks like a Client ID, not an OAuth 2.0 access token. Please use Google OAuth Playground to generate an access token.");
      }
      
      // Check token format
      if (apiKey.length < 20) {
        throw new Error("OAuth token appears to be too short");
      }
      
      toast({
        title: "OAuth Token Format Valid",
        description: "The format appears to be correct. Test a document upload to verify functionality.",
      });
    } catch (error) {
      toast({
        title: "OAuth Token Validation Failed",
        description: error instanceof Error ? error.message : "The key doesn't appear to be a valid OAuth token",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          Google Document AI OAuth Token
        </CardTitle>
        <CardDescription>
          Enter your Google OAuth 2.0 access token with Document AI permissions.
          For a production app, this should be handled securely on the server.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <Input
                type={isVisible ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Google OAuth 2.0 access token"
                className="pr-24"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your OAuth token should be short-lived and have the correct Document AI permissions.
            </p>
          </div>
          
          <Alert variant="destructive" className="bg-destructive/10 text-destructive border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>IMPORTANT:</strong> You must use an OAuth 2.0 access token, not a Client ID or API key.
              Client IDs end with ".apps.googleusercontent.com" and will not work with Document AI.
            </AlertDescription>
          </Alert>
          
          <div className="flex gap-2 flex-col sm:flex-row">
            <Button type="submit" className="flex-1">Save OAuth Token</Button>
            <Button 
              type="button" 
              onClick={validateKey} 
              variant="outline" 
              className="flex-1"
              disabled={isValidating}
            >
              {isValidating ? "Validating..." : "Validate Format"}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 mt-0.5 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">
            <p><strong>How to get a valid OAuth 2.0 access token:</strong></p>
            <ol className="list-decimal pl-4 space-y-1 mt-1">
              <li>Go to <a href="https://developers.google.com/oauthplayground/" target="_blank" className="text-primary hover:underline">Google OAuth Playground</a></li>
              <li>Select "Document AI API v1" from the API list</li>
              <li>Click "Authorize APIs" and allow access</li>
              <li>Click "Exchange authorization code for tokens"</li>
              <li>Copy the "Access token" value (not the refresh token or ID token)</li>
              <li>Paste the access token here</li>
            </ol>
            <div className="bg-secondary/50 p-2 rounded mt-2 text-xs">
              <p><strong>Note:</strong> OAuth tokens typically expire after 1 hour. For production use, implement a server-side solution that handles token refresh.</p>
            </div>
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-xs mt-2 flex items-center gap-1" 
              onClick={() => window.open("https://developers.google.com/oauthplayground/", "_blank")}
            >
              Open Google OAuth Playground <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApiKeyForm;
