import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, createFileRoute, useLocation, useNavigate } from "@tanstack/react-router";
import { supabase, SUPABASE_CONFIGURED } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { toast } from "sonner";
import { SetupBanner } from "@/components/setup-banner";
import {
  LayoutDashboard,
  Settings,
  Home,
  Info,
  Image as ImageIcon,
  FileText,
  Megaphone,
  Inbox,
  MapPin,
  Users,
  BookOpen,
  LogOut,
  Menu,
  X,
  AlertTriangle,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const NAV: Array<{ to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean }> = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/settings", label: "Site Settings", icon: Settings },
  { to: "/admin/home", label: "Home Section", icon: Home },
  { to: "/admin/about", label: "About Us", icon: Info },
  { to: "/admin/team", label: "Team Members", icon: Users },
  { to: "/admin/branches", label: "Branches", icon: MapPin },
  { to: "/admin/sections", label: "Programs Content", icon: BookOpen },
  { to: "/admin/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/admin/blogs", label: "Blogs", icon: FileText },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone },
  { to: "/admin/enquiries", label: "Enquiries", icon: Inbox },
] as const;

function AdminLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      setLoading(false);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!SUPABASE_CONFIGURED) {
    return <SupabaseNotConfigured />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading…</div>
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate({ to: "/admin" });
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 flex items-center justify-between px-5 border-b">
          <Link to="/admin" className="flex items-center gap-2 font-bold">
            <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold">
              P
            </div>
            <span>Payitragam Admin</span>
          </Link>
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100vh-8rem)]">
          {NAV.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t bg-card">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-card border-b flex items-center px-4 lg:px-6 gap-3">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-semibold">Admin Dashboard</div>
          <div className="ml-auto text-xs text-muted-foreground truncate">{session.user.email}</div>
          <Link
            to="/"
            className="text-xs px-3 py-1.5 rounded-md border hover:bg-muted"
            target="_blank"
          >
            View Site ↗
          </Link>
        </header>
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {location.pathname !== "/admin" && <SetupBanner />}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setErr(error.message);
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, var(--cream), oklch(0.93 0.04 220))" }}
    >
      <div className="w-full max-w-md bg-card rounded-2xl shadow-xl border p-8">
        <div className="text-center mb-6">
          <div
            className="mx-auto w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-3"
            style={{ background: "var(--navy)" }}
          >
            P
          </div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--navy)" }}>
            Admin Login
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage Payitragam</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="Enter your email"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
          />
          {err && (
            <div className="text-sm text-destructive bg-destructive/10 p-2 rounded-md">{err}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
            style={{ background: "var(--crimson)" }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Input({
  label,
  type,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className="w-full px-4 py-2.5 rounded-lg border bg-background outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

function SupabaseNotConfigured() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background">
      <div className="max-w-2xl w-full bg-card rounded-2xl border p-8 shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <AlertTriangle className="w-8 h-8 text-destructive shrink-0" />
          <div>
            <h1 className="text-2xl font-bold mb-2">Supabase not configured</h1>
            <p className="text-muted-foreground">
              You need to add your Supabase project URL before the admin can connect.
            </p>
          </div>
        </div>
        <div className="space-y-4 text-sm">
          <Step n={1}>
            Go to your Supabase dashboard → <b>Project Settings → API</b> → copy the{" "}
            <b>Project URL</b>.
          </Step>
          <Step n={2}>
            Open <code className="bg-muted px-1.5 py-0.5 rounded">src/lib/supabase.ts</code> and
            replace the <code className="bg-muted px-1.5 py-0.5 rounded">YOUR-PROJECT-REF</code>{" "}
            placeholder.
          </Step>
          <Step n={3}>
            Run the SQL setup script (
            <code className="bg-muted px-1.5 py-0.5 rounded">SUPABASE_SETUP.sql</code> in project
            root) in your Supabase <b>SQL Editor</b>.
          </Step>
          <Step n={4}>
            Create the admin user in Supabase <b>Authentication → Users → Add user</b>: email{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded">admin@gmail.com</code>, password{" "}
            <code className="bg-muted px-1.5 py-0.5 rounded">Admin@123</code>, with Auto-confirm ON.
          </Step>
          <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-lg mt-4">
            <b>Security warning:</b> The Supabase secret key you shared in chat is exposed. Rotate
            it immediately in Supabase → Project Settings → API → "Reset service_role key". Only the
            publishable (anon) key belongs in client code.
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ n, children }: { n: number; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
        {n}
      </div>
      <div className="pt-0.5">{children}</div>
    </div>
  );
}
