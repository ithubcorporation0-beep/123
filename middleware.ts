import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/services(.*)",
  "/courses(.*)",
  "/instructors(.*)",
  "/pricing",
  "/contact",
  "/faq",
  "/verify(.*)",
  "/login(.*)",
  "/register(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/admin/login(.*)",
  "/api/admin/auth(.*)",
  "/api/admin/logout(.*)",
  "/api/courses(.*)",
  "/api/categories(.*)",
  "/api/certificates/verify(.*)",
  "/api/webhook(.*)",
  "/api/webhooks(.*)",
]);

const hasClerkKeys = Boolean(
  (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_PUBLISHABLE_KEY) &&
  process.env.CLERK_SECRET_KEY
);

const defaultMiddleware = async (req: NextRequest) => {
  const adminToken = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAdminAuthenticated = await verifyAdminToken(adminToken);

  if (isAdminAuthenticated) {
    if (req.nextUrl.pathname === "/admin/login") {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  if (req.nextUrl.pathname.startsWith("/admin") && req.nextUrl.pathname !== "/admin/login") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
};

export default hasClerkKeys
  ? clerkMiddleware(async (auth, request) => {
      const adminToken = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
      const isAdminAuthenticated = await verifyAdminToken(adminToken);

      if (isAdminAuthenticated) {
        if (request.nextUrl.pathname === "/admin/login") {
          return NextResponse.redirect(new URL("/admin", request.url));
        }
        return NextResponse.next();
      }

      if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      if (!isPublicRoute(request)) {
        const { userId, redirectToSignIn } = await auth();
        if (!userId) {
          return redirectToSignIn({ returnBackUrl: request.url });
        }
      }
    })
  : defaultMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
