import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { configs } from "./app/lib/config";
export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: configs.nextAuthSecret as string });
  if(!token) return NextResponse.redirect(new URL("/api/auth/signin", req.url))
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/rooms", "/rooms/:id"],
};
