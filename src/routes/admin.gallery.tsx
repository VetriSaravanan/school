import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase, BUCKETS, uploadFile } from "@/lib/supabase";
import { toast } from "sonner";
import { OptimizedImage } from "@/components/optimized-image";
import {
  Card,
  Field,
  Button,
  PageHeader,
  Modal,
  ConfirmDelete,
  IconButton,
  Pencil,
  Trash2,
  Plus,
  Upload,
  Save,
} from "@/components/admin-ui";

export const Route = createFileRoute("/admin/gallery")({
  component: GalleryPage,
});

type Cat = { id: string; name: string; slug: string; order_index: number };
type Img = {
  id: string;
  image_url: string;
  caption: string | null;
  category_id: string | null;
  order_index: number;
};

function GalleryPage() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [imgs, setImgs] = useState<Img[]>([]);
  const [activeCat, setActiveCat] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState<Img | null>(null);
  const [deleting, setDeleting] = useState<Img | null>(null);
  const [newCat, setNewCat] = useState("");

  useEffect(() => {
    reload();
  }, []);
  async function reload() {
    const [c, i] = await Promise.all([
      supabase.from("gallery_categories").select("*").order("order_index"),
      supabase
        .from("gallery_images")
        .select("*")
        .order("order_index")
        .order("created_at", { ascending: false }),
    ]);
    if (c.error) toast.error(c.error.message);
    if (i.error) toast.error(i.error.message);
    setCats((c.data ?? []) as Cat[]);
    setImgs((i.data ?? []) as Img[]);
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    const catId = activeCat === "all" ? null : (cats.find((c) => c.slug === activeCat)?.id ?? null);
    try {
      for (const f of files) {
        const url = await uploadFile(BUCKETS.gallery, f);
        await supabase.from("gallery_images").insert({
          image_url: url,
          caption: "",
          category_id: catId,
          order_index: imgs.length,
        });
      }
      toast.success(`Uploaded ${files.length} image(s)`);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function addCategory() {
    const name = newCat.trim();
    if (!name) return;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const { error } = await supabase
      .from("gallery_categories")
      .insert({ name, slug, order_index: cats.length });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Category added");
    setNewCat("");
    reload();
  }

  async function delCategory(c: Cat) {
    if (!confirm(`Delete category "${c.name}"? Images will become uncategorized.`)) return;
    const { error } = await supabase.from("gallery_categories").delete().eq("id", c.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Category deleted");
    reload();
  }

  async function saveImg() {
    if (!editing) return;
    const { error } = await supabase
      .from("gallery_images")
      .update({
        caption: editing.caption,
        category_id: editing.category_id,
      })
      .eq("id", editing.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    setEditing(null);
    reload();
  }

  async function delImg() {
    if (!deleting) return;
    const { error } = await supabase.from("gallery_images").delete().eq("id", deleting.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    reload();
  }

  const filtered =
    activeCat === "all"
      ? imgs
      : imgs.filter((i) => i.category_id === cats.find((c) => c.slug === activeCat)?.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Gallery"
        subtitle="Upload, categorize and manage images"
        action={
          <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground cursor-pointer text-sm font-medium">
            <Upload className="w-4 h-4" /> {uploading ? "Uploading…" : "Upload Images"}
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={onUpload}
              disabled={uploading}
            />
          </label>
        }
      />

      <Card>
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveCat("all")}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${activeCat === "all" ? "bg-primary text-primary-foreground" : "bg-muted"
              }`}
          >
            All ({imgs.length})
          </button>
          {cats
            .filter((c) => c.slug !== "all")
            .map((c) => {
              const count = imgs.filter((i) => i.category_id === c.id).length;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveCat(c.slug)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-2 ${activeCat === c.slug ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                >
                  {c.name} ({count})
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      delCategory(c);
                    }}
                    className="opacity-50 hover:opacity-100"
                    aria-label="Delete category"
                  >
                    ✕
                  </button>
                </button>
              );
            })}
        </div>
        <div className="flex gap-2 max-w-md">
          <input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category name…"
            className="flex-1 px-3 py-2 rounded-lg border bg-background text-sm"
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCategory())}
          />
          <Button onClick={addCategory}>
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-muted-foreground text-sm">No images in this category yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((img) => {
            const cat = cats.find((c) => c.id === img.category_id);
            return (
              <div key={img.id} className="bg-card rounded-xl border overflow-hidden group">
                <OptimizedImage
                  src={img.image_url}
                  alt={img.caption ?? ""}
                  width={300}
                  imgClassName="w-full aspect-square object-cover"
                />
                <div className="p-3">
                  <div className="text-xs text-muted-foreground">
                    {cat?.name ?? "Uncategorized"}
                  </div>
                  {img.caption && (
                    <div className="text-sm font-medium truncate mt-1">{img.caption}</div>
                  )}
                  <div className="flex gap-1 mt-2">
                    <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(img)} />
                    <IconButton
                      icon={Trash2}
                      label="Delete"
                      variant="danger"
                      onClick={() => setDeleting(img)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title="Edit Image"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={saveImg}>
              <Save className="w-4 h-4" /> Save
            </Button>
          </>
        }
      >
        {editing && (
          <div className="space-y-4">
            <OptimizedImage
              src={editing.image_url}
              alt=""
              width={600}
              imgClassName="w-full max-h-64 object-contain rounded-lg border"
            />
            <Field
              label="Caption"
              value={editing.caption ?? ""}
              onChange={(v) => setEditing({ ...editing, caption: v })}
            />
            <label className="block">
              <span className="block text-sm font-medium mb-1.5">Category</span>
              <select
                value={editing.category_id ?? ""}
                onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })}
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              >
                <option value="">— Uncategorized —</option>
                {cats
                  .filter((c) => c.slug !== "all")
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </label>
          </div>
        )}
      </Modal>

      <ConfirmDelete
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={delImg}
        label="this image"
      />
    </div>
  );
}
