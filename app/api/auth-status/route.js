// app/api/auth-status/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const loggedIn = req.cookies.get('auth')?.value === 'true';
  return NextResponse.json({ loggedIn });
}
