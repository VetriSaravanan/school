import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AlertTriangle, Copy, Check, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const SUPABASE_PROJECT_REF = "vccmipedghdpynggsnma";

export function SetupBanner() {
  const [needsSetup, setNeedsSetup] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [sql, setSql] = useState<string>("");

  useEffect(() => {
    // Probe one of the required tables. If 404 -> tables not created yet.
    (async () => {
      const { error } = await supabase
        .from("site_settings")
        .select("id", { head: true, count: "exact" });
      // PGRST205 = table not found in schema cache
      setNeedsSetup(
        !!error &&
          (error.code === "PGRST205" || error.message?.includes("Could not find the table")),
      );
    })();

    // Lazy-load SQL once.
    fetch("/SUPABASE_SETUP.sql")
      .then((r) => (r.ok ? r.text() : ""))
      .then(setSql)
      .catch(() => {});
  }, []);

  if (!needsSetup) return null;

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(sql || "See SUPABASE_SETUP.sql in project root");
      setCopied(true);
      toast.success("SQL copied — paste it into Supabase SQL Editor");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy. Open SUPABASE_SETUP.sql manually.");
    }
  };

  return (
    <div className="rounded-xl border-2 border-destructive bg-destructive/5 p-5 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-destructive shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-destructive text-lg">Database tables are missing</h3>
          <p className="text-sm mt-1 text-foreground/80">
            Your Supabase project is connected, but the required tables haven't been created yet.
            That's why every page shows blank or fails to save. Do this <b>once</b>:
          </p>
          <ol className="text-sm mt-3 space-y-2 list-decimal list-inside">
            <li>
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
              >
                Open Supabase SQL Editor <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Click the button below to copy the setup SQL</li>
            <li>
              Paste it in the editor and click <b>Run</b>
            </li>
            <li>
              Then go to{" "}
              <a
                href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/auth/users`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-primary font-medium hover:underline"
              >
                Authentication → Users <ExternalLink className="w-3 h-3" />
              </a>{" "}
              → Add user <code className="bg-muted px-1 rounded">admin@gmail.com</code> /{" "}
              <code className="bg-muted px-1 rounded">Admin@123</code> (Auto-confirm ON)
            </li>
            <li>Refresh this page — the banner will disappear</li>
          </ol>
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={copySql}
              disabled={!sql}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied!" : "Copy setup SQL"}
            </button>
            <a
              href={`https://supabase.com/dashboard/project/${SUPABASE_PROJECT_REF}/sql/new`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-muted"
            >
              Open SQL Editor <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
