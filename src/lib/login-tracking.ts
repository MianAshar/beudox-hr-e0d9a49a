import { supabase } from '@/integrations/supabase/client';

/** Detect device type from userAgent. */
function detectDeviceType(ua: string): 'Mobile' | 'Tablet' | 'Desktop' {
  if (/iPad|Tablet|PlayBook|Silk/i.test(ua)) return 'Tablet';
  if (/Mobile|Android|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) return 'Mobile';
  return 'Desktop';
}

/** Detect browser name from userAgent. */
function detectBrowser(ua: string): string {
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera';
  if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) return 'Chrome';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/MSIE|Trident/i.test(ua)) return 'Internet Explorer';
  return 'Unknown';
}

/** Detect operating system from userAgent. */
function detectOs(ua: string): string {
  if (/Windows NT 10/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT/i.test(ua)) return 'Windows';
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macOS';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown';
}

interface IpInfo {
  ip: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
}

async function fetchIpAndLocation(): Promise<IpInfo> {
  const empty: IpInfo = { ip: null, city: null, region: null, country: null, latitude: null, longitude: null };
  try {
    const ipRes = await fetch('https://api.ipify.org?format=json');
    if (!ipRes.ok) return empty;
    const { ip } = await ipRes.json();
    if (!ip) return empty;

    try {
      const locRes = await fetch(`https://ipapi.co/${ip}/json/`);
      if (!locRes.ok) return { ...empty, ip };
      const loc = await locRes.json();
      return {
        ip,
        city: loc.city ?? null,
        region: loc.region ?? null,
        country: loc.country_name ?? null,
        latitude: typeof loc.latitude === 'number' ? loc.latitude : null,
        longitude: typeof loc.longitude === 'number' ? loc.longitude : null,
      };
    } catch {
      return { ...empty, ip };
    }
  } catch {
    return empty;
  }
}

/**
 * Track a successful login: capture IP, geolocation, and device info,
 * then insert into login_logs and update employees.last_login_at.
 *
 * Runs fully async; never throws — login flow proceeds even if tracking fails.
 */
export async function trackLogin(authUserId: string): Promise<void> {
  try {
    // Fetch employee record (id + company_id) for the auth user
    const { data: emp } = await supabase
      .from('employees')
      .select('id, company_id')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (!emp) return;

    const ua = navigator.userAgent || '';
    const deviceInfo = {
      user_agent: ua,
      device_type: detectDeviceType(ua),
      browser: detectBrowser(ua),
      os: detectOs(ua),
    };

    const ipInfo = await fetchIpAndLocation();

    await supabase.from('login_logs').insert({
      auth_user_id: authUserId,
      employee_id: emp.id,
      company_id: emp.company_id,
      ip_address: ipInfo.ip,
      city: ipInfo.city,
      region: ipInfo.region,
      country: ipInfo.country,
      latitude: ipInfo.latitude,
      longitude: ipInfo.longitude,
      ...deviceInfo,
    });

    await supabase
      .from('employees')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', emp.id);
  } catch (err) {
    // Never block login — silently fail
    console.warn('[login-tracking] Failed to record login', err);
  }
}
