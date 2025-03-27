
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Pill, HeartPulse, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { checkAdminExists } from "@/utils/authUtils";
import FirstAdminSetup from "@/components/auth/FirstAdminSetup";
import MasterAdminCreator from "@/components/auth/MasterAdminCreator";
import { Button } from "@/components/ui/button";
import { useState as useStateDialog } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Login = () => {
  const { t } = useLanguage();
  const [formStatus, setFormStatus] = useState({
    loading: false,
    error: null,
    success: false
  });
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const [showMasterAdmin, setShowMasterAdmin] = useState(false);
  
  useEffect(() => {
    const checkForAdmins = async () => {
      const hasAdmin = await checkAdminExists();
      console.log("Admin Existenz-Check:", hasAdmin);
      setAdminExists(hasAdmin);
    };
    
    checkForAdmins();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content py-8">
          <div className="max-w-md mx-auto">
            <Alert className="mb-6 bg-gray-100 border-gray-300 dark:bg-gray-800 dark:border-gray-700">
              <AlertCircle className="h-4 w-4 text-gray-700 dark:text-gray-300" />
              <AlertDescription>
                Nur für medizinisches Fachpersonal und Apotheken zugänglich. Sie können sich mit Ihren Daten anmelden oder bei erstmaliger Nutzung registrieren.
              </AlertDescription>
            </Alert>
            
            <div className="mb-8 text-center">
              <img 
                src="/lovable-uploads/66045f1f-4643-4ce0-9479-3d9a29387536.png" 
                alt="Novacana" 
                className="max-h-24 mx-auto"
                onError={(e) => {
                  console.error("Logo konnte nicht geladen werden:", e);
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/placeholder.svg";
                }}
              />
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
              <div className="flex items-center justify-center mb-6">
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-full">
                  <Pill className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Fachkreis Login</span>
                  <HeartPulse className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <LoginForm setFormStatus={setFormStatus} />
              
              {adminExists === false && (
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <FirstAdminSetup />
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Info className="h-4 w-4 mr-2" />
                      Master Admin zugriff
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Master Admin erstellen</DialogTitle>
                    </DialogHeader>
                    <MasterAdminCreator />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
