
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for contact form data
interface ContactFormData {
  name: string;
  email: string;
  pharmacyName?: string;
  message: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log("Processing contact form submission");

  try {
    // Parse request body
    const requestData = await req.json();
    const { name, email, pharmacyName, message }: ContactFormData = requestData;
    
    console.log("Request data:", { name, email, pharmacyName, message: message?.substring(0, 20) + "..." });

    // Validate required fields
    if (!name || !email || !message) {
      console.error("Missing required fields");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Fehlende Pflichtfelder",
          details: "Name, E-Mail und Nachricht sind erforderlich"
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("Invalid email format:", email);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Ungültige E-Mail",
          details: "Bitte geben Sie eine gültige E-Mail-Adresse ein"
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get API key from environment
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Server-Konfigurationsfehler",
          details: "E-Mail-API nicht konfiguriert"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize Resend client
    const resend = new Resend(resendApiKey);
    console.log("Resend client initialized");

    // Create notification email (to Novacana)
    const notificationHtml = generateNotificationEmail(name, email, pharmacyName || "", message);
    
    // Create confirmation email (to customer)
    const confirmationHtml = generateConfirmationEmail(name);

    try {
      console.log("Sending notification email to info@novacana.de");
      
      // Send notification to company
      const notificationResult = await resend.emails.send({
        from: "Novacana Kontaktformular <noreply@novacana.de>",
        to: "info@novacana.de",
        subject: `Neue Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`,
        html: notificationHtml,
        reply_to: email
      });
      
      console.log("Notification email result:", notificationResult);

      if (!notificationResult.id) {
        throw new Error("Failed to send notification email");
      }

      console.log("Sending confirmation email to customer");
      
      // Send confirmation to customer
      const confirmationResult = await resend.emails.send({
        from: "Novacana <noreply@novacana.de>",
        to: email,
        subject: "Vielen Dank für Ihre Anfrage bei Novacana",
        html: confirmationHtml
      });
      
      console.log("Confirmation email result:", confirmationResult);

      if (!confirmationResult.id) {
        throw new Error("Failed to send confirmation email");
      }

      // Return success response
      return new Response(
        JSON.stringify({
          success: true,
          message: "E-Mails wurden erfolgreich gesendet"
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    } catch (emailError: any) {
      console.error("Email sending error:", emailError);
      
      return new Response(
        JSON.stringify({
          success: false,
          error: "E-Mail-Versandfehler",
          details: emailError.message || "Fehler beim Versenden der E-Mails"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error: any) {
    console.error("General error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: "Server-Fehler",
        details: error.message || "Ein unerwarteter Fehler ist aufgetreten"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});

// Generate HTML for notification email
function generateNotificationEmail(name: string, email: string, pharmacyName: string, message: string): string {
  return `
  <!DOCTYPE html>
  <html lang="de">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Neue Kontaktanfrage - Novacana</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
      .container { background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; }
      .info-block { margin-bottom: 20px; padding: 15px; background-color: #f0f7f2; border-radius: 4px; }
      .message-block { margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 4px solid #4a7b57; border-radius: 4px; }
      h2 { color: #4a7b57; }
      .label { font-weight: bold; margin-right: 10px; color: #555; }
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
    
    <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
      <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
      <p>Diese Nachricht wurde über das Kontaktformular auf novacana.de gesendet.</p>
    </div>
  </body>
  </html>
  `;
}

// Generate HTML for confirmation email
function generateConfirmationEmail(name: string): string {
  return `
  <!DOCTYPE html>
  <html lang="de">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bestätigung Ihrer Anfrage bei Novacana</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
      .container { background-color: #f9f9f9; border: 1px solid #e0e0e0; border-radius: 8px; padding: 30px; }
      h2 { color: #4a7b57; }
    </style>
  </head>
  <body>
    <div class="container">
      <h2>Vielen Dank für Ihre Anfrage</h2>
      
      <p>Sehr geehrte(r) ${name},</p>
      
      <p>wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
      
      <p>Mit freundlichen Grüßen,<br>Ihr Novacana Team</p>
    </div>
    
    <div style="margin-top: 30px; font-size: 12px; color: #777; text-align: center;">
      <p>© ${new Date().getFullYear()} Novacana. Alle Rechte vorbehalten.</p>
      <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
    </div>
  </body>
  </html>
  `;
}
