import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { cachedQuery, prewarmQueries } from "@/lib/query-cache";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Payitragam Preschool — Tirunelveli" },
      {
        name: "description",
        content:
          "Multiple Intelligence Preschool in Tirunelveli — Montessori, Reggio Emilia & Play Way.",
      },
    ],
    links: [
      {
        rel: "icon",
        href: "/favicon.png",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
      /* Preconnect to Supabase CDN — shaves ~100-200ms off first image load */
      {
        rel: "preconnect",
        href: "https://vccmipedghdpynggsnma.supabase.co",
      },
      {
        rel: "dns-prefetch",
        href: "https://vccmipedghdpynggsnma.supabase.co",
      },
      /* Preload primary display font */
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous" as const,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  useEffect(() => {
    // Favicon — uses cached query to avoid duplicate fetch
    cachedQuery("site_settings_favicon", () =>
      supabase
        .from("site_settings")
        .select("favicon_url")
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data),
    ).then((data) => {
      if (data?.favicon_url) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = data.favicon_url;
      }
    }).catch(() => {});

    // Pre-warm common queries so they're cached when components mount
    prewarmQueries([
      {
        key: "site_settings",
        fn: () =>
          supabase
            .from("site_settings")
            .select("*")
            .limit(1)
            .maybeSingle()
            .then(({ data }) => data),
      },
      {
        key: "home_content",
        fn: () =>
          supabase
            .from("home_content")
            .select("*")
            .limit(1)
            .maybeSingle()
            .then(({ data }) => data),
      },
    ]);
  }, []);

  return (
    <>
      <Outlet />
      <Toaster richColors position="top-right" />
    </>
  );
}
