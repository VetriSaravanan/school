import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Card,
  Field,
  Button,
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

export const Route = createFileRoute("/admin/branches")({
  component: BranchesPage,
});

type Branch = {
  id: string;
  branch_name: string;
  address: string;
  map_embed_url: string | null;
  phone: string;
  order_index: number;
};

function BranchesPage() {
  const [items, setItems] = useState<Branch[]>([]);
  const [editing, setEditing] = useState<Partial<Branch> | null>(null);
  const [deleting, setDeleting] = useState<Branch | null>(null);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data, error } = await supabase.from("branches").select("*").order("order_index");
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((data ?? []) as Branch[]);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    const payload = {
      branch_name: editing.branch_name ?? "",
      address: editing.address ?? "",
      map_embed_url: editing.map_embed_url ?? null,
      phone: editing.phone ?? "",
      order_index: editing.order_index ?? items.length,
    };
    const { error } = editing.id
      ? await supabase.from("branches").update(payload).eq("id", editing.id)
      : await supabase.from("branches").insert(payload);
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
    const { error } = await supabase.from("branches").delete().eq("id", deleting.id);
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
        title="Branches"
        subtitle="Manage school branch locations"
        action={
          <Button
            onClick={() =>
              setEditing({ branch_name: "", address: "", phone: "", order_index: items.length })
            }
          >
            <Plus className="w-4 h-4" /> Add Branch
          </Button>
        }
      />

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((b) => (
          <Card key={b.id}>
            <div className="flex justify-between items-start gap-2">
              <h3 className="font-semibold">{b.branch_name}</h3>
              <div className="flex">
                <IconButton icon={Pencil} label="Edit" onClick={() => setEditing(b)} />
                <IconButton
                  icon={Trash2}
                  label="Delete"
                  variant="danger"
                  onClick={() => setDeleting(b)}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{b.address}</p>
            <p className="text-sm mt-2">📞 {b.phone}</p>
          </Card>
        ))}
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing?.id ? "Edit Branch" : "Add Branch"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                (document.getElementById("branch-form") as HTMLFormElement)?.requestSubmit()
              }
            >
              <Save className="w-4 h-4" /> Save
            </Button>
          </>
        }
      >
        {editing && (
          <FormBlock id="branch-form" onSubmit={save}>
            <Field
              label="Branch Name"
              value={editing.branch_name ?? ""}
              onChange={(v) => setEditing({ ...editing, branch_name: v })}
              required
            />
            <Field
              label="Address"
              value={editing.address ?? ""}
              onChange={(v) => setEditing({ ...editing, address: v })}
              textarea
            />
            <Field
              label="Phone"
              value={editing.phone ?? ""}
              onChange={(v) => setEditing({ ...editing, phone: v })}
            />
            <Field
              label="Google Maps Embed URL"
              value={editing.map_embed_url ?? ""}
              onChange={(v) => setEditing({ ...editing, map_embed_url: v })}
              placeholder="https://www.google.com/maps/embed?..."
            />
          </FormBlock>
        )}
      </Modal>

      <ConfirmDelete
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={del}
        label={deleting?.branch_name}
      />
    </div>
  );
}
