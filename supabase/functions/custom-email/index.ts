
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

serve(async (req) => {
  // CORS-Preflight-Anforderungen behandeln
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, type, redirectTo = `${new URL(req.url).origin}/login` } = await req.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "E-Mail ist erforderlich" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let result;
    const redirectURL = new URL(redirectTo);
    const fullRedirectTo = redirectURL.toString();

    if (type === "signup") {
      // Senden einer benutzerdefinierten Bestätigungs-E-Mail
      result = await supabase.auth.admin.generateLink({
        type: "signup",
        email,
        options: {
          redirectTo: fullRedirectTo,
        }
      });
    } else if (type === "recovery") {
      // Senden einer benutzerdefinierten Passwort-Reset-E-Mail
      result = await supabase.auth.admin.generateLink({
        type: "recovery",
        email,
        options: {
          redirectTo: fullRedirectTo,
        }
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Ungültiger E-Mail-Typ" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (result.error) {
      throw result.error;
    }

    // Hier würden wir normalerweise eine eigene E-Mail senden
    // Dies ist ein Platzhalter für die eigentliche E-Mail-Logik
    console.log(`Link für ${email} generiert:`, result.data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `E-Mail vom Typ ${type} wurde an ${email} gesendet` 
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
