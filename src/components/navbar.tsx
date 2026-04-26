import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { OptimizedImage } from "./optimized-image";

type LinkItem = {
  href: string;
  label: string;
  icon: string;
  bg: string;
  rest: string;
  peak: string;
  delay: string;
};

const links: LinkItem[] = [
  {
    href: "#home",
    label: "Home",
    icon: "🏠",
    bg: "var(--crimson)",
    rest: "-4deg",
    peak: "4deg",
    delay: "0s",
  },
  {
    href: "#about",
    label: "About",
    icon: "🧑‍🏫",
    bg: "var(--cyan)",
    rest: "3deg",
    peak: "-3deg",
    delay: ".25s",
  },
  {
    href: "#programs",
    label: "Programs",
    icon: "🎨",
    bg: "var(--royal)",
    rest: "-3deg",
    peak: "3deg",
    delay: ".5s",
  },
  {
    href: "#playground",
    label: "Play",
    icon: "🛝",
    bg: "var(--crimson)",
    rest: "4deg",
    peak: "-4deg",
    delay: ".15s",
  },
  {
    href: "#gallery",
    label: "Gallery",
    icon: "🖼️",
    bg: "var(--cyan)",
    rest: "-3deg",
    peak: "3deg",
    delay: ".4s",
  },
  {
    href: "#blogs",
    label: "Blogs",
    icon: "📚",
    bg: "var(--royal)",
    rest: "3deg",
    peak: "-3deg",
    delay: ".6s",
  },
  {
    href: "#announcements",
    label: "Notices",
    icon: "📢",
    bg: "var(--crimson)",
    rest: "-4deg",
    peak: "4deg",
    delay: ".1s",
  },
  {
    href: "#reach-us",
    label: "Contact",
    icon: "📞",
    bg: "var(--cyan)",
    rest: "3deg",
    peak: "-3deg",
    delay: ".35s",
  },
];

type SiteSettings = {
  school_name: string;
  tagline: string;
  logo_url: string | null;
};

