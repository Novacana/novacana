
import React, { useEffect, useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { checkIsAdmin } from "@/utils/authUtils";
import { supabase } from "@/integrations/supabase/client";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  backUrl?: string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title,
  backUrl = "/admin" 
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Überprüfen, ob der Benutzer Admin-Rechte hat
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        console.log("AdminLayout - Session geprüft:", session?.user?.email);
        
        if (!session?.user) {
          console.log("AdminLayout - Kein Benutzer gefunden, Weiterleitung zum Login");
          toast({
            title: "Zugriff verweigert",
            description: "Sie müssen angemeldet sein, um den Admin-Bereich zu nutzen.",
            variant: "destructive"
          });
          navigate("/login?returnUrl=/admin");
          return;
        }
        
        const adminStatus = await checkIsAdmin(session.user.id);
        console.log("AdminLayout - Admin-Status für Benutzer:", session.user.id, adminStatus);
        
        if (!adminStatus) {
          console.log("AdminLayout - Kein Admin-Zugriff, Weiterleitung zum Dashboard");
          toast({
            title: "Zugriff verweigert",
            description: "Sie benötigen Administrator-Rechte, um auf diese Seite zuzugreifen.",
            variant: "destructive"
          });
          navigate("/dashboard");
          return;
        }
        
        // Admin-Rechte bestätigt
        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error("AdminLayout - Fehler beim Überprüfen der Admin-Rechte:", error);
        toast({
          title: "Fehler",
          description: "Bei der Überprüfung Ihrer Berechtigungen ist ein Fehler aufgetreten.",
          variant: "destructive"
        });
        navigate("/dashboard");
      }
    };
    
    checkAdminAccess();
  }, [navigate, toast]);
  
  // Zeige Ladeanimation, wenn noch geprüft wird
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="h-12 w-12 animate-spin text-nova-600 mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Authentifizierung wird überprüft...</p>
      </div>
    );
  }
  
  // Nur rendern, wenn Admin-Rechte bestätigt wurden
  return isAdmin ? (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-6">
          <AdminSidebar />
          
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="lg:hidden"
                    onClick={() => navigate(backUrl)}
                  >
                    <ArrowLeft size={18} />
                  </Button>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h1>
                </div>
              </div>
              <div className="p-6">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default AdminLayout;
