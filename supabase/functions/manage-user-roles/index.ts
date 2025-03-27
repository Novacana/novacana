
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

// Definiere erlaubte Rollen
type AppRole = 'admin' | 'user' | 'pharmacist'

// CORS-Header für Cross-Origin-Anfragen
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export const handler = async (req: Request) => {
  // CORS-Präflug-Anfragen verarbeiten
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Anfragedaten verarbeiten
    const { action, userId, role } = await req.json();
    
    console.log(`Edge-Funktion aufgerufen - Aktion: ${action}, Benutzer: ${userId}, Rolle: ${role}`);

    if (!userId || !role || !action) {
      return new Response(
        JSON.stringify({ error: 'Benutzer-ID, Rolle und Aktion sind erforderlich' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Überprüfen, ob die Rolle gültig ist
    if (!['admin', 'user', 'pharmacist'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Ungültige Rolle. Erlaubte Rollen: admin, user, pharmacist' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Supabase-Client mit SERVICE_ROLE erstellen (hat höhere Berechtigungen)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    let result;
    
    // Aktion basierend auf dem Parameter ausführen
    if (action === 'add') {
      // Prüfen, ob die Rolle bereits existiert
      const { data: existingRole, error: checkError } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', role)
        .maybeSingle();
      
      if (checkError) {
        console.error("Fehler beim Prüfen auf existierende Rolle:", checkError);
        throw checkError;
      }
      
      // Wenn die Rolle bereits existiert, keine Änderung notwendig
      if (existingRole) {
        console.log(`Rolle ${role} existiert bereits für diesen Benutzer`);
        return new Response(
          JSON.stringify({ success: true, message: 'Rolle existiert bereits' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Rolle hinzufügen
      const { data, error } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: userId,
          role: role as AppRole
        })
        .select();
      
      if (error) {
        console.error("Fehler beim Hinzufügen der Rolle:", error);
        throw error;
      }
      
      result = { success: true, data };
      console.log(`Rolle ${role} erfolgreich hinzugefügt:`, data);
    } 
    else if (action === 'remove') {
      const { data, error } = await supabaseAdmin
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role)
        .select();
      
      if (error) {
        console.error("Fehler beim Entfernen der Rolle:", error);
        throw error;
      }
      
      result = { success: true, data };
      console.log(`Rolle ${role} erfolgreich entfernt:`, data);
    }
    else {
      return new Response(
        JSON.stringify({ error: 'Ungültige Aktion. Erlaubte Aktionen: add, remove' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Fehler bei der Verarbeitung:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
