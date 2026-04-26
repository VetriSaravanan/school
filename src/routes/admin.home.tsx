import { useEffect, useState, useCallback } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase, BUCKETS } from "@/lib/supabase";
import { toast } from "sonner";
import { invalidateQuery } from "@/lib/query-cache";
import {
  Card,
  Field,
  Button,
  ImageUpload,
  FormBlock,
  PageHeader,
  Save,
  NumberField,
} from "@/components/admin-ui";

export const Route = createFileRoute("/admin/home")({
  component: HomePage,
});

type Home = {
  id: string;
  hero_title: string;
  hero_subtitle: string;
  hero_bg_url: string | null;
  hero_visual_url: string | null;
  cta1_text: string;
  cta1_link: string;
  cta2_text: string;
  cta2_link: string;
  programs_label: string;
  programs_title: string;
  programs_subtitle: string;
  stat_years: number;
  stat_students: number;
  stat_teachers: number;
  stat_branches: number;
};

function HomePage() {
  const [data, setData] = useState<Home | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data: rows, error } = await supabase
      .from("home_content")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (rows && rows.length) setData(rows[0] as Home);
  }

  // Auto-save hero bg image immediately to DB on upload
  const autoSaveHeroBg = useCallback(async (url: string, currentData: Home) => {
    setData({ ...currentData, hero_bg_url: url || null });
    try {
      const { error } = await supabase
        .from("home_content")
        .update({
          hero_bg_url: url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentData.id);
      if (error) toast.error(`Auto-save failed: ${error.message}`);
      else toast.success("Hero image saved automatically");
    } catch {
      toast.error("Auto-save failed");
    }
  }, []);

  // Auto-save hero visual image immediately to DB on upload
  const autoSaveHeroVisual = useCallback(async (url: string, currentData: Home) => {
    setData({ ...currentData, hero_visual_url: url || null });
    try {
      const { error } = await supabase
        .from("home_content")
        .update({
          hero_visual_url: url || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", currentData.id);
      if (error) toast.error(`Auto-save failed: ${error.message}`);
      else toast.success("Hero visual saved automatically");
    } catch {
      toast.error("Auto-save failed");
    }
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    const { id, ...rest } = data;
    const { error } = await supabase
      .from("home_content")
      .update({ ...rest, updated_at: new Date().toISOString() })
      .eq("id", id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    invalidateQuery("home_content");
    toast.success("Home content saved");
  }

  if (!data) return <div className="text-muted-foreground">Loading…</div>;
  const set = <K extends keyof Home>(k: K, v: Home[K]) => setData({ ...data, [k]: v });

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Home Section" subtitle="Hero, CTAs and homepage stats" />
      <FormBlock onSubmit={save}>
        <Card>
          <h3 className="font-semibold mb-4">Hero</h3>
          <div className="space-y-4">
            <Field
              label="Title"
              value={data.hero_title}
              onChange={(v) => set("hero_title", v)}
              required
            />
            <Field
              label="Subtitle"
              value={data.hero_subtitle}
              onChange={(v) => set("hero_subtitle", v)}
              textarea
            />
            <div>
              <span className="block text-sm font-medium mb-1.5">Hero Background Image</span>
              <ImageUpload
                value={data.hero_bg_url}
                onChange={(u) => autoSaveHeroBg(u, data)}
                bucket={BUCKETS.hero}
              />
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                ✓ Auto-saved on upload — won't disappear when navigating
              </p>

              <span className="block text-sm font-medium mb-1.5 mt-2">Hero Foreground/Visual Image (Transparent PNG)</span>
              <ImageUpload
                value={data.hero_visual_url}
                onChange={(u) => autoSaveHeroVisual(u, data)}
                bucket={BUCKETS.hero}
              />
              <p className="text-xs text-muted-foreground mt-1 mb-4">
                ✓ Auto-saved. Use a transparent PNG for the main hero visual (e.g., boy reading book).
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Field
                label="CTA 1 Text"
                value={data.cta1_text}
                onChange={(v) => set("cta1_text", v)}
              />
              <Field
                label="CTA 1 Link"
                value={data.cta1_link}
                onChange={(v) => set("cta1_link", v)}
              />
              <Field
                label="CTA 2 Text"
                value={data.cta2_text}
                onChange={(v) => set("cta2_text", v)}
              />
              <Field
                label="CTA 2 Link"
                value={data.cta2_link}
                onChange={(v) => set("cta2_link", v)}
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-4">Stats Counter</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <NumberField
              label="Years"
              value={data.stat_years}
              onChange={(v) => set("stat_years", v)}
            />
            <NumberField
              label="Students"
              value={data.stat_students}
              onChange={(v) => set("stat_students", v)}
            />
            <NumberField
              label="Teachers"
              value={data.stat_teachers}
              onChange={(v) => set("stat_teachers", v)}
            />
            <NumberField
              label="Branches"
              value={data.stat_branches}
              onChange={(v) => set("stat_branches", v)}
            />
          </div>
        </Card>

        <Button type="submit" disabled={saving}>
          <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Home"}
        </Button>
      </FormBlock>
    </div>
  );
}
