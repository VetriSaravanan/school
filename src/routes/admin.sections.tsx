import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase, BUCKETS, uploadFile } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Card,
  Field,
  Button,
  PageHeader,
  Save,
  Trash2,
  Upload,
  Plus,
  X,
  ConfirmDelete,
} from "@/components/admin-ui";

export const Route = createFileRoute("/admin/sections")({
  component: SectionsPage,
});

type Section = {
  id: string;
  section_key: string;
  title: string;
  description: string;
  features: string[];
};

function SectionsPage() {
  const [activeKey, setActiveKey] = useState("playground");
  const [data, setData] = useState<Section | null>(null);
  const [newFeature, setNewFeature] = useState("");
  const [saving, setSaving] = useState(false);
  const [delKey, setDelKey] = useState<string | null>(null);

  const [homeData, setHomeData] = useState<any>(null);
  const [savingHome, setSavingHome] = useState(false);

  const [keys, setKeys] = useState<{ key: string; label: string }>([
    { key: "playground", label: "Playground" },
    { key: "nursery", label: "Nursery" },
    { key: "junior_kg", label: "Junior KG" },
    { key: "senior_kg", label: "Senior KG" },
  ]);

  useEffect(() => {
    supabase
      .from("home_content")
      .select("*")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setHomeData(data);
      });

    supabase
      .from("sections_content")
      .select("section_key, title")
      .then(({ data }) => {
        if (data) {
          const dbKeys = data.map((d) => ({ key: d.section_key, label: d.title || d.section_key }));
          setKeys((prev) => {
            const final = [...prev];
            dbKeys.forEach((dk) => {
              const existingIndex = final.findIndex((f) => f.key === dk.key);
              if (existingIndex >= 0) {
                final[existingIndex].label = dk.label;
              } else {
                final.push(dk);
              }
            });
            return final;
          });
        }
      });
  }, [saving]);

  useEffect(() => {
    load(activeKey);
  }, [activeKey]);

  function handleAdd() {
    const newKey = prompt("Enter a unique short name for this program (e.g. 'daycare'):");
    if (!newKey) return;
    const key = newKey.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    if (!keys.find((k) => k.key === key)) {
      setKeys([...keys, { key, label: "New Program" }]);
    }
    setActiveKey(key);
  }

  async function handleDelete() {
    if (!delKey) return;
    const { error } = await supabase.from("sections_content").delete().eq("section_key", delKey);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Program deleted successfully");
    setKeys(keys.filter((k) => k.key !== delKey));
    setDelKey(null);
    if (activeKey === delKey) {
      setActiveKey(keys.find((k) => k.key !== delKey)?.key || "playground");
    }
  }

  async function load(k: string) {
    setData(null);
    const { data: row, error } = await supabase
      .from("sections_content")
      .select("*")
      .eq("section_key", k)
      .maybeSingle();
    if (error) {
      toast.error(error.message);
      return;
    }
    if (row) {
      setData({
        ...row,
        features: Array.isArray(row.features) ? row.features : [],
      } as Section);
    } else {
      setData({ id: "", section_key: k, title: "", description: "", features: [] });
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    const payload = {
      section_key: data.section_key,
      title: data.title,
      description: data.description,
      features: data.features,
      updated_at: new Date().toISOString(),
    };
    const { error } = data.id
      ? await supabase.from("sections_content").update(payload).eq("id", data.id)
      : await supabase.from("sections_content").insert(payload);
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    load(activeKey);
  }

  async function saveHomeData(e: React.FormEvent) {
    e.preventDefault();
    if (!homeData) return;
    setSavingHome(true);
    const { id, ...rest } = homeData;
    const { error } = await supabase
      .from("home_content")
      .update({
        programs_label: homeData.programs_label,
        programs_title: homeData.programs_title,
        programs_subtitle: homeData.programs_subtitle,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
    setSavingHome(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Header text saved");
  }


  if (!data) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        title="Programs Content"
        subtitle="Edit top section text, and manage Playground / Nursery / Junior KG / Senior KG tabs"
      />

      {homeData && (
        <form onSubmit={saveHomeData} className="mb-8">
          <Card className="bg-card/50">
            <h3 className="font-semibold mb-4 text-primary">
              Top Section Text (Visible above tabs)
            </h3>
            <div className="space-y-4">
              <Field
                label="Label (e.g. 📚 Our Programs)"
                value={homeData.programs_label ?? "📚 Our Programs"}
                onChange={(v) => setHomeData({ ...homeData, programs_label: v })}
              />
              <Field
                label="Title (e.g. Explore Our Classes)"
                value={homeData.programs_title ?? "Explore Our Classes"}
                onChange={(v) => setHomeData({ ...homeData, programs_title: v })}
              />
              <Field
                label="Subtitle"
                value={
                  homeData.programs_subtitle ??
                  "Age-appropriate programs designed with love, expertise, and a whole lot of fun for every little learner!"
                }
                onChange={(v) => setHomeData({ ...homeData, programs_subtitle: v })}
                textarea
              />
              <Button type="submit" disabled={savingHome}>
                <Save className="w-4 h-4" /> {savingHome ? "Saving…" : "Save Top Section"}
              </Button>
            </div>
          </Card>
        </form>
      )}

      <div className="flex flex-wrap gap-2">
        {keys.map((k) => (
          <button
            type="button"
            key={k.key}
            onClick={() => setActiveKey(k.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              activeKey === k.key
                ? "bg-primary text-primary-foreground"
                : "bg-card border hover:bg-muted"
            }`}
          >
            {k.label}
          </button>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-card border border-dashed border-primary text-primary hover:bg-muted"
        >
          + Add Program
        </button>
      </div>

      <form id="section-form" onSubmit={save} className="space-y-4">
        <Card>
          <Field
            label="Title"
            value={data.title}
            onChange={(v) => setData({ ...data, title: v })}
            required
          />
          <div className="mt-4">
            <Field
              label="Description"
              value={data.description}
              onChange={(v) => setData({ ...data, description: v })}
              textarea
              rows={4}
            />
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold mb-3">Key Features</h3>
          <ul className="space-y-2 mb-3">
            {data.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-lg">
                <span className="flex-1 text-sm">✓ {f}</span>
                <button
                  type="button"
                  onClick={() =>
                    setData({ ...data, features: data.features.filter((_, idx) => idx !== i) })
                  }
                  className="text-destructive p-1 hover:bg-destructive/10 rounded"
                  aria-label="Remove feature"
                >
                  <X className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-2">
            <input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature…"
              className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  if (newFeature.trim()) {
                    setData({ ...data, features: [...data.features, newFeature.trim()] });
                    setNewFeature("");
                  }
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                if (newFeature.trim()) {
                  setData({ ...data, features: [...data.features, newFeature.trim()] });
                  setNewFeature("");
                }
              }}
            >
              <Plus className="w-4 h-4" /> Add
            </Button>
          </div>
        </Card>


        <div className="flex gap-2 pb-4">
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4" /> {saving ? "Saving…" : "Save Section"}
          </Button>
          {keys.length > 1 && (
            <Button type="button" variant="danger" onClick={() => setDelKey(activeKey)}>
              <Trash2 className="w-4 h-4" /> Delete Program
            </Button>
          )}
        </div>
      </form>
      <ConfirmDelete
        open={!!delKey}
        onClose={() => setDelKey(null)}
        onConfirm={handleDelete}
        label="this program and all its content"
      />
    </div>
  );
}
