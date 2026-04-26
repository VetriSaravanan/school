import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
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
  Save,
} from "@/components/admin-ui";

export const Route = createFileRoute("/admin/announcements")({
  component: AnnouncementsPage,
});

type Ann = {
  id: string;
  title: string;
  description: string;
  badge_color: string;
  is_pinned: boolean;
  announcement_date: string;
  created_at: string;
};

function AnnouncementsPage() {
  const [items, setItems] = useState<Ann[]>([]);
  const [editing, setEditing] = useState<Partial<Ann> | null>(null);
  const [deleting, setDeleting] = useState<Ann | null>(null);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("announcement_date", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((data ?? []) as Ann[]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      title: editing.title ?? "",
      description: editing.description ?? "",
      badge_color: editing.badge_color ?? "#e63946",
      is_pinned: editing.is_pinned ?? false,
      announcement_date: editing.announcement_date ?? new Date().toISOString().slice(0, 10),
    };
    const { error } = editing.id
      ? await supabase.from("announcements").update(payload).eq("id", editing.id)
      : await supabase.from("announcements").insert(payload);
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
    const { error } = await supabase.from("announcements").delete().eq("id", deleting.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    load();
  }

  async function togglePin(a: Ann) {
    const { error } = await supabase
      .from("announcements")
      .update({ is_pinned: !a.is_pinned })
      .eq("id", a.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    load();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Announcements"
        subtitle="Notices, news and updates"
        action={
          <Button
            onClick={() =>
              setEditing({
                title: "",
                description: "",
                badge_color: "#e63946",
                is_pinned: false,
                announcement_date: new Date().toISOString().slice(0, 10),
              })
            }
          >
            <Plus className="w-4 h-4" /> Add Announcement
          </Button>
        }
      />

      <div className="space-y-3">
        {items.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start gap-3">
              <div
                className="w-1.5 self-stretch rounded-full"
                style={{ background: a.badge_color }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {a.is_pinned && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                      📌 Pinned
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">{a.announcement_date}</span>
                </div>
                <h3 className="font-semibold mt-1">{a.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{a.description}</p>
              </div>
              <div className="flex">
                <button
                  onClick={() => togglePin(a)}
                  className="p-2 rounded-md hover:bg-muted text-sm"
                  title="Toggle pin"
                >
                  📌
                </button>
                <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(a)} />
                <IconButton
                  icon={Trash2}
                  label="Delete"
                  variant="danger"
                  onClick={() => setDeleting(a)}
                />
              </div>
            </div>
          </Card>
        ))}
        {items.length === 0 && (
          <Card>
            <p className="text-muted-foreground text-sm">No announcements yet.</p>
          </Card>
        )}
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Announcement" : "Add Announcement"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                (document.getElementById("ann-form") as HTMLFormElement)?.requestSubmit()
              }
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </>
        }
      >
        {editing && (
          <form id="ann-form" onSubmit={save} className="space-y-4">
            <Field
              label="Title"
              value={editing.title ?? ""}
              onChange={(v) => setEditing({ ...editing, title: v })}
              required
            />
            <Field
              label="Description"
              value={editing.description ?? ""}
              onChange={(v) => setEditing({ ...editing, description: v })}
              textarea
            />
            <div className="grid grid-cols-2 gap-4">
              <Field
                label="Date"
                type="date"
                value={editing.announcement_date ?? ""}
                onChange={(v) => setEditing({ ...editing, announcement_date: v })}
              />
              <label className="block">
                <span className="block text-sm font-medium mb-1.5">Badge Color</span>
                <input
                  type="color"
                  value={editing.badge_color ?? "#e63946"}
                  onChange={(e) => setEditing({ ...editing, badge_color: e.target.value })}
                  className="w-full h-10 rounded-lg border bg-background"
                />
              </label>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editing.is_pinned ?? false}
                onChange={(e) => setEditing({ ...editing, is_pinned: e.target.checked })}
              />
              <span className="text-sm">📌 Pin this announcement</span>
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
