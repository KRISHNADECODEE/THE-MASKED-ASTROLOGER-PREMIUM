import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Next 16 renamed the `middleware` file convention to `proxy`.
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public asset folders (brand, zodiacs) and common image extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|brand|zodiacs|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
