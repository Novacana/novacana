
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.3";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Resend client für E-Mail-Versand
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Struktur für die Kontaktanfrage
interface ContactRequest {
  name: string;
  email: string;
  pharmacyName?: string;
  message: string;
}

// HTML-Template für die Bestätigungs-E-Mail an den Absender
const getConfirmationEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestätigung Ihrer Anfrage bei Novacana</title>
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
  </style>
</head>
<body>
  <div class="container">
    <h2>Vielen Dank für Ihre Anfrage</h2>
    
    <p>Sehr geehrte(r) ${name},</p>
    
    <p>wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
    
    <p>Mit freundlichen Grüßen,<br>Ihr Novacana Team</p>
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
  </div>
</body>
</html>
`;

// HTML-Template für die Benachrichtigungs-E-Mail an Novacana
const getNotificationEmailTemplate = (name: string, email: string, pharmacyName: string, message: string) => `
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
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
    <p>Diese Nachricht wurde über das Kontaktformular auf novacana.de gesendet.</p>
  </div>
</body>
</html>
`;

// Deno-Server für die Funktion
serve(async (req) => {
  // CORS-Preflight-Anfragen behandeln
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: ContactRequest = await req.json();
    const { name, email, pharmacyName, message } = body;

    // Validierung der erforderlichen Felder
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: "Name, E-Mail und Nachricht sind erforderlich" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log("Kontaktformular gesendet von:", name);
    console.log("E-Mail:", email);
    console.log("Apotheke:", pharmacyName || "Nicht angegeben");
    console.log("Nachricht:", message);

    // E-Mail an info@novacana.de (Benachrichtigung über neue Anfrage)
    const notificationEmail = await resend.emails.send({
      from: "Novacana Kontaktformular <noreply@novacana.de>",
      to: "info@novacana.de",
      subject: `Neue Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`,
      html: getNotificationEmailTemplate(name, email, pharmacyName || "", message),
      reply_to: email
    });

    console.log("Benachrichtigungs-E-Mail gesendet:", notificationEmail);

    // Bestätigungs-E-Mail an den Absender
    const confirmationEmail = await resend.emails.send({
      from: "Novacana <noreply@novacana.de>",
      to: email,
      subject: "Vielen Dank für Ihre Anfrage bei Novacana",
      html: getConfirmationEmailTemplate(name)
    });

    console.log("Bestätigungs-E-Mail gesendet:", confirmationEmail);

    // Erfolgsantwort
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Kontaktanfrage erfolgreich übermittelt",
        notificationId: notificationEmail.id,
        confirmationId: confirmationEmail.id
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Fehler bei der Verarbeitung der Kontaktanfrage:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Fehler bei der Verarbeitung der Anfrage" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
