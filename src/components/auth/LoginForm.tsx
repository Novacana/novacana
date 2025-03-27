
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

// Formular-Schema
const loginSchema = z.object({
  email: z.string().email("Bitte geben Sie eine gültige E-Mail-Adresse ein."),
  password: z.string().min(6, "Das Passwort muss mindestens 6 Zeichen lang sein."),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("standard");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      // HINWEIS: Dies ist nur ein Beispiel. In einer echten Anwendung 
      // würden Sie hier die tatsächliche API-Authentifizierung durchführen.
      
      // Simulieren Sie eine Verzögerung für die Demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Erfolgsfall simulieren - Token setzen
      localStorage.setItem("authToken", "dummy-token");
      
      toast({
        title: "Erfolgreich angemeldet",
        description: "Sie werden weitergeleitet.",
      });
      
      // Zu den Produkten weiterleiten
      navigate("/products");
    } catch (error) {
      toast({
        title: "Fehler bei der Anmeldung",
        description: "Bitte überprüfen Sie Ihre Anmeldedaten und versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // DocCheck Message Handler
  React.useEffect(() => {
    const handleDocCheckMessage = (event: MessageEvent) => {
      // In einer realen Anwendung würden Sie die Ursprungs-URL prüfen
      if (event.origin.includes("doccheck.com")) {
        try {
          const data = JSON.parse(event.data);
          if (data && data.dc_uid && data.dc_pwh) {
            // Erfolgreiche Anmeldung über DocCheck
            localStorage.setItem("doccheck_auth", "true");
            localStorage.setItem("doccheck_uid", data.dc_uid);
            
            toast({
              title: "DocCheck-Authentifizierung erfolgreich",
              description: "Sie wurden als Angehöriger eines Heilberufs verifiziert.",
            });
            
            navigate("/products");
          }
        } catch (error) {
          console.error("Fehler beim Verarbeiten der DocCheck-Nachricht:", error);
        }
      }
    };

    window.addEventListener("message", handleDocCheckMessage);
    return () => window.removeEventListener("message", handleDocCheckMessage);
  }, [navigate, toast]);

  return (
    <Tabs defaultValue="standard" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-2 mb-6">
        <TabsTrigger value="standard">{t('login.standard')}</TabsTrigger>
        <TabsTrigger value="doccheck">{t('login.doccheck')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="standard">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('login.email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="apotheke@beispiel.de"
              {...register("email")}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t('login.password')}</Label>
              <Link to="/reset-password" className="text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
                {t('login.forgot')}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className={errors.password ? "border-red-500" : ""}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full bg-black hover:bg-gray-800 text-white" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('login.loading')}
              </>
            ) : (
              t('login.submit')
            )}
          </Button>
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            {t('login.no_account')}{" "}
            <Link to="/register" className="font-medium text-black dark:text-white hover:underline">
              {t('login.register_now')}
            </Link>
          </div>
        </form>
      </TabsContent>
      
      <TabsContent value="doccheck">
        <div className="space-y-4">
          <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {t('login.doccheck_info')}
          </div>
          
          <div className="flex justify-center">
            <iframe 
              ref={iframeRef}
              frameBorder="0" 
              scrolling="no" 
              width="424" 
              height="215" 
              id="dc_login_iframe" 
              name="dc_login_iframe" 
              src="https://login.doccheck.com/code/de/2000000022188/login_l/" 
              className="border rounded"
            >
              <a href="https://login.doccheck.com/code/de/2000000022188/login_l/" target="_blank" rel="noreferrer">LOGIN</a>
            </iframe>
          </div>
          
          <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
            {t('login.doccheck_help')}
          </div>
          
          <Separator className="my-4" />
          
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t('login.standard_option')}{" "}
            <button 
              type="button" 
              onClick={() => setActiveTab("standard")}
              className="font-medium text-black dark:text-white hover:underline"
            >
              {t('login.standard_link')}
            </button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default LoginForm;
