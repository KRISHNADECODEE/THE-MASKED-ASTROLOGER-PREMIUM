import { createClient } from "./server";
import { createAdminClient } from "./admin";

export const BUCKETS = {
  proofPhotos: "proof-photos",
  kundliPdfs: "kundli-pdfs",
} as const;

/**
 * Upload a street-dog donation proof photo. Admin-only (service role) — the
 * `proof-photos` bucket is world-readable but only the service role may write.
 * Returns the public URL of the uploaded image.
 */
export async function uploadProofPhoto(
  file: ArrayBuffer | Blob,
  fileName: string,
  contentType = "image/jpeg"
): Promise<string> {
  const admin = createAdminClient();
  const path = `${Date.now()}-${fileName}`;

  const { error } = await admin.storage
    .from(BUCKETS.proofPhotos)
    .upload(path, file, { contentType, upsert: false });
  if (error) throw error;

  const { data } = admin.storage.from(BUCKETS.proofPhotos).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload a generated kundli PDF into the signed-in user's private folder
 * (`kundli-pdfs/<userId>/<file>.pdf`) and return a time-limited signed URL.
 * Relies on the logged-in user's session (RLS scopes objects to their folder).
 */
export async function uploadKundliPdf(
  pdf: ArrayBuffer | Blob,
  fileName: string
): Promise<{ path: string; signedUrl: string | null }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const path = `${user.id}/${fileName}`;
  const { error } = await supabase.storage
    .from(BUCKETS.kundliPdfs)
    .upload(path, pdf, { contentType: "application/pdf", upsert: true });
  if (error) throw error;

  const { data } = await supabase.storage
    .from(BUCKETS.kundliPdfs)
    .createSignedUrl(path, 60 * 60); // 1 hour

  return { path, signedUrl: data?.signedUrl ?? null };
}