export function Navbar() {
  const [active, setActive] = useState<string>("home");
  const [scrolled, setScrolled] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("school_name, tagline, logo_url")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) setSettings(data as SiteSettings);
      });
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const ids = links.map((l) => l.href.slice(1));
      let cur = "home";
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - 140 <= 0) cur = id;
      });
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const schoolName = settings?.school_name || "Payitragam";
  const tagline = settings?.tagline || "E for Education, P for Payitragam";
  const logoUrl = settings?.logo_url;

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all"
        style={{
          backgroundColor: "oklch(0.97 0.02 60 / 0.97)",
          backdropFilter: "blur(12px)",
          borderBottom: "3px solid var(--navy)",
          padding: scrolled ? "8px 0 14px" : "12px 0 22px",
          boxShadow: scrolled ? "0 6px 20px oklch(0.27 0.12 275 / .15)" : "none",
        }}
      >
        {/* NOTE: Horizontal dashed separator intentionally removed per design spec */}

        <div className="max-w-[1320px] mx-auto px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <a href="#home" className="flex items-center gap-3 shrink-0">
            {logoUrl ? (
              <OptimizedImage
                src={logoUrl}
                alt={schoolName + " logo"}
                width={120}
                eager
                imgClassName="rounded-full object-cover"
                style={{
                  width: scrolled ? 40 : 48,
                  height: scrolled ? 40 : 48,
                }}
              />
            ) : (
              <div
                className="flex items-center justify-center rounded-full font-bold"
                style={{
                  width: scrolled ? 40 : 48,
                  height: scrolled ? 40 : 48,
                  background: "var(--navy)",
                  fontFamily: "var(--font-play)",
                  fontSize: scrolled ? 18 : 22,
                  color: "var(--cream)",
                }}
              >
                {schoolName.charAt(0)}
              </div>
            )}
            <div className="leading-tight" style={{ fontFamily: "var(--font-play)" }}>
              <div className="text-[15px] sm:text-[18px] font-bold" style={{ color: "var(--navy)" }}>
                {schoolName}
              </div>
              <div
                className="text-[10px] sm:text-[11px] font-medium"
                style={{ color: "var(--crimson)", fontFamily: "var(--font-body)" }}
              >
                {tagline}
              </div>
            </div>
          </a>

          {/* Desktop hanging tiles */}
          <ul className="hidden lg:flex items-end gap-2 list-none m-0 p-0">
            {links.map((l) => {
              const isActive = active === l.href.slice(1);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`hang-tile-wrap ${isActive ? "is-active" : ""}`}
                    style={
                      {
                        animationDelay: l.delay,
                        ["--rest" as string]: l.rest,
                        ["--peak" as string]: l.peak,
                      } as React.CSSProperties
                    }
                  >
                    <span className="hang-tile" style={{ background: l.bg }} aria-hidden>
                      <span
                        style={{
                          fontSize: 26,
                          lineHeight: 1,
                          filter: "drop-shadow(0 1px 0 rgba(0,0,0,.15))",
                        }}
                      >
                        {l.icon}
                      </span>
                    </span>
                    <span className="hang-tile-label">{l.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Enquire Now CTA */}
          <a
            href="#reach-us"
            className="btn-toy btn-toy-primary flex !py-1.5 !px-3 !text-[11px] sm:!py-2.5 sm:!px-6 sm:!text-sm shrink-0"
          >
            ✨ <span className="hidden xs:inline">Enquire Now</span>
            <span className="xs:hidden">Enquire</span>
          </a>

          {/* Mobile Bottom Navigation Component */}
        </div>
      </nav>

      {/* Mobile-Only Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 w-full z-[100] lg:hidden transition-all duration-300"
        style={{
          background: "var(--background)",
          borderTop: "2px solid var(--border)",
          boxShadow: "0 -4px 16px oklch(0.27 0.12 275 / .1)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <ul className="flex items-center justify-between px-2 h-16 m-0 list-none">
          <li className="flex-1 flex justify-center">
            <a
              href="#home"
              className="flex flex-col items-center gap-1 transition-transform active:scale-95"
            >
              <span
                className="text-xl"
                style={{ filter: active === "home" ? "none" : "opacity(60%)" }}
              >
                🏠
              </span>
              <span
                className={`text-[10px] font-bold ${active === "home" ? "text-primary" : "text-muted-foreground"}`}
                style={{ fontFamily: "var(--font-play)" }}
              >
                Home
              </span>
            </a>
          </li>

          <li className="flex-1 flex justify-center">
            <a
              href="#programs"
              className="flex flex-col items-center gap-1 transition-transform active:scale-95"
            >
              <span
                className="text-xl"
                style={{ filter: active === "programs" ? "none" : "opacity(60%)" }}
              >
                🎨
              </span>
              <span
                className={`text-[10px] font-bold ${active === "programs" ? "text-primary" : "text-muted-foreground"}`}
                style={{ fontFamily: "var(--font-play)" }}
              >
                Programs
              </span>
            </a>
          </li>

          <li className="flex-1 flex justify-center -mt-6 relative z-10">
            <a
              href="#reach-us"
              className="flex flex-col items-center transition-transform hover:-translate-y-1 active:scale-95"
              onClick={() => setActive("reach-us")}
            >
              <div
                className="flex items-center justify-center rounded-full bg-primary text-white border-4 animate-pop"
                style={{
                  width: 54,
                  height: 54,
                  fontSize: 24,
                  borderColor: "var(--background)",
                  boxShadow: "0 4px 12px oklch(0.60 0.22 25 / .4)",
                }}
              >
                ✨
              </div>
              <span
                className="text-[10.5px] font-bold text-primary mt-1 tracking-wide"
                style={{ fontFamily: "var(--font-play)" }}
              >
                ENROLL
              </span>
            </a>
          </li>

          <li className="flex-1 flex justify-center">
            <a
              href="#gallery"
              className="flex flex-col items-center gap-1 transition-transform active:scale-95"
            >
              <span
                className="text-xl"
                style={{ filter: active === "gallery" ? "none" : "opacity(60%)" }}
              >
                🖼️
              </span>
              <span
                className={`text-[10px] font-bold ${active === "gallery" ? "text-primary" : "text-muted-foreground"}`}
                style={{ fontFamily: "var(--font-play)" }}
              >
                Gallery
              </span>
            </a>
          </li>

          <li className="flex-1 flex justify-center">
            <a
              href="#reach-us"
              className="flex flex-col items-center gap-1 transition-transform active:scale-95"
            >
              <span
                className="text-xl"
                style={{ filter: active === "reach-us" ? "none" : "opacity(60%)" }}
              >
                📞
              </span>
              <span
                className={`text-[10px] font-bold ${active === "reach-us" ? "text-primary" : "text-muted-foreground"}`}
                style={{ fontFamily: "var(--font-play)" }}
              >
                Contact
              </span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}
