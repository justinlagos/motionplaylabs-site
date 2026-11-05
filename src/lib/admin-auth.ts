// Sign-in for /admin/: HTTP Basic auth against ADMIN_USER (default "justin") and ADMIN_PASSWORD,
// both set in Vercel. With no ADMIN_PASSWORD the admin pages do not exist (404), so a missing
// secret can never leave them open. src/proxy.ts checks first; each admin page checks again.

export const adminEnabled = () => Boolean(process.env.ADMIN_PASSWORD);

function same(a: string, b: string) {
  let diff = a.length ^ b.length;
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) diff |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return diff === 0;
}

export function adminAllowed(authorization: string | null | undefined) {
  const pass = process.env.ADMIN_PASSWORD;
  const user = process.env.ADMIN_USER || "justin";
  if (!pass || !authorization || !authorization.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    decoded = atob(authorization.slice(6).trim());
  } catch {
    return false;
  }
  const i = decoded.indexOf(":");
  if (i < 0) return false;
  // check both parts every time, so a wrong user name takes as long as a wrong password
  const u = same(decoded.slice(0, i), user);
  const p = same(decoded.slice(i + 1), pass);
  return u && p;
}
