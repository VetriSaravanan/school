import { useEffect, useRef, useState } from "react";
import { SectionDeco } from "./decorations";
import { supabase, SUPABASE_CONFIGURED } from "@/lib/supabase";
import { toast } from "sonner";
import { OptimizedImage } from "./optimized-image";
import { cachedQuery } from "@/lib/query-cache";

/* ============= TYPES ============= */
type HomeContent = {
  hero_title: string;
  hero_subtitle: string;
  hero_bg_url: string | null;
  hero_visual_url: string | null;
  cta1_text: string;
  cta1_link: string;
  cta2_text: string;
  cta2_link: string;
  stat_years: number;
  stat_students: number;
  stat_teachers: number;
  stat_branches: number;
};
type AboutContent = { who_we_are_text: string; mission: string; vision: string };
type GalCategory = { id: string; name: string; slug: string; order_index: number };
type GalImage = {
  id: string;
  image_url: string;
  caption: string | null;
  category_id: string | null;
};
type Blog = {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  cover_url: string | null;
  author: string;
  created_at: string;
};
type Announcement = {
  id: string;
  title: string;
  description: string | null;
  badge_color: string;
  announcement_date: string;
  is_pinned: boolean;
};
type Branch = {
  id: string;
  branch_name: string;
  address: string;
  map_embed_url: string | null;
  phone: string;
  order_index: number;
};
type SiteSettings = {
  school_name: string;
  tagline: string;
  logo_url: string | null;
  phone1: string;
  phone2: string;
  email: string;
  fb_url: string | null;
  ig_url: string | null;
  yt_url: string | null;
  wa_number: string;
};

