
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  showDocCheckCallback?: boolean;
  adminOnly?: boolean;
}

// Function to check authentication
const isAuthenticated = (): boolean => {
  return localStorage.getItem("authToken") === "dummy-token" || localStorage.getItem("doccheck_auth") === "true";
};

// DocCheck Redirect URL configuration
const DOCCHECK_LOGIN_ID = "d279f3d6ef165e8ccd90bb8a52a149"; // Example Login-ID - replace with real one
const DOCCHECK_LOGIN_URL = `https://login.doccheck.com/code/${DOCCHECK_LOGIN_ID}/`;
const REDIRECT_URL = window.location.origin + "/doccheck-callback";

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  showDocCheckCallback = false,
  adminOnly = false
}) => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      // If adminOnly is true, verify the user has admin role
      if (adminOnly) {
        checkAdminRole();
      } else {
        setIsVerifying(false);
        setShowContent(true);
      }
      return;
    }

    // Check DocCheck callback parameters (when user returns from DocCheck)
    const urlParams = new URLSearchParams(window.location.search);
    const dc_uid = urlParams.get("dc_uid");
    const dc_pwh = urlParams.get("dc_pwh");
    const returnTo = urlParams.get("returnTo");
    
    if (dc_uid && dc_pwh) {
      handleDocCheckCallback(dc_uid, dc_pwh, returnTo);
    } else {
      setIsVerifying(false);
    }
    
    // Listen for messages from DocCheck iFrame
    const handleIframeMessage = (event: MessageEvent) => {
      // Check if message is from DocCheck (you need to know the exact origin URL)
      if (event.origin.includes("doccheck.com")) {
        try {
          const data = event.data;
          if (data && data.dc_uid && data.dc_pwh) {
            // Successful login via iFrame
            handleDocCheckCallback(data.dc_uid, data.dc_pwh, null);
          }
        } catch (error) {
          console.error("Error processing DocCheck message:", error);
        }
      }
    };

    window.addEventListener("message", handleIframeMessage);
    
    return () => {
      window.removeEventListener("message", handleIframeMessage);
    };
  }, [location, navigate, adminOnly]);

  const checkAdminRole = async () => {
    try {
      // In a real app, check user role from Supabase
      // For now, we'll use a simple check (replace with actual logic)
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) throw error;
      
      if (data) {
        setIsAdmin(true);
        setShowContent(true);
      } else {
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges to access this area.",
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking admin role:', error);
      toast({
        title: "Authentication Error",
        description: "There was an error verifying your permissions.",
        variant: "destructive",
      });
      navigate('/dashboard');
    } finally {
      setIsVerifying(false);
    }
  };

  // Function to handle DocCheck callback
  const handleDocCheckCallback = (dc_uid: string, dc_pwh: string, returnTo?: string | null) => {
    setIsVerifying(true);
    
    // In a real application, you would validate these values on your server
    // Here we set the auth status directly for demo purposes
    setTimeout(() => {
      // Store DocCheck auth data in localStorage
      localStorage.setItem("doccheck_auth", "true");
      localStorage.setItem("doccheck_uid", dc_uid);
      
      // If adminOnly, check admin role
      if (adminOnly) {
        checkAdminRole();
      } else {
        setShowContent(true);
        setIsVerifying(false);
      }
      
      // Redirect to requested page if returnTo is specified
      if (returnTo && returnTo.startsWith('/')) {
        navigate(returnTo);
      } else {
        // Automatically remove URL parameters (for better user experience)
        window.history.replaceState({}, document.title, location.pathname);
      }
      
      toast({
        title: "Authentication successful",
        description: "You have been verified as a healthcare professional.",
      });
    }, 1000);
  };

  // Function to redirect to DocCheck
  const handleDocCheckAuth = () => {
    setIsVerifying(true);
    
    // Redirect to DocCheck with return to current URL
    const currentPath = encodeURIComponent(location.pathname);
    const loginUrl = `${DOCCHECK_LOGIN_URL}?dc_referer=${REDIRECT_URL}?returnTo=${currentPath}`;
    
    // In a real application, you would redirect directly to DocCheck
    window.location.href = loginUrl;
  };

  // Show loading view when verifying
  if (isVerifying) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pt-24 pb-12">
          <div className="container-content max-w-3xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Verifying access...
              </h1>
              <div className="flex justify-center my-8">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Please wait while we verify your credentials...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show DocCheck callback view during verification
  if (showDocCheckCallback && isVerifying) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pt-24 pb-12">
          <div className="container-content max-w-3xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                DocCheck Verification
              </h1>
              <div className="flex justify-center my-8">
                <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Your DocCheck authentication is being processed. Please wait a moment...
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (showContent) {
    return <>{children}</>;
  }

  // Access denied for admin-only routes
  if (adminOnly && !isAdmin && !isVerifying) {
    return (
      <div className="flex flex-col min-h-screen">
        <main className="flex-1 pt-24 pb-12">
          <div className="container-content max-w-3xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
              <div className="flex justify-center text-red-500 mb-4">
                <AlertTriangle size={48} />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Access Denied
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                You do not have the required permissions to access this area.
              </p>
              <Button onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // If not authenticated, redirect to login page
  return <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
