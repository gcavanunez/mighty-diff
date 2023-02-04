import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session/edge";
import { ironOptions } from "./server/common/iron-session-options";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const session = await getIronSession(request, response, ironOptions);
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session.user?.id) {
      // return NextResponse.redirect(new URL("/auth/login", request.url));
      const redirect = NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
      redirect.cookies.set({
        name: "wanted-url",
        value: request.url,
      });
      return redirect;
    }
  }
  if (request.nextUrl.pathname.startsWith("/auth")) {
    if (session.user?.id) {
      const redirect = NextResponse.redirect(
        new URL("/dashboard", request.url)
      );
      return redirect;
    }
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