/* ============= COUNTER ============= */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const dur = 1800;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min((t - start) / dur, 1);
              setVal(Math.floor(p * target));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            obs.disconnect();
          }
        });
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/* ============= HERO ============= */
export function Hero() {
  const [data, setData] = useState<HomeContent | null>(null);

  useEffect(() => {
    cachedQuery("home_content", () =>
      supabase
        .from("home_content")
        .select("*")
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data as HomeContent),
    ).then((row) => {
      if (row) setData(row);
    });
  }, []);

  const title = data?.hero_title || "Learning is Fun & Joyful Here!";
  const subtitle =
    data?.hero_subtitle ||
    "A pioneer in Multiple-Intelligence-based Learning and Development in Tirunelveli. We nurture every child's unique potential through Montessori, Reggio Emilia & Play Way approach. 🎨";
  const heroBg = data?.hero_bg_url;
  const heroVisual = data?.hero_visual_url || "/hero-boy.png";
  /* CTA text — admin can override; fallback uses "Enquire Now" */
  const cta1Text = data?.cta1_text || "⭐ Enquire Now";
  const cta1Link = data?.cta1_link || "#reach-us";
  const cta2Text = data?.cta2_text || "🖼️ Take a Tour";
  const cta2Link = data?.cta2_link || "#gallery";
  const stats = [
    { num: data?.stat_years ?? 7, suf: "+", label: "Years" },
    { num: data?.stat_students ?? 500, suf: "+", label: "Students" },
    { num: data?.stat_teachers ?? 20, suf: "+", label: "Teachers" },
    { num: data?.stat_branches ?? 2, suf: "", label: "Branches" },
  ];

  return (
    <section
      id="home"
      className="relative overflow-hidden flex items-center"
      style={{
        minHeight: "auto",
        background: heroBg
          ? `url(${heroBg}) center/cover no-repeat`
          : "linear-gradient(135deg, oklch(0.95 0.04 230) 0%, oklch(0.97 0.03 70) 40%, oklch(0.96 0.04 320) 100%)",
      }}
    >
      {heroBg && <div className="absolute inset-0" style={{ background: "oklch(0 0 0 / .45)" }} />}
      <SectionDeco variant="hero" />

      <div className="relative z-10 max-w-[1240px] mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center pt-10 pb-12 lg:pt-20 lg:pb-16">
          {/* Text */}
          <div>
            <div
              className="inline-flex items-center gap-2 bg-white px-5 py-2 rounded-full mb-5"
              style={{
                border: "2.5px solid var(--secondary)",
                fontFamily: "var(--font-play)",
                fontSize: 13,
                color: "var(--navy)",
                fontWeight: 700,
                boxShadow: "0 4px 12px oklch(0.88 0.16 90 / .25)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pop"
                style={{ background: "var(--primary)" }}
              />
              Est. 2018 • Tirunelveli's #1 Preschool
            </div>

            <h1
              className="leading-[1.05] mb-5"
              style={{
                fontFamily: "var(--font-play)",
                fontSize: "clamp(34px, 5vw, 62px)",
                color: heroBg ? "#fff" : "var(--navy)",
                textShadow: heroBg
                  ? "2px 2px 8px oklch(0 0 0 / .5)"
                  : "3px 3px 0 var(--secondary), 5px 5px 0 oklch(0 0 0 / .07)",
              }}
            >
              {title}
            </h1>

            <p
              className="text-[17px] leading-[1.7] mb-8 max-w-[490px]"
              style={{ color: heroBg ? "oklch(1 0 0 / .9)" : "var(--muted-foreground)" }}
            >
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4 mb-9">
              <a href={cta1Link} className="btn-toy btn-toy-primary">
                {cta1Text}
              </a>
              <a href={cta2Link} className="btn-toy btn-toy-secondary">
                {cta2Text}
              </a>
            </div>

            <div className="flex flex-wrap gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="bg-card text-center px-5 py-3.5 rounded-2xl"
                  style={{
                    border: "2.5px solid var(--border)",
                    boxShadow: "0 4px 12px oklch(0 0 0 / .05)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-play)",
                      fontSize: 30,
                      color: "var(--primary)",
                      lineHeight: 1,
                    }}
                  >
                    <Counter target={s.num} suffix={s.suf} />
                  </div>
                  <div
                    className="text-xs font-semibold mt-1"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="relative flex justify-center items-center w-full">
            <div className="w-full max-w-[550px] relative px-4 lg:px-0">
              <OptimizedImage 
                src={heroVisual} 
                alt="Payitragam Preschool" 
                width={800}
                eager
                imgClassName="w-full h-auto animate-float object-contain relative z-10 mx-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============= WHY — 7 items ============= */
const features = [
  {
    icon: "🌍",
    title: "International Curriculum",
    desc: "Multiple Intelligence-based international curriculum delivering holistic development across all learning domains.",
    color: "var(--primary)",
    bg: "oklch(0.71 0.18 40 / .1)",
  },
  {
    icon: "🌿",
    title: "Reggio Emilia",
    desc: "Child-led inquiry, collaborative projects, and environment as the third teacher — letting curiosity guide discovery.",
    color: "var(--accent)",
    bg: "oklch(0.65 0.21 17 / .1)",
  },
  {
    icon: "🧩",
    title: "Montessori Method",
    desc: "Hands-on, self-paced learning with specially designed materials that build independence, focus, and confidence.",
    color: "var(--teal)",
    bg: "oklch(0.78 0.14 175 / .12)",
  },
  {
    icon: "🎮",
    title: "Play Way Approach",
    desc: "Learning through play — because the best classroom is one where children don't even know they're studying!",
    color: "var(--secondary)",
    bg: "oklch(0.88 0.16 90 / .15)",
  },
  {
    icon: "👩‍🏫",
    title: "Well-Trained Teachers",
    desc: "Certified, loving, and child-centric teachers who understand every child's unique learning style.",
    color: "var(--purple)",
    bg: "oklch(0.55 0.16 305 / .12)",
  },
  {
    icon: "👶",
    title: "10:1 Child-Adult Ratio",
    desc: "Low ratio ensures every child receives personalized attention, guidance, and love throughout the day.",
    color: "var(--teal)",
    bg: "oklch(0.78 0.14 175 / .12)",
  },
  {
    icon: "🏗️",
    title: "Safe Learning Spaces",
    desc: "Our campuses include permanent, sturdy buildings with separate washrooms, child-sized furniture, certified fire safety, clean drinking water, and secure play areas for hygienic, risk-free daily routines.",
    color: "var(--royal)",
    bg: "oklch(0.52 0.16 258 / .1)",
  },
];

export function Why() {
  return (
    <section
      id="why"
      className="relative overflow-hidden py-24"
      style={{ background: "var(--card)" }}
    >
      <SectionDeco variant="stars" />
      <div
        className="absolute -top-16 -right-16 pointer-events-none"
        style={{
          width: 300,
          height: 300,
          background: "radial-gradient(circle, oklch(0.88 0.16 90 / .18) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="text-center">
          <div
            className="section-label"
            style={{
              background: "oklch(0.71 0.18 40 / .12)",
              color: "var(--primary)",
              border: "1.5px solid oklch(0.71 0.18 40 / .25)",
            }}
          >
            ✨ Why Payitragam?
          </div>
          <h2 className="section-title">Why Choose Our Preschool?</h2>
          <p className="section-sub">
            We blend the best global methodologies to create a rich, nurturing learning environment
            where every child shines.
          </p>
        </div>
        {/* 3-col grid; 7th item centered on its row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className={`toy-card${i === 6 ? " lg:col-start-2" : ""}`}
              style={{ borderTop: `4px solid ${f.color}`, background: "var(--background)" }}
            >
              <span
                className="absolute"
                style={{
                  top: 16,
                  right: 18,
                  fontFamily: "var(--font-play)",
                  fontSize: 48,
                  color: "oklch(0 0 0 / .05)",
                  lineHeight: 1,
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className="flex items-center justify-center mb-4"
                style={{
                  width: 70,
                  height: 70,
                  borderRadius: 20,
                  background: f.bg,
                  fontSize: 32,
                  border: "2px solid oklch(1 0 0 / .5)",
                }}
              >
                <span>{f.icon}</span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-play)",
                  fontSize: 20,
                  color: "var(--navy)",
                  marginBottom: 10,
                }}
              >
                {f.title}
              </h3>
              <p className="text-[14px] leading-[1.7]" style={{ color: "var(--muted-foreground)" }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============= ABOUT ============= */
export function About() {
  const [data, setData] = useState<AboutContent | null>(null);

  useEffect(() => {
    cachedQuery("about_content", () =>
      supabase
        .from("about_content")
        .select("who_we_are_text, mission, vision")
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data as AboutContent),
    ).then((row) => {
      if (row) setData(row);
    });
  }, []);

  const whoWeAre =
    data?.who_we_are_text?.trim() ||
    "We NELLAIAPPAR KANTHIMATHI PAYITRAGAM are a trailblazer in Multiple-Intelligence-based Learning and Development, located in Tirunelveli, Tamilnadu. Founded in 2018, our primary focus is on providing training for both students and teachers. We proudly operate Preschools in South Balabakiya Nagar and Maharaja Nagar. We also offer Diploma Courses in Montessori and Early Childhood Education Teacher Training.";
  const mission =
    data?.mission?.trim() ||
    "Provide every child a safe, joyful environment that nurtures their unique multiple intelligences.";
  const vision =
    data?.vision?.trim() ||
    "Become the most trusted name in early childhood education across Tamilnadu.";

  return (
    <section
      id="about"
      className="relative overflow-hidden py-24"
      style={{ background: "linear-gradient(135deg, oklch(0.96 0.04 320) 0%, var(--muted) 100%)" }}
    >
      <SectionDeco variant="garden" />
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="relative">
            <div
              className="bg-card text-center relative overflow-hidden"
              style={{
                borderRadius: 28,
                border: "3px solid var(--border)",
                padding: 36,
                boxShadow: "var(--shadow-toy)",
              }}
            >
              <div
                className="absolute top-0 left-0 right-0"
                style={{
                  height: 5,
                  background: "linear-gradient(90deg, var(--primary), var(--accent), var(--teal))",
                }}
              />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] opacity-[.07]">
                🎓
              </div>
              <div
                style={{
                  fontFamily: "var(--font-play)",
                  fontSize: 80,
                  color: "var(--primary)",
                  lineHeight: 1,
                  textShadow: "4px 4px 0 oklch(0.71 0.18 40 / .2)",
                }}
              >
                2018
              </div>
              <div
                className="text-[15px] font-semibold mt-1"
                style={{ color: "var(--muted-foreground)" }}
              >
                Founded in Tirunelveli
              </div>
              <div className="grid grid-cols-2 gap-3 mt-6">
                {[
                  {
                    num: "500+",
                    lbl: "Students",
                    c: "var(--primary)",
                    bg: "oklch(0.71 0.18 40 / .1)",
                  },
                  { num: "2", lbl: "Branches", c: "var(--teal)", bg: "oklch(0.78 0.14 175 / .12)" },
                  {
                    num: "20+",
                    lbl: "Teachers",
                    c: "var(--accent)",
                    bg: "oklch(0.65 0.21 17 / .1)",
                  },
                  { num: "7+", lbl: "Years", c: "var(--purple)", bg: "oklch(0.55 0.16 305 / .12)" },
                ].map((m) => (
                  <div
                    key={m.lbl}
                    style={{ background: m.bg, borderRadius: 14, padding: 14 }}
                    className="text-center"
                  >
                    <div style={{ fontFamily: "var(--font-play)", fontSize: 28, color: m.c }}>
                      {m.num}
                    </div>
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {m.lbl}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="absolute animate-float"
              style={{
                bottom: -20,
                right: -20,
                background: "#fff",
                borderRadius: 16,
                border: "2.5px solid var(--border)",
                padding: "14px 18px",
                boxShadow: "var(--shadow-toy)",
                fontFamily: "var(--font-play)",
                textAlign: "center",
              }}
            >
              <div className="text-[22px]">🏅</div>
              <div style={{ fontSize: 13, color: "var(--navy)", marginTop: 4 }}>Certified</div>
            </div>
            <div
              className="absolute animate-float-r"
              style={{
                top: -20,
                left: -20,
                background: "#fff",
                borderRadius: 16,
                border: "2.5px solid var(--border)",
                padding: "14px 18px",
                boxShadow: "var(--shadow-toy)",
                fontFamily: "var(--font-play)",
                textAlign: "center",
              }}
            >
              <div className="text-[22px]">🌟</div>
              <div style={{ fontSize: 13, color: "var(--navy)", marginTop: 4 }}>Trusted</div>
            </div>
          </div>

          <div>
            <div
              className="section-label"
              style={{
                background: "oklch(0.65 0.21 17 / .1)",
                color: "var(--accent)",
                border: "1.5px solid oklch(0.65 0.21 17 / .25)",
              }}
            >
              ℹ️ About Us
            </div>
            <h2 className="section-title">Who Are We?</h2>
            {whoWeAre
              .split("\n\n")
              .filter(Boolean)
              .map((para, i) => (
                <p
                  key={i}
                  className="text-[15.5px] leading-[1.8] mb-5"
                  style={{ color: "var(--muted-foreground)" }}
                  dangerouslySetInnerHTML={{
                    __html: para.replace(
                      /\*\*(.*?)\*\*/g,
                      '<strong style="color:var(--navy)">$1</strong>',
                    ),
                  }}
                />
              ))}
            <div className="flex flex-wrap gap-2.5 mb-7">
              {[
                {
                  lbl: "Montessori",
                  c: "var(--teal)",
                  bg: "oklch(0.78 0.14 175 / .12)",
                  b: "oklch(0.78 0.14 175 / .35)",
                },
                {
                  lbl: "Reggio Emilia",
                  c: "var(--primary)",
                  bg: "oklch(0.71 0.18 40 / .1)",
                  b: "oklch(0.71 0.18 40 / .3)",
                },
                {
                  lbl: "Play Way",
                  c: "oklch(0.5 0.13 80)",
                  bg: "oklch(0.88 0.16 90 / .18)",
                  b: "oklch(0.88 0.16 90 / .4)",
                },
                {
                  lbl: "Diploma Courses",
                  c: "var(--purple)",
                  bg: "oklch(0.55 0.16 305 / .12)",
                  b: "oklch(0.55 0.16 305 / .3)",
                },
              ].map((p) => (
                <div
                  key={p.lbl}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold"
                  style={{
                    background: p.bg,
                    color: p.c,
                    border: `2px solid ${p.b}`,
                    fontFamily: "var(--font-play)",
                  }}
                >
                  ✅ {p.lbl}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div
                className="bg-card rounded-2xl p-4"
                style={{ border: "2px solid var(--border)" }}
              >
                <h4
                  style={{
                    fontFamily: "var(--font-play)",
                    fontSize: 14,
                    color: "var(--primary)",
                    marginBottom: 6,
                  }}
                >
                  🎯 Our Mission
                </h4>
                <p
                  className="text-[12.5px] leading-[1.6]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {mission}
                </p>
              </div>
              <div
                className="bg-card rounded-2xl p-4"
                style={{ border: "2px solid var(--border)" }}
              >
                <h4
                  style={{
                    fontFamily: "var(--font-play)",
                    fontSize: 14,
                    color: "var(--accent)",
                    marginBottom: 6,
                  }}
                >
                  👁️ Our Vision
                </h4>
                <p
                  className="text-[12.5px] leading-[1.6]"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {vision}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============= PROGRAMS ============= */
const defaultPrograms = [
  {
    key: "playground",
    emoji: "🛝",
    tab: "Playground",
    age: "All Ages",
    title: "Our Playground",
    color: "var(--primary)",
    bg: "linear-gradient(135deg, oklch(0.95 0.04 220), oklch(0.97 0.04 150))",
    desc: "Designed with child safety as the top priority. Spacious outdoor areas, age-appropriate equipment, and a 10:1 child-to-adult ratio give every child the space to explore, play, and grow.",
    features: [
      "Safe outdoor play equipment",
      "10:1 Child-Adult Ratio",
      "Spacious play area",
      "Supervised at all times",
      "Age-appropriate activities",
      "Nature exploration zone",
    ],
  },
  {
    key: "nursery",
    emoji: "🌸",
    tab: "Nursery",
    age: "2–3 Years",
    title: "Nursery",
    color: "var(--accent)",
    bg: "linear-gradient(135deg, oklch(0.95 0.04 0), oklch(0.97 0.03 70))",
    desc: "Our Nursery program uses Montessori and Reggio Emilia approaches to introduce toddlers to learning through play, sensory experiences, and gentle guided exploration in a warm home-like environment.",
    features: [
      "Montessori-inspired learning",
      "Sensory play activities",
      "Language development",
      "Social skill building",
      "Art and music exploration",
      "Gentle daily routines",
    ],
  },
  {
    key: "junior",
    emoji: "🌟",
    tab: "Junior KG",
    age: "3–4 Years",
    title: "Junior KG",
    color: "oklch(0.5 0.13 80)",
    bg: "linear-gradient(135deg, oklch(0.97 0.06 95), oklch(0.97 0.03 70))",
    desc: "Junior KG builds on early foundations with Multiple Intelligence-based activities. We nurture linguistic, logical, musical, spatial, and interpersonal intelligences through structured yet playful curriculum.",
    features: [
      "Multiple Intelligence approach",
      "Reggio Emilia projects",
      "Number and letter readiness",
      "Creative arts program",
      "Physical education",
      "International curriculum",
    ],
  },
  {
    key: "senior",
    emoji: "🎓",
    tab: "Senior KG",
    age: "4–5 Years",
    title: "Senior KG",
    color: "var(--purple)",
    bg: "linear-gradient(135deg, oklch(0.93 0.04 305), oklch(0.95 0.04 0))",
    desc: "Senior KG prepares children for primary school with confidence. Our child-centric approach ensures academic readiness while maintaining the joy of learning through play, collaboration, and critical thinking.",
    features: [
      "School readiness program",
      "Reading and writing foundation",
      "Mathematical thinking",
      "Science exploration",
      "Leadership activities",
      "Parent-teacher collaboration",
    ],
  },
];

export function Programs() {
  const [active, setActive] = useState("playground");
  const [data, setData] = useState(defaultPrograms);
  const [homeData, setHomeData] = useState<any>(null);

  useEffect(() => {
    cachedQuery("home_content", () =>
      supabase
        .from("home_content")
        .select("*")
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data),
    ).then((data) => {
      if (data) setHomeData(data);
    });

    cachedQuery("sections_content", () =>
      supabase
        .from("sections_content")
        .select("*")
        .then(({ data }) => data),
    ).then((rows) => {
      if (!rows || rows.length === 0) {
        setData([]);
        return;
      }
      setData(() => {
        const activeKeysInDb = rows.map((r) => r.section_key);
        const basePrograms = defaultPrograms.filter((p) => {
          const searchKey =
            p.key === "junior" ? "junior_kg" : p.key === "senior" ? "senior_kg" : p.key;
          return activeKeysInDb.includes(searchKey);
        });

        const merged = [...basePrograms];
        rows.forEach((r) => {
          const searchKey =
            r.section_key === "junior_kg"
              ? "junior"
              : r.section_key === "senior_kg"
                ? "senior"
                : r.section_key;
          const existingIdx = merged.findIndex((p) => p.key === searchKey);
          if (existingIdx >= 0) {
            merged[existingIdx] = {
              ...merged[existingIdx],
              tab: r.title || merged[existingIdx].tab, // Fixes renaming the tab button
              title: r.title || merged[existingIdx].title,
              desc: r.description || merged[existingIdx].desc,
              features:
                Array.isArray(r.features) && r.features.length > 0
                  ? (r.features as string[])
                  : merged[existingIdx].features,
            };
          } else {
            merged.push({
              key: r.section_key,
              emoji: "⭐",
              tab: r.title || r.section_key,
              age: "All Ages",
              title: r.title || "New Program",
              color: "var(--teal)",
              bg: "linear-gradient(135deg, oklch(0.95 0.04 0), oklch(0.97 0.03 70))",
              desc: r.description || "",
              features: Array.isArray(r.features) ? (r.features as string[]) : [],
            });
          }
        });
        return merged;
      });
    });
  }, []);

  const cur = data.find((p) => p.key === active) || data[0];
  if (!cur) return null;

  return (
    <section
      id="programs"
      className="relative overflow-hidden py-24"
      style={{ background: "var(--card)" }}
    >
      <SectionDeco variant="school" />
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="text-center">
          <div
            className="section-label"
            style={{
              background: "oklch(0.78 0.14 175 / .12)",
              color: "var(--teal)",
              border: "1.5px solid oklch(0.78 0.14 175 / .3)",
            }}
          >
            {homeData?.programs_label || "📚 Our Programs"}
          </div>
          <h2 className="section-title">{homeData?.programs_title || "Explore Our Classes"}</h2>
          <p className="section-sub">
            {homeData?.programs_subtitle ||
              "Age-appropriate programs designed with love, expertise, and a whole lot of fun for every little learner!"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mb-10">
          {data.map((p) => {
            const isActive = active === p.key;
            return (
              <button
                key={p.key}
                onClick={() => setActive(p.key)}
                className="px-6 py-3 rounded-full font-bold text-[14px] transition-all"
                style={{
                  fontFamily: "var(--font-play)",
                  background: isActive ? p.color : "var(--background)",
                  color: isActive ? "#fff" : "var(--navy)",
                  border: `2.5px solid ${isActive ? p.color : "var(--border)"}`,
                  boxShadow: isActive ? `0 6px 0 oklch(0 0 0 / .12)` : "none",
                  transform: isActive ? "translateY(-2px)" : "translateY(0)",
                }}
              >
                {p.emoji} {p.tab}
              </button>
            );
          })}
        </div>
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div
              className="inline-block px-4 py-1.5 rounded-full mb-4 text-[13px] font-bold"
              style={{
                border: `2px solid ${cur.color}`,
                color: cur.color,
                fontFamily: "var(--font-play)",
              }}
            >
              {cur.emoji} {cur.age}
            </div>
            <h3
              style={{
                fontFamily: "var(--font-play)",
                fontSize: 36,
                color: "var(--navy)",
                marginBottom: 14,
              }}
            >
              {cur.title}
            </h3>
            <p
              className="text-[15px] leading-[1.8] mb-6"
              style={{ color: "var(--muted-foreground)" }}
            >
              {cur.desc}
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 list-none">
              {cur.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[14px]"
                  style={{ color: "var(--foreground)" }}
                >
                  <span
                    className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[11px] mt-0.5"
                    style={{ background: cur.color, color: "#fff" }}
                  >
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a href="#reach-us" className="btn-toy btn-toy-primary mt-7">
              📞 Enquire about {cur.tab}
            </a>
          </div>
          <div
            className="relative rounded-[28px] overflow-hidden flex items-center justify-center"
            style={{
              background: cur.bg,
              border: "3px solid var(--border)",
              minHeight: 380,
              boxShadow: "var(--shadow-toy)",
            }}
          >
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                height: 6,
                background: `linear-gradient(90deg, ${cur.color}, var(--primary))`,
              }}
            />
            <div className="text-[180px] animate-bounce-fun">{cur.emoji}</div>
            <Star color="var(--secondary)" position={{ top: "10%", right: "10%" }} />
            <Star color="var(--accent)" delay={0.6} position={{ bottom: "10%", left: "10%" }} />
            <Star color="var(--primary)" delay={1.2} position={{ top: "50%", left: "5%" }} small />
          </div>
        </div>
      </div>
    </section>
  );
}

function Star({
  color,
  delay = 0,
  position,
  small = false,
}: {
  color: string;
  delay?: number;
  position: React.CSSProperties;
  small?: boolean;
}) {
  const size = small ? 18 : 26;
  return (
    <svg
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
      className="animate-twinkle absolute"
      style={{ width: size, height: size, animationDelay: `${delay}s`, ...position }}
      aria-hidden
    >
      <polygon
        points="13,2 15.5,9.5 23,9.5 17,14.5 19.5,22 13,17.5 6.5,22 9,14.5 3,9.5 10.5,9.5"
        fill={color}
      />
    </svg>
  );
}

/* ============= ACTIVITY ZONES (replaces Playground section) ============= */
const activityItems = [
  {
    icon: "🔤",
    title: "Phonics Zone",
    desc: "Structured phonics sessions build strong reading foundations with play-based letter recognition activities.",
  },
  {
    icon: "🎨",
    title: "Arts & Crafts",
    desc: "Fine motor skill development through painting, clay, and craft activities that spark imagination.",
  },
  {
    icon: "✍️",
    title: "Cursive",
    desc: "Mindful handwriting and cursive sessions that blend focus with creative self-expression.",
  },
  {
    icon: "📖",
    title: "Storytelling Hub",
    desc: "Language-rich storytelling sessions nurture listening, comprehension, and communication skills.",
  },
  {
    icon: "🌿",
    title: "Outdoor Play",
    desc: "Structured outdoor activities aligned with Panchkosha routines for balanced physical and mental growth.",
  },
  {
    icon: "🧸",
    title: "Hobby Corners",
    desc: "Dedicated creativity zones encourage children to explore interests without overwhelming young minds.",
  },
];

export function Playground() {
  return (
    <section
      id="playground"
      className="relative overflow-hidden py-24"
      style={{
        background: "linear-gradient(135deg, oklch(0.95 0.05 220) 0%, oklch(0.97 0.04 150) 100%)",
      }}
    >
      <SectionDeco variant="sunny" />
      <svg
        className="absolute bottom-0 left-0 w-full opacity-10 pointer-events-none"
        viewBox="0 0 1200 80"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0,40 Q300,0 600,40 Q900,80 1200,40 L1200,80 L0,80Z" fill="var(--teal)" />
      </svg>
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="text-center">
          <div
            className="section-label"
            style={{
              background: "oklch(0.78 0.14 175 / .15)",
              color: "var(--teal)",
              border: "1.5px solid oklch(0.78 0.14 175 / .3)",
            }}
          >
            🎯 Learn & Explore
          </div>
          <h2 className="section-title">Activity Zones</h2>
          <p className="section-sub">
            Dedicated indoor zones host phonics, arts, cursive, and storytelling sessions,
            blending fine motor activities with language skills in a non-rote, play-based setup.
            Outdoor spaces promote physical development through structured play, aligning with
            Panchkosha-integrated routines for balanced growth.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activityItems.map((p) => (
            <div
              key={p.title}
              className="toy-card text-center"
              style={{ background: "var(--card)" }}
            >
              <div
                className="mx-auto flex items-center justify-center mb-4 animate-bounce-fun"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 24,
                  fontSize: 38,
                  background: "linear-gradient(135deg, var(--secondary), var(--primary))",
                  boxShadow: "0 6px 16px oklch(0.71 0.18 40 / .25)",
                }}
              >
                {p.icon}
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-play)",
                  fontSize: 19,
                  color: "var(--navy)",
                  marginBottom: 8,
                }}
              >
                {p.title}
              </h3>
              <p className="text-[14px] leading-[1.6]" style={{ color: "var(--muted-foreground)" }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============= GALLERY COMPONENT ============= */
function GalleryItem({ imgUrl, caption }: { imgUrl: string; caption: string }) {
  const [ratioClass, setRatioClass] = useState("square opacity-0");

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    if (naturalWidth && naturalHeight) {
      const ratio = naturalWidth / naturalHeight;
      let cl = "square";
      if (ratio > 1.7) cl = "banner";
      else if (ratio > 1.1) cl = "landscape";
      else if (ratio >= 0.85) cl = "square";
      else if (ratio >= 0.6) cl = "portrait";
      else cl = "portrait-tall";

      // Remove opacity-0 once loaded
      setRatioClass(cl + " opacity-100");
    }
  };

  return (
    <div
      className={`gallery-item ${ratioClass} relative rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500`}
      style={{
        border: "3px solid var(--border)",
        boxShadow: "var(--shadow-toy)",
        marginBottom: 16,
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = "translateY(-6px) rotate(-1deg)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.transform = "translateY(0) rotate(0)")
      }
    >
      <OptimizedImage
        src={imgUrl}
        alt={caption}
        width={400}
        onLoad={handleLoad}
        imgClassName="w-full h-full object-cover"
      />
      {caption && (
        <div
          className="absolute bottom-0 left-0 right-0 p-3 text-white text-[13px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
          style={{
            background: "linear-gradient(0deg, oklch(0 0 0 / .7), transparent)",
            fontFamily: "var(--font-play)",
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
}

/* ============= GALLERY ============= */
export function Gallery() {
  const [cats, setCats] = useState<GalCategory[]>([]);
  const [imgs, setImgs] = useState<GalImage[]>([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [cData, iData] = await Promise.all([
        cachedQuery("gallery_categories", () =>
          supabase.from("gallery_categories").select("*").order("order_index").then(({ data }) => data),
        ),
        cachedQuery("gallery_images", () =>
          supabase
            .from("gallery_images")
            .select("*")
            .order("order_index")
            .order("created_at", { ascending: false })
            .then(({ data }) => data),
        ),
      ]);
      setCats((cData ?? []) as GalCategory[]);
      setImgs((iData ?? []) as GalImage[]);
      setLoading(false);
    }
    load();
  }, []);

  const allCatNames = ["All", ...cats.filter((c) => c.slug !== "all").map((c) => c.name)];
  const filteredImgs =
    filter === "All"
      ? imgs
      : imgs.filter((img) => {
        const cat = cats.find((c) => c.name === filter);
        return cat && img.category_id === cat.id;
      });

  return (
    <section
      id="gallery"
      className="relative overflow-hidden py-24"
      style={{ background: "var(--card)" }}
    >
      <SectionDeco variant="balloons" />
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="text-center">
          <div
            className="section-label"
            style={{
              background: "oklch(0.55 0.16 305 / .12)",
              color: "var(--purple)",
              border: "1.5px solid oklch(0.55 0.16 305 / .3)",
            }}
          >
            🖼️ Gallery
          </div>
          <h2 className="section-title">Moments at Payitragam</h2>
          <p className="section-sub">
            Every day is a celebration! Peek into the joyful world of Payitragam Preschools.
          </p>
        </div>

        {/* Category filters — only shown when real data exists */}
        {!loading && imgs.length > 0 && (
          <div className="flex flex-wrap gap-2.5 justify-center mb-8">
            {allCatNames.map((c) => {
              const isActive = filter === c;
              return (
                <button
                  key={c}
                  onClick={() => setFilter(c)}
                  className="px-5 py-2 rounded-full text-[13px] font-bold transition-all"
                  style={{
                    fontFamily: "var(--font-play)",
                    background: isActive ? "var(--primary)" : "var(--background)",
                    color: isActive ? "#fff" : "var(--navy)",
                    border: `2px solid ${isActive ? "var(--primary)" : "var(--border)"}`,
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          /* Skeleton */
          <div className="gallery-masonry" style={{ opacity: 0.5 }}>
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="gallery-item square animate-pulse bg-muted block"
                style={{ border: "3px solid var(--border)" }}
              />
            ))}
          </div>
        ) : imgs.length > 0 ? (
          /* Real images from Supabase */
          filteredImgs.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              No images in this category yet.
            </div>
          ) : (
            <div className="gallery-masonry">
              {filteredImgs.map((img) => {
                const cat = cats.find((c) => c.id === img.category_id);
                return (
                  <GalleryItem
                    key={img.id}
                    imgUrl={img.image_url}
                    caption={img.caption ?? cat?.name ?? "Gallery"}
                  />
                );
              })}
            </div>
          )
        ) : (
          /* No images uploaded yet — clean empty state */
          <div className="text-center py-20">
            <div className="text-[64px] mb-4">🖼️</div>
            <p
              className="text-[16px] font-semibold"
              style={{ color: "var(--muted-foreground)", fontFamily: "var(--font-play)" }}
            >
              Gallery coming soon!
            </p>
            <p className="text-[14px] mt-2" style={{ color: "var(--muted-foreground)" }}>
              Check back after the admin uploads photos.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============= BLOG DETAIL MODAL ============= */
function BlogModal({ blog, onClose }: { blog: Blog; onClose: () => void }) {
  const dateStr = new Date(blog.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "oklch(0 0 0 / .6)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
        aria-hidden
      />
      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={blog.title}
        className="fixed inset-x-4 top-[5vh] z-50 mx-auto overflow-hidden"
        style={{
          maxWidth: 780,
          maxHeight: "90vh",
          background: "var(--card)",
          borderRadius: 24,
          border: "3px solid var(--border)",
          boxShadow: "0 24px 80px oklch(0 0 0 / .35)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Gradient top bar */}
        <div
          style={{
            height: 5,
            background: "linear-gradient(90deg, var(--primary), var(--secondary), var(--accent))",
            flexShrink: 0,
          }}
        />

        {/* Header row */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1.5px solid var(--border)", flexShrink: 0 }}
        >
          <div className="flex items-center gap-3">
            <span
              className="px-3 py-1 rounded-full text-[11px] font-bold text-white"
              style={{ background: "var(--primary)", fontFamily: "var(--font-play)" }}
            >
              {blog.author}
            </span>
            <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
              {dateStr}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center rounded-full transition-colors hover:bg-muted"
            style={{ width: 36, height: 36, fontSize: 20, color: "var(--muted-foreground)" }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 px-6 py-6">
          {blog.cover_url && (
            <div
              className="rounded-2xl overflow-hidden mb-6"
              style={{ border: "2px solid var(--border)", maxHeight: 300 }}
            >
              <OptimizedImage
                src={blog.cover_url}
                alt={blog.title}
                width={800}
                imgClassName="w-full h-full object-cover"
                style={{ maxHeight: 300 }}
              />
            </div>
          )}
          <h2
            style={{
              fontFamily: "var(--font-play)",
              fontSize: "clamp(22px, 3vw, 30px)",
              color: "var(--navy)",
              marginBottom: 12,
              lineHeight: 1.2,
            }}
          >
            {blog.title}
          </h2>
          {blog.excerpt && (
            <p
              className="text-[15px] leading-[1.7] mb-6 font-medium"
              style={{
                color: "var(--muted-foreground)",
                borderLeft: "3px solid var(--primary)",
                paddingLeft: 14,
              }}
            >
              {blog.excerpt}
            </p>
          )}
          {blog.content ? (
            <div
              className="prose prose-sm max-w-none text-[15px] leading-[1.8]"
              style={{ color: "var(--foreground)" }}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          ) : (
            <p className="text-[15px] leading-[1.8]" style={{ color: "var(--muted-foreground)" }}>
              Full article content coming soon.
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex justify-end"
          style={{ borderTop: "1.5px solid var(--border)", flexShrink: 0 }}
        >
          <button onClick={onClose} className="btn-toy btn-toy-secondary !py-2 !px-6 !text-sm">
            ← Back to Blogs
          </button>
        </div>
      </div>
    </>
  );
}

/* ============= BLOGS ============= */
const fallbackBlogs = [
  {
    tag: "Parenting",
    color: "var(--primary)",
    date: "—",
    title: "10 Tips to Make Mornings Easier with Toddlers",
    excerpt:
      "Smooth out chaotic mornings with these tried-and-tested tricks every preschool parent should know.",
    emoji: "🌅",
  },
  {
    tag: "Learning",
    color: "var(--teal)",
    date: "—",
    title: "Why Multiple Intelligence Matters",
    excerpt: "Discover how Howard Gardner's theory shapes the way we teach at Payitragam.",
    emoji: "🧠",
  },
  {
    tag: "Activities",
    color: "var(--accent)",
    date: "—",
    title: "5 Sensory Play Ideas You Can Try at Home",
    excerpt: "Easy, safe, and fun activities to boost your child's curiosity and motor skills.",
    emoji: "🎨",
  },
];

export function Blogs() {
  const [items, setItems] = useState<Blog[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selected, setSelected] = useState<Blog | null>(null);

  useEffect(() => {
    cachedQuery("published_blogs", () =>
      supabase
        .from("blogs")
        .select("id, title, excerpt, content, cover_url, author, created_at")
        .eq("status", "published")
        .order("created_at", { ascending: false })
        .limit(6)
        .then(({ data }) => data),
    ).then((data) => {
      setItems((data ?? []) as Blog[]);
      setLoaded(true);
    });
  }, []);

  return (
    <section
      id="blogs"
      className="relative overflow-hidden py-24"
      style={{ background: "var(--muted)" }}
    >
      <SectionDeco variant="playful" />
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="text-center">
          <div
            className="section-label"
            style={{
              background: "oklch(0.71 0.18 40 / .12)",
              color: "var(--primary)",
              border: "1.5px solid oklch(0.71 0.18 40 / .25)",
            }}
          >
            📝 Blog
          </div>
          <h2 className="section-title">From Our World</h2>
          <p className="section-sub">
            Tips, stories, and insights from the Payitragam family for parents and early childhood
            educators.
          </p>
        </div>

        {loaded && items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.map((b) => {
              const dateStr = new Date(b.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <article
                  key={b.id}
                  className="toy-card flex flex-col"
                  style={{ background: "var(--card)" }}
                >
                  <div
                    className="rounded-2xl mb-4 overflow-hidden flex items-center justify-center"
                    style={{
                      height: 180,
                      border: "2px solid var(--border)",
                      background: "var(--muted)",
                    }}
                  >
                    {b.cover_url ? (
                      <OptimizedImage 
                        src={b.cover_url} 
                        alt={b.title} 
                        width={400}
                        imgClassName="w-full h-full object-cover" 
                      />
                    ) : (
                      <div
                        className="flex items-center justify-center text-[64px] w-full h-full"
                        style={{
                          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
                        }}
                      >
                        📝
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span
                      className="px-3 py-1 rounded-full text-[11px] font-bold text-white"
                      style={{ background: "var(--primary)", fontFamily: "var(--font-play)" }}
                    >
                      {b.author}
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--muted-foreground)" }}>
                      {dateStr}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-play)",
                      fontSize: 19,
                      color: "var(--navy)",
                      marginBottom: 8,
                    }}
                  >
                    {b.title}
                  </h3>
                  {b.excerpt && (
                    <p
                      className="text-[14px] leading-[1.65] mb-4"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      {b.excerpt}
                    </p>
                  )}
                  <button
                    onClick={() => setSelected(b)}
                    className="mt-auto inline-flex items-center gap-1.5 text-[13px] font-bold transition-colors"
                    style={{
                      color: "var(--primary)",
                      fontFamily: "var(--font-play)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Read more →
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          /* Fallback — shown only when no published posts exist */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fallbackBlogs.map((b, i) => (
              <article
                key={i}
                className="toy-card flex flex-col"
                style={{ background: "var(--card)" }}
              >
                <div
                  className="rounded-2xl mb-4 flex items-center justify-center text-[64px]"
                  style={{
                    height: 180,
                    background: `linear-gradient(135deg, ${b.color}, var(--secondary))`,
                    border: "2px solid var(--border)",
                  }}
                >
                  {b.emoji}
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-[11px] font-bold text-white"
                    style={{ background: b.color, fontFamily: "var(--font-play)" }}
                  >
                    {b.tag}
                  </span>
                </div>
                <h3
                  style={{
                    fontFamily: "var(--font-play)",
                    fontSize: 19,
                    color: "var(--navy)",
                    marginBottom: 8,
                  }}
                >
                  {b.title}
                </h3>
                <p
                  className="text-[14px] leading-[1.65] mb-4"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  {b.excerpt}
                </p>
                <span
                  className="mt-auto text-[13px] font-bold"
                  style={{ color: b.color, fontFamily: "var(--font-play)" }}
                >
                  Coming soon…
                </span>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Blog detail modal */}
      {selected && <BlogModal blog={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

/* ============= ANNOUNCEMENTS ============= */
export function Announcements() {
  const [items, setItems] = useState<Announcement[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    cachedQuery("announcements", () =>
      supabase
        .from("announcements")
        .select("*")
        .order("is_pinned", { ascending: false })
        .order("announcement_date", { ascending: false })
        .limit(8)
        .then(({ data }) => data),
    ).then((data) => {
      setItems((data ?? []) as Announcement[]);
      setLoaded(true);
    });
  }, []);

  /* Only show real saved announcements; never show placeholder data */
  const displayItems = loaded && items.length > 0 ? items : null;

  return (
    <section
      id="announcements"
      className="relative overflow-hidden py-24"
      style={{ background: "var(--navy)" }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 500,
          top: -200,
          right: -200,
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.71 0.18 40 / .15) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 300,
          height: 300,
          bottom: -100,
          left: -100,
          borderRadius: "50%",
          background: "radial-gradient(circle, oklch(0.78 0.14 175 / .15) 0%, transparent 70%)",
        }}
      />
      <div className="deco-layer deco-mobile-hide">
        <Star color="var(--secondary)" position={{ top: "12%", left: "8%" }} />
        <Star color="var(--accent)" delay={0.7} position={{ top: "20%", right: "10%" }} />
        <Star color="var(--primary)" delay={1.4} position={{ bottom: "20%", left: "20%" }} />
        <Star color="var(--teal)" delay={1} position={{ bottom: "30%", right: "15%" }} small />
      </div>
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="text-center">
          <div
            className="section-label"
            style={{
              background: "oklch(1 0 0 / .12)",
              color: "#fff",
              border: "1.5px solid oklch(1 0 0 / .25)",
            }}
          >
            📢 Notices
          </div>
          <h2 className="section-title" style={{ color: "#fff" }}>
            Announcements
          </h2>
          <p className="section-sub" style={{ color: "oklch(1 0 0 / .7)" }}>
            Stay updated with the latest news, events, and important notices from Payitragam.
          </p>
        </div>

        {!loaded ? (
          /* Loading skeletons */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl animate-pulse"
                style={{
                  height: 100,
                  background: "oklch(1 0 0 / .08)",
                  border: "2px solid oklch(1 0 0 / .12)",
                }}
              />
            ))}
          </div>
        ) : displayItems ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayItems.map((a) => (
              <div
                key={a.id}
                className="rounded-2xl p-6 transition-transform hover:-translate-y-1"
                style={{
                  background: "oklch(1 0 0 / .06)",
                  border: `2px solid oklch(1 0 0 / .12)`,
                  borderLeft: `5px solid ${a.badge_color}`,
                  backdropFilter: "blur(8px)",
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 flex items-center justify-center rounded-2xl text-[28px]"
                    style={{
                      width: 60,
                      height: 60,
                      background: a.badge_color,
                      boxShadow: `0 6px 16px oklch(0 0 0 / .3)`,
                    }}
                  >
                    📢
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="text-[12px] font-semibold"
                        style={{ color: "oklch(1 0 0 / .6)" }}
                      >
                        {a.announcement_date.includes("-")
                          ? new Date(a.announcement_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                          : a.announcement_date}
                      </div>
                      {a.is_pinned && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: "var(--secondary)", color: "var(--navy)" }}
                        >
                          📌 Pinned
                        </span>
                      )}
                    </div>
                    <h3
                      style={{
                        fontFamily: "var(--font-play)",
                        fontSize: 18,
                        color: "#fff",
                        marginBottom: 6,
                      }}
                    >
                      {a.title}
                    </h3>
                    {a.description && (
                      <p
                        className="text-[14px] leading-[1.6]"
                        style={{ color: "oklch(1 0 0 / .75)" }}
                      >
                        {a.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* No real announcements — clean empty state */
          <div className="text-center py-16">
            <div className="text-[56px] mb-4">📢</div>
            <p
              className="text-[16px] font-semibold"
              style={{ color: "oklch(1 0 0 / .7)", fontFamily: "var(--font-play)" }}
            >
              No announcements yet.
            </p>
            <p className="text-[14px] mt-2" style={{ color: "oklch(1 0 0 / .5)" }}>
              Check back soon for the latest updates from Payitragam.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============= CONTACT ============= */
/* Default branch data used when Supabase table is empty */
const defaultBranches = [
  {
    id: "b1",
    branch_name: "Branch 1 — South Balabakiya Nagar",
    address: "122A, 6th Cross Street, South Balabakiya Nagar, Tirunelveli - 627001",
    map_embed_url: null,
    phone: "",
    order_index: 0,
    color: "var(--primary)",
    mapLink: "https://maps.app.goo.gl/c6Uva2GCuDAPq4iK6",
  },
  {
    id: "b2",
    branch_name: "Branch 2 — Maharaja Nagar",
    address: "Maharaja Nagar, Tirunelveli, Tamilnadu - 627011",
    map_embed_url: null,
    phone: "",
    order_index: 1,
    color: "var(--teal)",
    mapLink: "https://maps.app.goo.gl/tseH83JuShbawQsSA",
  },
];

function googleMapsLink(address: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(address)}`;
}

export function ReachUs() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", age: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [settings, setSettings] = useState<{ phone1?: string, phone2?: string } | null>(null);

  useEffect(() => {
    cachedQuery("branches", () =>
      supabase
        .from("branches")
        .select("*")
        .order("order_index")
        .then(({ data }) => data),
    ).then((data) => {
      if (data && data.length > 0) setBranches(data as Branch[]);
    });

    cachedQuery("site_settings_contact", () =>
      supabase
        .from("site_settings")
        .select("phone1, phone2")
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data),
    ).then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Name and phone are required");
      return;
    }
    if (!/^[0-9+\-\s()]{7,20}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid phone number");
      return;
    }
    setSubmitting(true);
    try {
      if (SUPABASE_CONFIGURED) {
        const { error } = await supabase.from("enquiries").insert({
          name: form.name.trim().slice(0, 100),
          phone: form.phone.trim().slice(0, 20),
          email: form.email.trim().slice(0, 255) || null,
          child_age: form.age || null,
          message: form.msg.trim().slice(0, 1000) || null,
        });
        if (error) throw new Error(error.message);
      }
      setSent(true);
      toast.success("Enquiry sent! We will contact you soon.");
      setForm({ name: "", phone: "", email: "", age: "", msg: "" });
      setTimeout(() => setSent(false), 4000);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  /* Use live branches from DB; fall back to defaults */
  const displayBranches =
    branches.length > 0
      ? branches.map((b, idx) => ({
        ...b,
        color: idx === 0 ? "var(--primary)" : "var(--teal)",
        mapLink: idx === 0 
          ? "https://maps.app.goo.gl/c6Uva2GCuDAPq4iK6" 
          : idx === 1 
            ? "https://maps.app.goo.gl/tseH83JuShbawQsSA"
            : (b.map_embed_url && !b.map_embed_url.includes("embed") ? b.map_embed_url : googleMapsLink(b.address)),
      }))
      : defaultBranches;

  return (
    <section
      id="reach-us"
      className="relative overflow-hidden py-24"
      style={{ background: "var(--card)" }}
    >
      <SectionDeco variant="festive" />
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="text-center">
          <div
            className="section-label"
            style={{
              background: "oklch(0.71 0.18 40 / .12)",
              color: "var(--primary)",
              border: "1.5px solid oklch(0.71 0.18 40 / .25)",
            }}
          >
            📍 Find Us
          </div>
          <h2 className="section-title">Reach Us</h2>
          <p className="section-sub">
            Visit us at either of our two branches — we'd love to meet you and your little one!
          </p>
        </div>

        {/* Quick Contact Block */}
        <div className="flex justify-center mb-10">
          <div
            className="bg-card px-8 py-5 rounded-3xl flex items-center justify-center gap-5 transition-transform hover:-translate-y-1"
            style={{
              border: "3px solid var(--border)",
              boxShadow: "var(--shadow-toy)",
              background: "linear-gradient(135deg, var(--background), oklch(0.95 0.04 230 / .3))"
            }}
          >
            <div className="text-[36px] animate-bounce-fun">📞</div>
            <div>
              <div style={{ fontFamily: "var(--font-play)", fontSize: 18, color: "var(--navy)", fontWeight: 700, marginBottom: 2 }}>
                Quick Contact
              </div>
              <div className="flex items-center gap-2" style={{ color: "var(--primary)", fontWeight: 700, fontSize: 20 }}>
                <a href={`tel:${settings?.phone1 || "9003845060"}`} className="hover:underline">{settings?.phone1 || "9003845060"}</a>
                {(settings ? settings.phone2 : "9003845060") && (
                  <>
                    <span style={{ color: "var(--muted-foreground)" }}>,</span>
                    <a href={`tel:${settings ? settings.phone2 : "9003845060"}`} className="hover:underline">{settings ? settings.phone2 : "9003845060"}</a>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Branch cards — tap address to open Google Maps */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          {displayBranches.map((b) => (
            <div key={b.id} className="toy-card flex flex-col" style={{ background: "var(--background)", padding: 20 }}>
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="shrink-0 flex items-center justify-center rounded-2xl text-[28px]"
                  style={{ width: 60, height: 60, background: b.color, color: "#fff" }}
                >
                  📍
                </div>
                <div className="flex-1">
                  <h3
                    style={{
                      fontFamily: "var(--font-play)",
                      fontSize: 18,
                      color: "var(--navy)",
                      marginBottom: 6,
                    }}
                  >
                    {b.branch_name}
                  </h3>
                  <a
                    href={b.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] leading-[1.6] transition-colors hover:underline"
                    style={{ color: "var(--muted-foreground)", display: "block" }}
                    title="Open in Google Maps"
                  >
                    📌 {b.address}
                  </a>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <a
                      href={b.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1.5 rounded-full transition-transform hover:-translate-y-0.5"
                      style={{
                        background: b.color,
                        color: "#fff",
                        fontFamily: "var(--font-play)",
                        boxShadow: `0 4px 10px oklch(0 0 0 / .15)`,
                      }}
                    >
                      🗺️ Open in Maps
                    </a>
                    <div
                      className="flex gap-1.5 text-[12px]"
                      style={{ color: "var(--muted-foreground)", alignItems: "center" }}
                    >
                      <span>🕘 Mon–Fri 9am–5pm</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-auto overflow-hidden rounded-xl" style={{ border: "2px solid var(--border)" }}>
                <iframe
                  width="100%"
                  height="200"
                  style={{ border: 0, display: "block" }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src={b.map_embed_url || `https://maps.google.com/maps?q=${encodeURIComponent(b.address)}&output=embed`}
                ></iframe>
              </div>
            </div>
          ))}
        </div>

        {/* Enquiry form */}
        <div
          className="max-w-3xl mx-auto rounded-3xl p-8 sm:p-10 relative overflow-hidden"
          style={{
            background: "var(--background)",
            border: "3px solid var(--border)",
            boxShadow: "var(--shadow-toy-lg)",
          }}
        >
          <div
            className="absolute top-0 left-0 right-0"
            style={{
              height: 6,
              background:
                "linear-gradient(90deg, var(--primary), var(--secondary), var(--accent), var(--teal))",
            }}
          />
          <h3
            className="text-center mb-6"
            style={{ fontFamily: "var(--font-play)", fontSize: 24, color: "var(--navy)" }}
          >
            ✉️ Send Us an Enquiry
          </h3>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ContactField
              label="Your Name *"
              value={form.name}
              onChange={(v) => setForm({ ...form, name: v })}
              placeholder="Enter your name"
            />
            <ContactField
              label="Phone Number *"
              type="tel"
              value={form.phone}
              onChange={(v) => setForm({ ...form, phone: v })}
              placeholder="Your phone number"
            />
            <ContactField
              label="Email Address"
              type="email"
              value={form.email}
              onChange={(v) => setForm({ ...form, email: v })}
              placeholder="Your email (optional)"
            />
            <div>
              <label
                className="block text-[13px] font-bold mb-1.5"
                style={{ color: "var(--navy)", fontFamily: "var(--font-play)" }}
              >
                Child's Age
              </label>
              <select
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-colors"
                style={{
                  background: "var(--card)",
                  border: "2px solid var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="">Select age</option>
                <option>Below 2 years</option>
                <option>Nursery</option>
                <option>Junior KG</option>
                <option>Senior KG</option>
                <option>5+ years</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                className="block text-[13px] font-bold mb-1.5"
                style={{ color: "var(--navy)", fontFamily: "var(--font-play)" }}
              >
                Message
              </label>
              <textarea
                value={form.msg}
                onChange={(e) => setForm({ ...form, msg: e.target.value })}
                rows={4}
                placeholder="Any questions or additional information..."
                className="w-full px-4 py-3 rounded-xl text-[14px] outline-none resize-y"
                style={{
                  background: "var(--card)",
                  border: "2px solid var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div className="sm:col-span-2 text-center">
              <button
                type="submit"
                disabled={submitting}
                className="btn-toy btn-toy-primary disabled:opacity-60"
              >
                {submitting ? "Sending…" : "✉️ Send Enquiry"}
              </button>
              {sent && (
                <div
                  className="mt-4 inline-block px-5 py-2.5 rounded-full text-[13px] font-bold"
                  style={{
                    background: "oklch(0.78 0.14 175 / .2)",
                    color: "var(--teal)",
                    fontFamily: "var(--font-play)",
                  }}
                >
                  🎉 Enquiry sent! We will contact you soon.
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function ContactField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label
        className="block text-[13px] font-bold mb-1.5"
        style={{ color: "var(--navy)", fontFamily: "var(--font-play)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-xl text-[14px] outline-none transition-colors"
        style={{
          background: "var(--card)",
          border: "2px solid var(--border)",
          color: "var(--foreground)",
        }}
      />
    </div>
  );
}

/* ============= FOOTER ============= */
export function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    cachedQuery("site_settings", () =>
      supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data as SiteSettings),
    ).then((data) => {
      if (data) setSettings(data);
    });
  }, []);

  const schoolName = settings?.school_name || "Payitragam";
  const tagline = settings?.tagline || "Nellaiappar Kanthimathi";
  const logoUrl = settings?.logo_url;
  const email = settings?.email || "payitragam@gmail.com";
  const fbUrl = settings?.fb_url;
  const igUrl = settings?.ig_url;
  const ytUrl = settings?.yt_url;
  const waNumber = settings?.wa_number || "9003845060";

  return (
    <footer
      className="relative overflow-hidden pt-16 pb-6"
      style={{ background: "var(--navy)", color: "#fff" }}
    >
      <div className="deco-layer deco-mobile-hide">
        <Star color="var(--secondary)" position={{ top: "10%", right: "8%" }} small />
        <Star color="var(--accent)" delay={0.5} position={{ bottom: "30%", left: "5%" }} />
        <Star color="var(--primary)" delay={1.1} position={{ top: "20%", left: "15%" }} small />
      </div>
      <div className="max-w-[1240px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              {logoUrl ? (
                <OptimizedImage
                  src={logoUrl}
                  alt={schoolName}
                  width={120}
                  imgClassName="rounded-full object-cover"
                  style={{ width: 52, height: 52, border: "2px solid var(--secondary)" }}
                />
              ) : (
                <div
                  className="flex items-center justify-center rounded-full font-bold"
                  style={{
                    width: 52,
                    height: 52,
                    background: "var(--secondary)",
                    color: "var(--navy)",
                    fontFamily: "var(--font-play)",
                    fontSize: 28,
                  }}
                >
                  {schoolName.charAt(0)}
                </div>
              )}
              <div style={{ fontFamily: "var(--font-play)" }}>
                <div className="text-[18px]">{schoolName}</div>
                <div
                  className="text-[11px]"
                  style={{ color: "oklch(1 0 0 / .65)", fontFamily: "var(--font-body)" }}
                >
                  {tagline}
                </div>
              </div>
            </div>
            <p className="text-[13.5px] leading-[1.7]" style={{ color: "oklch(1 0 0 / .7)" }}>
              E for Education, P for Payitragam — Tirunelveli's premier Multiple Intelligence
              Preschool since 2018.
            </p>
            <div className="flex gap-2.5 mt-4">
              {[
                { i: "📘", c: "oklch(0.45 0.18 250)", href: fbUrl },
                { i: "📷", c: "oklch(0.55 0.2 0)", href: igUrl },
                { i: "▶️", c: "oklch(0.55 0.22 27)", href: ytUrl },
                {
                  i: "💬",
                  c: "oklch(0.7 0.18 145)",
                  href: waNumber ? `https://wa.me/91${waNumber.replace(/\D/g, "")}` : "#",
                },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href || "#"}
                  target={s.href ? "_blank" : undefined}
                  rel="noopener"
                  className="flex items-center justify-center rounded-full transition-transform hover:-translate-y-0.5"
                  style={{ width: 38, height: 38, background: s.c, fontSize: 16 }}
                >
                  {s.i}
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Quick Links"
            links={[
              ["#home", "Home"],
              ["#about", "About Us"],
              ["#programs", "Programs"],
              ["#gallery", "Gallery"],
              ["#blogs", "Blogs"],
              ["#reach-us", "Contact Us"],
            ]}
          />
          <FooterCol
            title="Programs"
            links={[
              ["#playground", "Activity Zones"],
              ["#programs", "Nursery"],
              ["#programs", "Junior KG"],
              ["#programs", "Senior KG"],
              ["#reach-us", "Diploma Courses"],
            ]}
          />

          <div>
            <h4
              className="mb-4"
              style={{ fontFamily: "var(--font-play)", fontSize: 16, color: "var(--secondary)" }}
            >
              Contact
            </h4>
            <ContactRow
              icon="📍"
              text="122A, 6th Cross Street, South Balabakiya Nagar, Tirunelveli - 627001"
            />
            <ContactRow icon="✉️" text={email} />
            <ContactRow icon="🕘" text="Mon–Fri 9am–5pm | Sat 9am–1pm" />
          </div>
        </div>
        <div
          className="pt-5 text-center text-[13px] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5"
          style={{ borderTop: "1px solid oklch(1 0 0 / .12)", color: "oklch(1 0 0 / .6)" }}
        >
          <span>
            © 2025 <b style={{ color: "#fff" }}>Nellaiappar Kanthimathi Payitragam</b>. Made with ❤️
            in Tirunelveli.
          </span>
          <a
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold transition-transform hover:-translate-y-0.5"
            style={{
              background: "var(--secondary)",
              color: "var(--navy)",
              fontFamily: "var(--font-play)",
            }}
          >
            🔐 Admin Login
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4
        className="mb-4"
        style={{ fontFamily: "var(--font-play)", fontSize: 16, color: "var(--secondary)" }}
      >
        {title}
      </h4>
      <ul className="space-y-2 list-none">
        {links.map(([href, label]) => (
          <li key={label}>
            <a
              href={href}
              className="text-[13.5px] transition-colors hover:text-white"
              style={{ color: "oklch(1 0 0 / .7)" }}
            >
              → {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ContactRow({ icon, text }: { icon: string; text: string }) {
  return (
    <div
      className="flex items-start gap-2.5 mb-3 text-[13px]"
      style={{ color: "oklch(1 0 0 / .75)" }}
    >
      <span className="text-[15px] mt-0.5">{icon}</span>
      <span className="leading-[1.55]">{text}</span>
    </div>
  );
}

/* ============= FLOATING BUTTONS ============= */
export function FloatingButtons() {
  const [show, setShow] = useState(false);
  const [waNumber, setWaNumber] = useState("9003845060");

  useEffect(() => {
    cachedQuery("site_settings_wa", () =>
      supabase
        .from("site_settings")
        .select("wa_number")
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data),
    ).then((data) => {
      if (data?.wa_number) setWaNumber(data.wa_number);
    });
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-5 bottom-5 z-40 flex flex-col gap-3">
      {show && (
        <button
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center justify-center rounded-full text-white transition-transform hover:-translate-y-1"
          style={{
            width: 50,
            height: 50,
            fontSize: 22,
            background: "var(--primary)",
            boxShadow: "0 6px 0 oklch(0.5 0.16 36), 0 10px 20px oklch(0.71 0.18 40 / .3)",
          }}
        >
          ↑
        </button>
      )}
      <a
        href={`https://wa.me/91${waNumber.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener"
        aria-label="Chat on WhatsApp"
        className="flex items-center justify-center rounded-full text-white transition-transform hover:-translate-y-1 animate-pop"
        style={{
          width: 56,
          height: 56,
          fontSize: 26,
          background: "oklch(0.7 0.18 145)",
          boxShadow: "0 6px 0 oklch(0.5 0.16 145), 0 10px 20px oklch(0.7 0.18 145 / .35)",
        }}
      >
        💬
      </a>
    </div>
  );
}
