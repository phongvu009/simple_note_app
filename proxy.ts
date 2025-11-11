// proxy.ts
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  // Handle preflight OPTIONS request first (important for CORS)
  if (request.method === "OPTIONS") {
    const response = new NextResponse(null, { status: 204 });
    response.headers.set("Access-Control-Allow-Origin", "http://192.168.68.70");
    response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");
    return response;
  }

  // 🔐 Optional: session check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ✅ Allow CORS for other requests
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "http://192.168.68.70");
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

// ✅ Important: this defines where the middleware applies
export const config = {
  matcher: ["/dashboard/:path*"], // You can adjust to your routes
};
