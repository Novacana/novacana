
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegisterForm from "@/components/auth/RegisterForm";

const Register = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="container-content py-8">
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 md:p-8 space-y-8">
            <RegisterForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Register;
