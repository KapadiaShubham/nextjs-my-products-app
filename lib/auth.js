// lib/auth.js
export function isAuthenticated(req) {
  try {
    return req.cookies.get('auth')?.value === 'true';
  } catch {
    return false;
  }
}
