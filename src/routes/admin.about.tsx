import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, Field, Button, FormBlock, PageHeader, Save } from "@/components/admin-ui";

export const Route = createFileRoute("/admin/about")({
  component: AboutPage,
});

type About = { id: string; who_we_are_text: string; mission: string; vision: string };

function AboutPage() {
  const [data, setData] = useState<About | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data: rows, error } = await supabase
      .from("about_content")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (rows && rows.length) setData(rows[0] as About);
    else {
      const { data: ins, error: insErr } = await supabase
        .from("about_content")
        .insert({ who_we_are_text: "", mission: "", vision: "" })
        .select()
        .maybeSingle();
      if (insErr) {
        toast.error(insErr.message);
        return;
      }
      if (ins) setData(ins as About);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    const { error } = await supabase
      .from("about_content")
      .update({
        who_we_are_text: data.who_we_are_text,
        mission: data.mission,
        vision: data.vision,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("About saved");
  }

  if (!data) return <div className="text-muted-foreground">Loading…</div>;
  const set = <K extends keyof About>(k: K, v: About[K]) => setData({ ...data, [k]: v });

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="About Us" subtitle="Edit who we are, mission and vision" />
      <FormBlock onSubmit={save}>
        <Card>
          <Field
            label="Who We Are"
            value={data.who_we_are_text}
            onChange={(v) => set("who_we_are_text", v)}
            textarea
            rows={5}
          />
        </Card>
        <Card>
          <Field
            label="Mission"
            value={data.mission}
            onChange={(v) => set("mission", v)}
            textarea
            rows={3}
          />
        </Card>
        <Card>
          <Field
            label="Vision"
            value={data.vision}
            onChange={(v) => set("vision", v)}
            textarea
            rows={3}
          />
        </Card>
        <Button type="submit" disabled={saving}>
          <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save About"}
        </Button>
      </FormBlock>
    </div>
  );
}
