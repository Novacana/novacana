import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Struktur für die Kontaktanfrage
interface ContactRequest {
  name: string;
  email: string;
  pharmacyName?: string;
  message: string;
}

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

    // Weiterleitung an die custom-email Funktion für den tatsächlichen E-Mail-Versand
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase.functions.invoke("custom-email", {
      body: {
        type: "contact",
        name: name,
        email: email,
        pharmacyName: pharmacyName,
        message: message,
        fromEmail: "noreply@novacana.de",
        toEmail: "info@novacana.de"
      }
    });

    if (error) {
      throw new Error(error.message || "Fehler beim Senden der E-Mail");
    }

    console.log("E-Mail erfolgreich weitergeleitet:", {
      from: "noreply@novacana.de",
      to: "info@novacana.de",
      subject: `Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`,
      message: message
    });

    // Erfolgsantwort
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Kontaktanfrage erfolgreich übermittelt" 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Fehler bei der Verarbeitung der Kontaktanfrage:", error);
    
    return new Response(
      JSON.stringify({ error: "Fehler bei der Verarbeitung der Anfrage" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
