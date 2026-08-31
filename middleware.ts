import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
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

export default async function middleware(req: NextRequest, event: any) {
  if (!hasClerkKeys) {
    console.warn(
      "[CLERK_MIDDLEWARE] Missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY or CLERK_SECRET_KEY. Please configure them in your production environment variables."
    );
    return NextResponse.next();
  }

  return clerkMiddleware(async (auth, request) => {
    if (!isPublicRoute(request)) {
      const { userId, redirectToSignIn } = await auth();
      if (!userId) {
        return redirectToSignIn({ returnBackUrl: request.url });
      }
    }
  })(req, event);
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    "/__clerk/:path*",
  ],
};
