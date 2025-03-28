
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

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
    // Supabase-Client mit SERVICE_ROLE erstellen (hat höhere Berechtigungen)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // Alle Benutzer holen
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (usersError) {
      console.error("Fehler beim Abrufen der Benutzer:", usersError);
      throw usersError;
    }
    
    // Alle Benutzerrollen holen
    const { data: rolesData, error: rolesError } = await supabaseAdmin
      .from('user_roles')
      .select('*');
    
    if (rolesError) {
      console.error("Fehler beim Abrufen der Benutzerrollen:", rolesError);
      throw rolesError;
    }
    
    // Rollen nach Benutzer-ID gruppieren
    const rolesByUserId: Record<string, string[]> = {};
    rolesData?.forEach((role: any) => {
      if (!rolesByUserId[role.user_id]) {
        rolesByUserId[role.user_id] = [];
      }
      rolesByUserId[role.user_id].push(role.role);
    });
    
    // Benutzerdaten mit Rollen kombinieren
    const formattedUsers = users?.users.map((user: any) => ({
      id: user.id,
      email: user.email || 'Keine E-Mail',
      roles: rolesByUserId[user.id] || []
    })) || [];
    
    return new Response(
      JSON.stringify({ users: formattedUsers }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Fehler bei der Verarbeitung:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
}
