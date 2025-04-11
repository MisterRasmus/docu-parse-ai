
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileText, Upload as UploadIcon, History, Settings } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  tier: string;
  id: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [recentDocs, setRecentDocs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user data from localStorage (in a real app, this would come from an API)
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      setUserData(JSON.parse(userDataString));
    }
    
    // Simulate loading recent documents
    setTimeout(() => {
      setRecentDocs([
        { id: "doc1", name: "invoice-march.pdf", status: "completed", date: "2025-04-08" },
        { id: "doc2", name: "order-conf-12345.pdf", status: "completed", date: "2025-04-07" },
      ]);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-2">Welcome, {userData?.name}</h1>
        <p className="text-muted-foreground mb-8">
          Your current plan: <span className="font-medium capitalize">{userData?.tier}</span> tier
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you can perform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button asChild className="w-full justify-start">
                <Link to="/upload">
                  <UploadIcon className="mr-2 h-4 w-4" />
                  Upload Document
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/history">
                  <History className="mr-2 h-4 w-4" />
                  View History
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full justify-start">
                <Link to="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Usage Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Statistics</CardTitle>
              <CardDescription>Your document processing usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Documents Processed</span>
                    <span className="font-medium">2 / 10</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: "20%" }}></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    8 documents remaining in your free tier this month
                  </p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>API Calls</span>
                    <span className="font-medium">0 / 5</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: "0%" }}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
              <CardDescription>Your subscription information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <p className="font-medium">{userData?.email}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Current Plan:</span>
                  <p className="font-medium capitalize">{userData?.tier}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Account ID:</span>
                  <p className="font-medium">{userData?.id}</p>
                </div>
                <div className="pt-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/billing">Upgrade Plan</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Documents */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Documents</CardTitle>
            <CardDescription>Your recently processed documents</CardDescription>
          </CardHeader>
          <CardContent>
            {recentDocs.length > 0 ? (
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium">Document</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Date</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDocs.map((doc) => (
                      <tr key={doc.id} className="border-t">
                        <td className="p-3 flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                          {doc.name}
                        </td>
                        <td className="p-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                            {doc.status}
                          </span>
                        </td>
                        <td className="p-3">{doc.date}</td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">View</Button>
                            <Button size="sm" variant="outline">Download</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>No documents processed yet</p>
                <Button variant="outline" className="mt-4" asChild>
                  <Link to="/upload">Upload Your First Document</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Dashboard;
