import { NextResponse, NextRequest } from "next/server";

export async function middleware(req, ev) {
  const protectedPages = [
    {
      path: "/room",
      queryMode: "CONTAINS",
    },
    {
      path: "/",
      queryMode: "EQUALS",
    },
  ];

  const { pathname } = req.nextUrl;
  const password = req.cookies.password;
  const userName = req.cookies.userName;

  // Exclude all API routes
  if (pathname.includes("/api/")) return NextResponse.next();

  // Only do validation for protected pages
  const isProtected = protectedPages.some((p) => {
    switch (p.queryMode) {
      case "CONTAINS":
        return pathname.includes(p.path);
      case "EQUALS":
        return pathname === p.path;
      default:
        return false;
    }
  });

  if (pathname !== "/login") {
    // Check if the user has entered the correct password
    if (password !== process.env.PASSWORD) {
      return NextResponse.redirect("/login");
    }
  }

  // Username is required to enter room
  if (pathname.includes("/room")) {
    if (!userName) NextResponse.redirect("/");
  }

  // Default
  return NextResponse.next();
}
