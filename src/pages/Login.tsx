
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Pill, HeartPulse, Info } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Login = () => {
  const { t } = useLanguage();
  
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
            
            <Alert className="mb-6 bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <p>Hinweis zur E-Mail-Bestätigung: Bitte bestätigen Sie Ihre E-Mail-Adresse nach der Registrierung durch Klicken auf den Link in der an Sie gesendeten E-Mail. Überprüfen Sie auch Ihren Spam-Ordner.</p>
                <p className="mt-1 text-sm">Wenn Sie Probleme beim Anmelden haben, können Sie eine neue Bestätigungs-E-Mail anfordern.</p>
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
              <LoginForm />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
