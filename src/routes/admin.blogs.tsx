import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase, BUCKETS } from "@/lib/supabase";
import { toast } from "sonner";
import "react-quill-new/dist/quill.snow.css";
import ReactQuill from "react-quill-new";
import {
  Card,
  Field,
  Button,
  ImageUpload,
  PageHeader,
  Modal,
  ConfirmDelete,
  IconButton,
  Pencil,
  Trash2,
  Plus,
  Save,
} from "@/components/admin-ui";

export const Route = createFileRoute("/admin/blogs")({
  component: BlogsPage,
});

type Blog = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author: string;
  cover_url: string | null;
  status: "draft" | "published";
  created_at: string;
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function BlogsPage() {
  const [items, setItems] = useState<Blog[]>([]);
  const [editing, setEditing] = useState<Partial<Blog> | null>(null);
  const [deleting, setDeleting] = useState<Blog | null>(null);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((data ?? []) as Blog[]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const title = editing.title ?? "";
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    const payload = {
      title,
      slug: editing.slug?.trim() || slugify(title),
      content: editing.content ?? "",
      excerpt: editing.excerpt ?? "",
      author: editing.author ?? "Payitragam Team",
      cover_url: editing.cover_url ?? null,
      status: (editing.status as "draft" | "published") ?? "draft",
      updated_at: new Date().toISOString(),
    };
    const { error } = editing.id
      ? await supabase.from("blogs").update(payload).eq("id", editing.id)
      : await supabase.from("blogs").insert(payload);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Saved");
    setEditing(null);
    load();
  }

  async function del() {
    if (!deleting) return;
    const { error } = await supabase.from("blogs").delete().eq("id", deleting.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Blogs"
        subtitle="Create and manage blog posts"
        action={
          <Button
            onClick={() =>
              setEditing({ title: "", content: "", status: "draft", author: "Payitragam Team" })
            }
          >
            <Plus className="w-4 h-4" /> New Post
          </Button>
        }
      />

      {items.length === 0 ? (
        <Card>
          <p className="text-muted-foreground text-sm">No blog posts yet.</p>
        </Card>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Title</th>
                <th className="p-3 hidden sm:table-cell">Author</th>
                <th className="p-3 hidden md:table-cell">Status</th>
                <th className="p-3 hidden md:table-cell">Date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {items.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="p-3 font-medium">{b.title}</td>
                  <td className="p-3 hidden sm:table-cell text-muted-foreground">{b.author}</td>
                  <td className="p-3 hidden md:table-cell">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        b.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="p-3 hidden md:table-cell text-xs text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(b)} />
                    <IconButton
                      icon={Trash2}
                      label="Delete"
                      variant="danger"
                      onClick={() => setDeleting(b)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Post" : "New Post"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                (document.getElementById("blog-form") as HTMLFormElement)?.requestSubmit()
              }
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </>
        }
      >
        {editing && (
          <form id="blog-form" onSubmit={save} className="space-y-4">
            <Field
              label="Title"
              value={editing.title ?? ""}
              onChange={(v) =>
                setEditing({ ...editing, title: v, slug: editing.id ? editing.slug : slugify(v) })
              }
              required
            />
            <Field
              label="Slug (URL)"
              value={editing.slug ?? ""}
              onChange={(v) => setEditing({ ...editing, slug: slugify(v) })}
            />
            <Field
              label="Author"
              value={editing.author ?? ""}
              onChange={(v) => setEditing({ ...editing, author: v })}
            />
            <Field
              label="Excerpt (short summary)"
              value={editing.excerpt ?? ""}
              onChange={(v) => setEditing({ ...editing, excerpt: v })}
              textarea
              rows={2}
            />
            <div>
              <span className="block text-sm font-medium mb-1.5">Cover Image</span>
              <ImageUpload
                value={editing.cover_url}
                onChange={(u) => setEditing({ ...editing, cover_url: u })}
                bucket={BUCKETS.blogs}
              />
            </div>
            <div>
              <span className="block text-sm font-medium mb-1.5">Content</span>
              <ReactQuill
                theme="snow"
                value={editing.content ?? ""}
                onChange={(v) => setEditing({ ...editing, content: v })}
                modules={{
                  toolbar: [
                    [{ header: [1, 2, 3, false] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "blockquote"],
                    ["clean"],
                  ],
                }}
                className="bg-background"
              />
            </div>
            <label className="block">
              <span className="block text-sm font-medium mb-1.5">Status</span>
              <select
                value={editing.status ?? "draft"}
                onChange={(e) =>
                  setEditing({ ...editing, status: e.target.value as "draft" | "published" })
                }
                className="w-full px-3 py-2 rounded-lg border bg-background text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
          </form>
        )}
      </Modal>

      <ConfirmDelete
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={del}
        label={deleting?.title}
      />
    </div>
  );
}
