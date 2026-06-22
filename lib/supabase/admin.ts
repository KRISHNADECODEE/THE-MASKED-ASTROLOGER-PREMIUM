import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Privileged Supabase client that bypasses Row Level Security.
 * SERVER ONLY — never import this into a Client Component. Use sparingly,
 * e.g. to publish the public donation transparency log or admin operations.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-role-key",
    {
      auth: { autoRefreshToken: false, persistSession: false },
    }
  );
}
