import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const defaultItems = [
  "🎉 Admissions Open 2025-26!",
  "👩‍🏫 Montessori Teacher Training — June Batch",
  "☀️ Summer Camp Registration Open",
  "👶 10:1 Child-Adult Ratio — Personalized Attention",
  "🎨 Multiple Intelligence Curriculum",
  "🌿 Reggio Emilia + Montessori + Play Way",
];

export function Ticker() {
  const [items, setItems] = useState<string[]>(defaultItems);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("title")
      .order("is_pinned", { ascending: false })
      .order("announcement_date", { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setItems(data.map((a: { title: string }) => a.title));
        }
      });
  }, []);

  const doubled = [...items, ...items];
  return (
    <div
      className="text-white py-2.5 overflow-hidden relative z-30 mt-[80px] lg:mt-[132px]"
      style={{ background: "var(--navy)" }}
    >
      <div className="max-w-[1240px] mx-auto px-6 flex items-center gap-0">
        <div
          className="text-xs font-bold whitespace-nowrap shrink-0"
          style={{
            background: "var(--primary)",
            color: "#fff",
            padding: "6px 22px 6px 24px",
            clipPath: "polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)",
            fontFamily: "var(--font-play)",
            letterSpacing: ".5px",
          }}
        >
          📢 LATEST
        </div>
        <div className="overflow-hidden flex-1 ml-3">
          <div className="flex gap-12 animate-ticker whitespace-nowrap">
            {doubled.map((it, i) => (
              <span key={i} className="text-[13px] font-medium shrink-0">
                <span style={{ color: "var(--secondary)" }}>⭐</span> {it}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
