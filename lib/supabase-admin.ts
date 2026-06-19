type PortalUserPayload = {
  email: string;
  name: string;
  picture?: string;
  role?: string;
  status?: string;
  login_method?: string;
  last_login?: string;
};

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url: url.replace(/\/$/, ''), serviceRoleKey };
}

export function isSupabaseConfigured() {
  return Boolean(getSupabaseConfig());
}

export async function upsertPortalUser(user: PortalUserPayload) {
  const config = getSupabaseConfig();

  if (!config) {
    return { saved: false, reason: 'Supabase is not configured' };
  }

  const now = new Date().toISOString();
  const payload = {
    email: user.email.toLowerCase(),
    name: user.name,
    picture: user.picture ?? null,
    role: user.role ?? 'user',
    status: user.status ?? 'active',
    login_method: user.login_method ?? 'google',
    last_login: user.last_login ?? now,
    updated_at: now
  };

  const response = await fetch(`${config.url}/rest/v1/portal_users?on_conflict=email`, {
    method: 'POST',
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
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
}

export async function listPortalUsers() {
  const config = getSupabaseConfig();

  if (!config) {
    return [];
  }

  const response = await fetch(`${config.url}/rest/v1/portal_users?select=*&order=last_login.desc`, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`
    },
    cache: 'no-store'
  });

  if (!response.ok) {
    const details = await response.text();
    console.error('Unable to list portal users from Supabase:', details);
    return [];
  }

  return response.json();
}
