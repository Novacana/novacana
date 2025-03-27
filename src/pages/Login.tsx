
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
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
                Nur für medizinisches Fachpersonal und Apotheken zugänglich.
              </AlertDescription>
            </Alert>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
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
