import { useEffect, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase, BUCKETS } from "@/lib/supabase";
import { toast } from "sonner";
import { invalidateAll } from "@/lib/query-cache";
import {
  Card,
  Field,
  Button,
  ImageUpload,
  FormBlock,
  PageHeader,
  Save,
} from "@/components/admin-ui";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Settings = {
  id: string;
  school_name: string;
  tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
  phone1: string;
  phone2: string;
  email: string;
  fb_url: string | null;
  ig_url: string | null;
  yt_url: string | null;
  wa_number: string;
};

function SettingsPage() {
  const [data, setData] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data: rows, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (rows && rows.length) setData(rows[0] as Settings);
  }

  // Auto-save image URL to DB immediately after upload so navigating away doesn't lose it
  const autoSaveImageField = useCallback(
    async (field: "logo_url" | "favicon_url", url: string, currentData: Settings) => {
      const updated = { ...currentData, [field]: url || null };
      setData(updated);
      try {
        const { error } = await supabase
          .from("site_settings")
          .update({
            [field]: url || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", currentData.id);
        if (error) toast.error(`Auto-save failed: ${error.message}`);
        else toast.success("Image saved automatically");
      } catch (err) {
        toast.error("Auto-save failed");
      }
    },
    [],
  );

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    const { error } = await supabase
      .from("site_settings")
      .update({
        school_name: data.school_name,
        tagline: data.tagline,
        logo_url: data.logo_url,
        favicon_url: data.favicon_url,
        phone1: data.phone1,
        phone2: data.phone2,
        email: data.email,
        fb_url: data.fb_url,
        ig_url: data.ig_url,
        yt_url: data.yt_url,
        wa_number: data.wa_number,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    invalidateAll();
    toast.success("Settings saved");
  }

  if (!data) return <div className="text-muted-foreground">Loading…</div>;

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setData({ ...data, [k]: v });

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Site Settings" subtitle="Branding, contact info, and social links" />
      <FormBlock onSubmit={save}>
        <Card>
          <h3 className="font-semibold mb-4">Branding</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="School Name"
              value={data.school_name}
              onChange={(v) => set("school_name", v)}
              required
            />
            <Field label="Tagline" value={data.tagline} onChange={(v) => set("tagline", v)} />
            <div>
              <span className="block text-sm font-medium mb-1.5">Logo</span>
              <ImageUpload
                value={data.logo_url}
                onChange={(u) => autoSaveImageField("logo_url", u, data)}
                bucket={BUCKETS.logos}
                prefix="logo"
              />
              <p className="text-xs text-muted-foreground mt-1">✓ Auto-saved on upload</p>
            </div>
            <div>
              <span className="block text-sm font-medium mb-1.5">Favicon</span>
              <ImageUpload
                value={data.favicon_url}
                onChange={(u) => autoSaveImageField("favicon_url", u, data)}
                bucket={BUCKETS.logos}
                prefix="favicon"
              />
              <p className="text-xs text-muted-foreground mt-1">✓ Auto-saved on upload</p>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Contact</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Phone 1" value={data.phone1} onChange={(v) => set("phone1", v)} />
            <Field label="Phone 2" value={data.phone2} onChange={(v) => set("phone2", v)} />
            <Field
              label="Email"
              type="email"
              value={data.email}
              onChange={(v) => set("email", v)}
            />
            <Field
              label="WhatsApp Number"
              value={data.wa_number}
              onChange={(v) => set("wa_number", v)}
            />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Social Media</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Facebook URL"
              value={data.fb_url ?? ""}
              onChange={(v) => set("fb_url", v)}
              placeholder="https://facebook.com/..."
            />
            <Field
              label="Instagram URL"
              value={data.ig_url ?? ""}
              onChange={(v) => set("ig_url", v)}
              placeholder="https://instagram.com/..."
            />
            <Field
              label="YouTube URL"
              value={data.yt_url ?? ""}
              onChange={(v) => set("yt_url", v)}
              placeholder="https://youtube.com/..."
            />
          </div>
        </Card>

        <Button type="submit" disabled={saving}>
          <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Settings"}
        </Button>
      </FormBlock>
    </div>
  );
}
