
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.3";
import { Resend } from "npm:resend@2.0.0";
import { 
  getConfirmationEmailTemplate, 
  getResetPasswordEmailTemplate, 
  getContactFormEmailTemplate 
} from "./email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Resend client for email sending
const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

// Erstellen des Supabase-Clients mit der Admin-Rolle
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // CORS-Preflight-Anforderungen behandeln
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData = await req.json();
    const { 
      email, 
      type, 
      name, 
      pharmacyName, 
      message, 
      fromEmail = "noreply@novacana.de",
      toEmail = "info@novacana.de",
      redirectTo = `${new URL(req.url).origin}/login` 
    } = requestData;

    if (!email && type !== "contact") {
      return new Response(
        JSON.stringify({ error: "E-Mail ist erforderlich" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    let emailTemplate = "";
    let emailResponse;
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
      
      emailResponse = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Bestätigen Sie Ihre Registrierung bei Novacana",
        html: emailTemplate
      });
      
      console.log("Registrierungs-E-Mail gesendet:", emailResponse);
      
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
      
      emailResponse = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Passwort zurücksetzen für Ihren Novacana-Zugang",
        html: emailTemplate
      });
      
      console.log("Passwort-Reset-E-Mail gesendet:", emailResponse);
      
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
      
      emailResponse = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: `Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`,
        html: emailTemplate,
        reply_to: email
      });
      
      console.log("Kontaktformular-E-Mail gesendet:", emailResponse);
      
      // Bestätigungs-E-Mail an den Absender senden
      const confirmationResponse = await resend.emails.send({
        from: fromEmail,
        to: email,
        subject: "Vielen Dank für Ihre Anfrage bei Novacana",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Vielen Dank für Ihre Anfrage</h2>
            <p>Sehr geehrte(r) ${name},</p>
            <p>wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
            <p>Mit freundlichen Grüßen,<br>Ihr Novacana Team</p>
          </div>
        `
      });
      
      console.log("Bestätigungs-E-Mail gesendet:", confirmationResponse);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Kontaktanfrage wurde an ${toEmail} weitergeleitet`,
          emailId: emailResponse.id,
          confirmationId: confirmationResponse.id
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

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `E-Mail vom Typ ${type} wurde an ${type === "contact" ? toEmail : email} gesendet`,
        emailId: emailResponse.id
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
