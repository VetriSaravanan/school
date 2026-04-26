import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase, BUCKETS } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Card,
  Field,
  Button,
  ImageUpload,
  FormBlock,
  PageHeader,
  Modal,
  ConfirmDelete,
  IconButton,
  Pencil,
  Trash2,
  Plus,
  Save,
} from "@/components/admin-ui";

export const Route = createFileRoute("/admin/team")({
  component: TeamPage,
});

type Member = {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  order_index: number;
};

function TeamPage() {
  const [items, setItems] = useState<Member[]>([]);
  const [editing, setEditing] = useState<Partial<Member> | null>(null);
  const [deleting, setDeleting] = useState<Member | null>(null);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data, error } = await supabase.from("team_members").select("*").order("order_index");
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((data ?? []) as Member[]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      name: editing.name ?? "",
      role: editing.role ?? "",
      photo_url: editing.photo_url ?? null,
      order_index: editing.order_index ?? items.length,
    };
    const { error } = editing.id
      ? await supabase.from("team_members").update(payload).eq("id", editing.id)
      : await supabase.from("team_members").insert(payload);
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
    const { error } = await supabase.from("team_members").delete().eq("id", deleting.id);
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
        title="Team Members"
        subtitle="Add and manage staff cards"
        action={
          <Button
            onClick={() =>
              setEditing({ name: "", role: "", photo_url: null, order_index: items.length })
            }
          >
            <Plus className="w-4 h-4" /> Add Member
          </Button>
        }
      />

      {items.length === 0 ? (
        <Card>
          <p className="text-muted-foreground text-sm">No team members yet.</p>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((m) => (
            <Card key={m.id} className="text-center">
              {m.photo_url ? (
                <img
                  src={m.photo_url}
                  alt={m.name}
                  className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-primary"
                />
              ) : (
                <div className="w-24 h-24 rounded-full mx-auto bg-muted flex items-center justify-center text-2xl">
                  👤
                </div>
              )}
              <h3 className="font-semibold mt-3">{m.name}</h3>
              <p className="text-sm text-muted-foreground">{m.role}</p>
              <div className="flex justify-center gap-1 mt-3">
                <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(m)} />
                <IconButton
                  icon={Trash2}
                  label="Delete"
                  variant="danger"
                  onClick={() => setDeleting(m)}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Member" : "Add Member"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              type="submit"
              onClick={() => {
                const f = document.getElementById("team-form") as HTMLFormElement | null;
                f?.requestSubmit();
              }}
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </>
        }
      >
        {editing && (
          <FormBlock onSubmit={save} className="">
            <form id="team-form" onSubmit={save} className="space-y-4">
              <Field
                label="Name"
                value={editing.name ?? ""}
                onChange={(v) => setEditing({ ...editing, name: v })}
                required
              />
              <Field
                label="Role"
                value={editing.role ?? ""}
                onChange={(v) => setEditing({ ...editing, role: v })}
              />
              <div>
                <span className="block text-sm font-medium mb-1.5">Photo</span>
                <ImageUpload
                  value={editing.photo_url}
                  onChange={(u) => setEditing({ ...editing, photo_url: u })}
                  bucket={BUCKETS.team}
                />
              </div>
            </form>
          </FormBlock>
        )}
      </Modal>

      <ConfirmDelete
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={del}
        label={deleting?.name}
      />
    </div>
  );
}
