// app/api/logout/route.js
import { NextResponse } from "next/server";

export async function GET(req) {
  const res = NextResponse.redirect(new URL("/", req.url));

  res.cookies.set("auth", "", {
    httpOnly: true,
    path: "/",
    maxAge: 0, // Expire immediately
  });

  return res;
}
// This will clear the auth cookie and redirect to the login page
// The cookie is set to expire immediately, effectively logging the user out
// The GET method is used here to handle logout requests, which is a common practice