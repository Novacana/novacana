
import React, { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";
import MasterAdminCreator from "@/components/auth/MasterAdminCreator";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";

const Register = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content py-8">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 space-y-8">
            <RegisterForm />
            
            {/* Master Admin Creator */}
            <div className="pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
