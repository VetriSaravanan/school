import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Card, Button, PageHeader, ConfirmDelete, IconButton, Trash2 } from "@/components/admin-ui";
import { Mail, Eye, Download } from "lucide-react";

export const Route = createFileRoute("/admin/enquiries")({
  component: EnquiriesPage,
});

type Enquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  child_age: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
};

function EnquiriesPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [deleting, setDeleting] = useState<Enquiry | null>(null);
  const [viewing, setViewing] = useState<Enquiry | null>(null);

  useEffect(() => {
    load();
  }, []);
  async function load() {
    const { data, error } = await supabase
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setItems((data ?? []) as Enquiry[]);
  }

  async function toggleRead(e: Enquiry) {
    const { error } = await supabase
      .from("enquiries")
      .update({ is_read: !e.is_read })
      .eq("id", e.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    load();
  }

  async function del() {
    if (!deleting) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", deleting.id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    load();
  }

  function exportCSV() {
    const rows = [
      ["Name", "Phone", "Email", "Child Age", "Message", "Read", "Date"],
      ...items.map((e) => [
        e.name,
        e.phone,
        e.email ?? "",
        e.child_age ?? "",
        e.message ?? "",
        e.is_read ? "Yes" : "No",
        new Date(e.created_at).toISOString(),
      ]),
    ];
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiries-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const visible = filter === "unread" ? items.filter((i) => !i.is_read) : items;
  const unreadCount = items.filter((i) => !i.is_read).length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Enquiries"
        subtitle={`${items.length} total · ${unreadCount} unread`}
        action={
          <Button onClick={exportCSV} variant="secondary">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        }
      />

      <div className="flex gap-2">
        {(["all", "unread"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {f === "all" ? `All (${items.length})` : `Unread (${unreadCount})`}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <Card>
          <p className="text-muted-foreground text-sm">No enquiries to show.</p>
        </Card>
      ) : (
        <div className="bg-card rounded-xl border overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead className="bg-muted/50 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3 hidden md:table-cell">Email</th>
                <th className="p-3 hidden lg:table-cell">Age</th>
                <th className="p-3 hidden lg:table-cell">Date</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((e) => (
                <tr
                  key={e.id}
                  className={`border-t ${!e.is_read ? "bg-primary/5 font-semibold" : ""}`}
                >
                  <td className="p-3">{e.name}</td>
                  <td className="p-3">
                    <a href={`tel:${e.phone}`} className="text-primary">
                      {e.phone}
                    </a>
                  </td>
                  <td className="p-3 hidden md:table-cell text-muted-foreground">{e.email}</td>
                  <td className="p-3 hidden lg:table-cell text-xs">{e.child_age}</td>
                  <td className="p-3 hidden lg:table-cell text-xs">
                    {new Date(e.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <IconButton icon={Eye} label="View" onClick={() => setViewing(e)} />
                    <button
                      onClick={() => toggleRead(e)}
                      className="p-2 rounded-md hover:bg-muted"
                      title="Toggle read"
                    >
                      <Mail
                        className={`w-4 h-4 ${e.is_read ? "text-muted-foreground" : "text-primary"}`}
                      />
                    </button>
                    <IconButton
                      icon={Trash2}
                      label="Delete"
                      variant="danger"
                      onClick={() => setDeleting(e)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {viewing && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setViewing(null)}
        >
          <div
            className="bg-card rounded-xl border shadow-xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4">Enquiry from {viewing.name}</h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="font-medium inline">Phone: </dt>
                <dd className="inline">{viewing.phone}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Email: </dt>
                <dd className="inline">{viewing.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Child age: </dt>
                <dd className="inline">{viewing.child_age ?? "—"}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Date: </dt>
                <dd className="inline">{new Date(viewing.created_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-medium block mt-3">Message:</dt>
                <dd className="bg-muted p-3 rounded-lg mt-1">
                  {viewing.message || "(no message)"}
                </dd>
              </div>
            </dl>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="ghost" onClick={() => setViewing(null)}>
                Close
              </Button>
              <Button
                onClick={() => {
                  toggleRead(viewing);
                  setViewing({ ...viewing, is_read: !viewing.is_read });
                }}
              >
                Mark as {viewing.is_read ? "unread" : "read"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDelete
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={del}
        label={deleting?.name}
      />
    </div>
  );
}
