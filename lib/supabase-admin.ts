type PortalUserPayload = {
  email: string;
  name: string;
  picture?: string;
  role?: string;
  status?: string;
  login_method?: string;
  last_login?: string;
  password_hash?: string;
};

export type PortalUserRecord = {
  id: string;
  email: string;
  name: string | null;
  picture: string | null;
  role: string | null;
  status: string | null;
  login_method: string | null;
  last_login: string | null;
  password_hash?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ''), serviceRoleKey };
}

function getSupabaseHeaders(config: { serviceRoleKey: string }) {
  return {
    apikey: config.serviceRoleKey,
    Authorization: `Bearer ${config.serviceRoleKey}`
  };
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

function normalizeRole(role?: string | null) {
  return role === 'admin' || role === 'super_admin' ? role : 'user';
}

function safeErrorDetail(error: unknown) {
  return error instanceof Error ? error.message : String(error || 'Unknown error');
}

export async function getPortalUserByEmail(email: string): Promise<PortalUserRecord | null> {
  const config = getSupabaseConfig();

  if (!config) {
    return null;
  }

  try {
    const cleanEmail = email.toLowerCase().trim();
    const response = await fetch(
      `${config.url}/rest/v1/portal_users?email=eq.${encodeURIComponent(cleanEmail)}&select=*&limit=1`,
      {
        headers: getSupabaseHeaders(config),
        cache: 'no-store'
      }
    );

    if (!response.ok) {
      const details = await response.text();
      console.error('Unable to read portal user from Supabase:', details);
      return null;
    }

    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Supabase user lookup failed during auth:', safeErrorDetail(error));
    return null;
  }
}

export async function upsertPortalUser(user: PortalUserPayload) {
  const config = getSupabaseConfig();

  if (!config) {
    return { saved: false, reason: 'Supabase is not configured' };
  }

  try {
    const now = new Date().toISOString();
    const cleanEmail = user.email.toLowerCase().trim();
    const existingUser = await getPortalUserByEmail(cleanEmail);
    const payload: Record<string, unknown> = {
      email: cleanEmail,
      name: user.name,
      picture: user.picture ?? existingUser?.picture ?? null,
      role: normalizeRole(existingUser?.role ?? user.role),
      status: existingUser?.status ?? user.status ?? 'active',
      login_method: user.login_method ?? existingUser?.login_method ?? 'google',
      last_login: user.last_login ?? now,
      updated_at: now
    };

    if (user.password_hash) {
      payload.password_hash = user.password_hash;
    }

    const response = await fetch(`${config.url}/rest/v1/portal_users?on_conflict=email`, {
      method: 'POST',
      headers: {
        ...getSupabaseHeaders(config),
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=representation'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('Unable to save portal user in Supabase:', details);
      return { saved: false, reason: details };
    }

    const data = await response.json();
    return { saved: true, user: Array.isArray(data) ? data[0] : data };
  } catch (error) {
    const reason = safeErrorDetail(error);
    console.error('Supabase user save failed during auth:', reason);
    return { saved: false, reason };
  }
}

export async function listPortalUsers(): Promise<PortalUserRecord[]> {
  const config = getSupabaseConfig();

  if (!config) {
    return [];
  }

  try {
    const response = await fetch(`${config.url}/rest/v1/portal_users?select=*&order=last_login.desc`, {
      headers: getSupabaseHeaders(config),
      cache: 'no-store'
    });

    if (!response.ok) {
      const details = await response.text();
      console.error('Unable to list portal users from Supabase:', details);
      return [];
    }

    return response.json();
  } catch (error) {
    console.error('Supabase user list failed:', safeErrorDetail(error));
    return [];
  }
}
