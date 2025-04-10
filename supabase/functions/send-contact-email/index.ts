
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
        JSON.stringify({ error: "Name, E-Mail und Nachricht sind erforderlich" }),
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

    // Initialize email service with Resend API key
    const emailService = new EmailService(Deno.env.get("RESEND_API_KEY") || "");

    // Generate email templates
    const notificationTemplate = getNotificationEmailTemplate(name, email, pharmacyName || "", message);
    const confirmationTemplate = getConfirmationEmailTemplate(name);

    // Send notification email to Novacana
    const notificationEmail = await emailService.sendNotificationEmail(
      email,
      `Neue Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`,
      notificationTemplate
    );

    // Send confirmation email to the sender
    const confirmationEmail = await emailService.sendConfirmationEmail(
      email,
      name,
      confirmationTemplate
    );

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
  } catch (error) {
    // Log and return error response
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
