
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

    // In einer Produktionsumgebung würde hier der E-Mail-Versand erfolgen
    // z.B. mit Resend, SendGrid oder einem anderen E-Mail-Service

    // Simulierter E-Mail-Versand (im Log sichtbar)
    console.log("E-Mail würde gesendet werden an:", "info@novacana.de");
    console.log("Von:", email);
    console.log("Betreff:", `Kontaktanfrage von ${name} ${pharmacyName ? `(${pharmacyName})` : ""}`);
    console.log("Inhalt:", message);

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
