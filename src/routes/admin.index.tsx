import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { Image, FileText, Inbox, Megaphone, Users, MapPin } from "lucide-react";
import { SetupBanner } from "@/components/setup-banner";

export const Route = createFileRoute("/admin/")({
  component: DashboardHome,
});

function DashboardHome() {
  const [stats, setStats] = useState({
    enquiries: 0,
    unread: 0,
    gallery: 0,
    blogs: 0,
    announcements: 0,
    team: 0,
    branches: 0,
  });

  useEffect(() => {
    let cancelled = false;
    const safeCount = async (table: string, filter?: { col: string; val: string | boolean }) => {
      let q = supabase.from(table).select("id", { count: "exact", head: true });
      if (filter) q = q.eq(filter.col, filter.val as never);
      const { count, error } = await q;
      if (error) return 0;
      return count ?? 0;
    };

    (async () => {
      const [enquiries, unread, gallery, blogs, announcements, team, branches] = await Promise.all([
        safeCount("enquiries"),
        safeCount("enquiries", { col: "is_read", val: false }),
        safeCount("gallery_images"),
        safeCount("blogs"),
        safeCount("announcements"),
        safeCount("team_members"),
        safeCount("branches"),
      ]);
      if (cancelled) return;
      setStats({ enquiries, unread, gallery, blogs, announcements, team, branches });
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const cards = [
    {
      label: "Total Enquiries",
      value: stats.enquiries,
      icon: Inbox,
      to: "/admin/enquiries",
      color: "var(--crimson)",
    },
    {
      label: "Unread Enquiries",
      value: stats.unread,
      icon: Inbox,
      to: "/admin/enquiries",
      color: "var(--royal)",
    },
    {
      label: "Gallery Images",
      value: stats.gallery,
      icon: Image,
      to: "/admin/gallery",
      color: "var(--cyan)",
    },
    {
      label: "Blog Posts",
      value: stats.blogs,
      icon: FileText,
      to: "/admin/blogs",
      color: "var(--crimson)",
    },
    {
      label: "Announcements",
      value: stats.announcements,
      icon: Megaphone,
      to: "/admin/announcements",
      color: "var(--royal)",
    },
    {
      label: "Team Members",
      value: stats.team,
      icon: Users,
      to: "/admin/team",
      color: "var(--cyan)",
    },
    {
      label: "Branches",
      value: stats.branches,
      icon: MapPin,
      to: "/admin/branches",
      color: "var(--navy)",
    },
  ];

  return (
    <div className="space-y-6">
      <SetupBanner />

      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">
          Welcome back. Here's what's happening at Payitragam.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <Link
              key={c.label}
              to={c.to}
              className="bg-card rounded-xl border p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                  style={{ background: c.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-bold">{c.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{c.label}</div>
            </Link>
          );
        })}
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="font-semibold mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/blogs"
            className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
          >
            + New Blog Post
          </Link>
          <Link to="/admin/gallery" className="px-4 py-2 rounded-lg border text-sm font-medium">
            Upload to Gallery
          </Link>
          <Link
            to="/admin/announcements"
            className="px-4 py-2 rounded-lg border text-sm font-medium"
          >
            + Announcement
          </Link>
          <Link to="/admin/enquiries" className="px-4 py-2 rounded-lg border text-sm font-medium">
            View Enquiries
          </Link>
        </div>
      </div>
    </div>
  );
}
