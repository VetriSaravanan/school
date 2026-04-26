import { createClient } from "@supabase/supabase-js";

/**
 * EXTERNAL SUPABASE CONFIG
 * -------------------------
 * 1. Go to your Supabase dashboard → Project Settings → API
 * 2. Copy the "Project URL" and paste it below as SUPABASE_URL
 * 3. The publishable key below is the one you provided
 *
 * NEVER paste the SECRET key here — it bypasses RLS and would be exposed
 * to every visitor in the browser bundle. The secret key you shared in
 * chat should be ROTATED in your Supabase dashboard immediately.
 */
const SUPABASE_URL = "https://vccmipedghdpynggsnma.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_gEyZpzyR2Pi2XF_UTiMzog_04IcJaAC";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storageKey: "payitragam-auth",
  },
});

export const SUPABASE_CONFIGURED = true;

export const BUCKETS = {
  logos: "logos",
  gallery: "gallery",
  team: "team-photos",
  blogs: "blog-covers",
  sections: "section-photos",
  hero: "hero-images",
} as const;

export async function uploadFile(bucket: string, file: File, prefix = ""): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${prefix}${prefix ? "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
