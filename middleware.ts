import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * 1. /api (API routes)
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico, /uploads/...)
     */
    "/((?!api/|_next/|_static/|uploads/|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get("host") || "";

  // Define root/platform domains
  const appDomains = [
    "localhost:3000",
    "127.0.0.1:3000",
    process.env.NEXT_PUBLIC_APP_DOMAIN,
  ].filter(Boolean);

  const isRootDomain = appDomains.some((d) => hostname === d || hostname.endsWith(`.${d}`));

  // 1. Direct path requests (e.g. /tenant/[tenantId], /api, admin dashboard /)
  if (url.pathname.startsWith("/tenant/") || url.pathname === "/" || url.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // 2. Custom Domain / Subdomain rewriting for production
  // If the request comes from a custom domain (e.g. acme.com or brand.yourplatform.com)
  const currentHost = hostname.replace(/:\d+$/, ""); // strip port for local testing

  // Subdomain parsing (e.g., brand1.localhost:3000 -> brand1)
  const isSubdomain =
    hostname.includes(".localhost") ||
    (process.env.NEXT_PUBLIC_ROOT_DOMAIN &&
      hostname.endsWith(`.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`));

  if (isSubdomain) {
    const subdomain = currentHost.split(".")[0];
    // Rewrite path to tenant route
    const path = url.pathname === "/" ? "" : url.pathname;
    return NextResponse.rewrite(new URL(`/tenant/${subdomain}${path}`, req.url));
  }

  return NextResponse.next();
}
