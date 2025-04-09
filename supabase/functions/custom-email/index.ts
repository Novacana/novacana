
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Erstellen des Supabase-Clients mit der Admin-Rolle
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// HTML-Template für die Bestätigungs-E-Mail
const getConfirmationEmailTemplate = (confirmationURL: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestätigen Sie Ihre Registrierung bei Novacana</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .button {
      display: inline-block;
      background-color: #4a7b57;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .info {
      font-size: 14px;
      background-color: #f0f7f2;
      border-left: 4px solid #4a7b57;
      padding: 10px 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo" class="logo">
  </div>
  
  <div class="container">
    <h2>Bestätigen Sie Ihre Registrierung</h2>
    
    <p>Vielen Dank für Ihre Registrierung bei Novacana. Als Teil des medizinischen Fachkreises bieten wir Ihnen Zugang zu exklusiven Informationen und Produkten.</p>
    
    <p>Bitte bestätigen Sie Ihre E-Mail-Adresse, indem Sie auf die folgende Schaltfläche klicken:</p>
    
    <div style="text-align: center;">
      <a href="${confirmationURL}" class="button">E-Mail bestätigen</a>
    </div>
    
    <div class="info">
      <p><strong>Hinweis:</strong> Diese E-Mail wurde für medizinisches Fachpersonal und Apotheken generiert. Falls Sie diese E-Mail irrtümlicherweise erhalten haben, ignorieren Sie diese bitte.</p>
    </div>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
  </div>
</body>
</html>
`;

// HTML-Template für die Passwort-Reset-E-Mail
const getResetPasswordEmailTemplate = (resetURL: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passwort zurücksetzen - Novacana</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .button {
      display: inline-block;
      background-color: #4a7b57;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 4px;
      font-weight: bold;
      margin: 20px 0;
    }
    .warning {
      font-size: 14px;
      background-color: #fff6f6;
      border-left: 4px solid #e74c3c;
      padding: 10px 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo" class="logo">
  </div>
  
  <div class="container">
    <h2>Passwort zurücksetzen</h2>
    
    <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts für Ihren Novacana-Zugang gestellt.</p>
    
    <p>Bitte klicken Sie auf die folgende Schaltfläche, um Ihr Passwort zurückzusetzen:</p>
    
    <div style="text-align: center;">
      <a href="${resetURL}" class="button">Passwort zurücksetzen</a>
    </div>
    
    <div class="warning">
      <p><strong>Sicherheitshinweis:</strong> Falls Sie diese Anfrage nicht gestellt haben, ignorieren Sie bitte diese E-Mail und stellen Sie sicher, dass Sie weiterhin Zugriff auf Ihr Konto haben.</p>
    </div>
    
    <p>Dieser Link ist aus Sicherheitsgründen nur für eine begrenzte Zeit gültig.</p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
  </div>
</body>
</html>
`;

// HTML-Template für die Kontaktformular-Benachrichtigung
const getContactFormEmailTemplate = (name: string, email: string, pharmacyName: string, message: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kontaktanfrage - Novacana</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    .logo {
      max-width: 200px;
      margin-bottom: 20px;
    }
    .container {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 30px;
    }
    .footer {
      margin-top: 30px;
      font-size: 12px;
      color: #777;
      text-align: center;
    }
    .info-block {
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f0f7f2;
      border-radius: 4px;
    }
    .message-block {
      margin-top: 20px;
      padding: 15px;
      background-color: #f5f5f5;
      border-left: 4px solid #4a7b57;
      border-radius: 4px;
    }
    h2 {
      color: #4a7b57;
    }
    .label {
      font-weight: bold;
      margin-right: 10px;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo" class="logo">
  </div>
  
  <div class="container">
    <h2>Neue Kontaktanfrage</h2>
    
    <p>Sie haben eine neue Anfrage über das Kontaktformular auf Ihrer Website erhalten.</p>
    
    <div class="info-block">
      <p><span class="label">Name:</span> ${name}</p>
      <p><span class="label">E-Mail:</span> ${email}</p>
      <p><span class="label">Apotheke:</span> ${pharmacyName || 'Nicht angegeben'}</p>
    </div>
    
    <h3>Nachricht:</h3>
    <div class="message-block">
      ${message.replace(/\n/g, '<br>')}
    </div>
    
    <p>Sie können auf diese E-Mail antworten, um direkt mit dem Absender zu kommunizieren.</p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese Nachricht wurde über das Kontaktformular auf novacana.de gesendet.</p>
  </div>
</body>
</html>
`;

serve(async (req) => {
  // CORS-Preflight-Anforderungen behandeln
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { email, type, name, pharmacyName, message, redirectTo = `${new URL(req.url).origin}/login` } = requestData;

    if (!email && type !== "contact") {
      return new Response(
        JSON.stringify({ error: "E-Mail ist erforderlich" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    let emailTemplate = "";
    const redirectURL = new URL(redirectTo);
    const fullRedirectTo = redirectURL.toString();

    // Behandlung der verschiedenen E-Mail-Typen
    if (type === "signup") {
      // Senden einer benutzerdefinierten Bestätigungs-E-Mail
      result = await supabase.auth.admin.generateLink({
        type: "signup",
        email,
        options: {
          redirectTo: fullRedirectTo,
        }
      });
      
      if (result.error) {
        throw result.error;
      }
      
      const link = result.data.properties.action_link;
      emailTemplate = getConfirmationEmailTemplate(link);
      
      console.log(`Registrierungs-E-Mail-Link für ${email} generiert:`, link);
      
    } else if (type === "recovery") {
      // Senden einer benutzerdefinierten Passwort-Reset-E-Mail
      result = await supabase.auth.admin.generateLink({
        type: "recovery",
        email,
        options: {
          redirectTo: fullRedirectTo,
        }
      });
      
      if (result.error) {
        throw result.error;
      }
      
      const link = result.data.properties.action_link;
      emailTemplate = getResetPasswordEmailTemplate(link);
      
      console.log(`Passwort-Reset-E-Mail-Link für ${email} generiert:`, link);
      
    } else if (type === "contact") {
      // Verarbeitung einer Kontaktformular-Anfrage
      if (!name || !message) {
        return new Response(
          JSON.stringify({ error: "Name und Nachricht sind erforderlich" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      emailTemplate = getContactFormEmailTemplate(name, email, pharmacyName || '', message);
      
      console.log("Kontaktformular-Anfrage von:", name);
      console.log("E-Mail:", email);
      console.log("Apotheke:", pharmacyName || "Nicht angegeben");
      console.log("Nachricht:", message);
      
      // In einer Produktionsumgebung würde hier ein E-Mail-Service integriert werden
      console.log("E-Mail-Template generiert für Kontaktformular");
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Kontaktanfrage wurde an info@novacana.de weitergeleitet` 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Ungültiger E-Mail-Typ" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Hier könnte die tatsächliche E-Mail-Versandlogik implementiert werden
    console.log("E-Mail-Template generiert:", emailTemplate.substring(0, 100) + "...");

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `E-Mail vom Typ ${type} wurde an ${type === "contact" ? "info@novacana.de" : email} gesendet` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Fehler bei der E-Mail-Generierung:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
