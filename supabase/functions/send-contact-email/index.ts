
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { EmailService } from "./email-service.ts";
import { getConfirmationEmailTemplate, getNotificationEmailTemplate } from "./email-templates.ts";

// CORS headers configuration
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Interface for contact form request data
interface ContactRequest {
  name: string;
  email: string;
  pharmacyName?: string;
  message: string;
}

// Main function handler
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse request body
    const body: ContactRequest = await req.json();
    const { name, email, pharmacyName, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ 
          error: "Name, E-Mail und Nachricht sind erforderlich",
          description: "Bitte füllen Sie alle Pflichtfelder aus"
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
      return new Response(
        JSON.stringify({ 
          error: "Ungültige E-Mail-Adresse", 
          description: "Bitte geben Sie eine gültige E-Mail-Adresse ein" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Log contact form submission details
    console.log("Kontaktformular gesendet von:", name);
    console.log("E-Mail:", email);
    console.log("Apotheke:", pharmacyName || "Nicht angegeben");
    console.log("Nachricht:", message);

    // Check if RESEND_API_KEY is set
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY ist nicht konfiguriert");
      return new Response(
        JSON.stringify({ 
          error: "Server-Konfigurationsfehler", 
          description: "E-Mail-Service ist nicht richtig konfiguriert" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Initialize email service with Resend API key
    const emailService = new EmailService(resendApiKey);

    // Generate email templates
    const notificationTemplate = getNotificationEmailTemplate(name, email, pharmacyName || "", message);
    const confirmationTemplate = getConfirmationEmailTemplate(name);

    try {
      // Send notification email to Novacana
      const notificationEmail = await emailService.sendNotificationEmail(
        email,
        `Neue Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`,
        notificationTemplate
      );
      
      // Log notification email response
      console.log("Benachrichtigungs-E-Mail gesendet:", notificationEmail);

      // Send confirmation email to the sender
      const confirmationEmail = await emailService.sendConfirmationEmail(
        email,
        name,
        confirmationTemplate
      );
      
      // Log confirmation email response
      console.log("Bestätigungs-E-Mail gesendet:", confirmationEmail);

      // Return success response
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
    } catch (emailError: any) {
      console.error("Fehler beim Senden der E-Mail:", emailError);
      
      return new Response(
        JSON.stringify({ 
          error: "E-Mail konnte nicht gesendet werden", 
          description: emailError.message || "Fehler beim E-Mail-Versand"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }
  } catch (error: any) {
    // Log and return error response
    console.error("Fehler bei der Verarbeitung der Kontaktanfrage:", error);
    
    return new Response(
      JSON.stringify({ 
        error: "Fehler bei der Verarbeitung der Anfrage",
        description: error.message || "Ein unerwarteter Fehler ist aufgetreten"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
