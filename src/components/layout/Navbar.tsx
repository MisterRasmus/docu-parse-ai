
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Menu, X, User, LogOut } from "lucide-react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
    
    // Get user data if authenticated
    if (authStatus) {
      const userData = localStorage.getItem("user");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, []);
  
  const handleSignOut = () => {
    // Clear authentication data
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    
    // Show toast or notification
    
    // Redirect to home page
    navigate("/");
    
    // Close mobile menu if open
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 w-full z-50 glassmorphism">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-accent" />
          <span className="font-bold text-xl">DocuParse.AI</span>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex gap-6">
            <Link to="/features" className="text-foreground/90 hover:text-accent transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-foreground/90 hover:text-accent transition-colors">
              Pricing
            </Link>
            <Link to="/api-docs" className="text-foreground/90 hover:text-accent transition-colors">
              API
            </Link>
            
            {isAuthenticated && (
              <Link to="/dashboard" className="text-foreground/90 hover:text-accent transition-colors">
                Dashboard
              </Link>
            )}
          </div>
          
          <div className="flex gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="flex items-center gap-2 text-foreground/90 hover:text-accent transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user?.name || "Account"}</span>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut} className="flex items-center gap-1">
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </nav>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden px-6 py-4 bg-background shadow-lg">
          <div className="flex flex-col gap-4">
            <Link 
              to="/features" 
              className="text-foreground/90 hover:text-accent py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="text-foreground/90 hover:text-accent py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/api-docs" 
              className="text-foreground/90 hover:text-accent py-2 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              API
            </Link>
            
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className="text-foreground/90 hover:text-accent py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            
            <hr className="my-2 border-border" />
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="flex items-center gap-2 text-foreground/90 hover:text-accent py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  {user?.name || "Account"}
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleSignOut} 
                  className="flex items-center justify-center gap-2 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link 
                  to="/signin" 
                  className="text-foreground/90 hover:text-accent py-2 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button className="w-full">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
