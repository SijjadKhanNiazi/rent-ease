import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define strict protected layouts inside our architecture mapping
const isDashboardRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/invoices(.*)",
  "/properties(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isDashboardRoute(req)) {
    // Force immediate authentication lookup wall
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.[^?]*$$).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
