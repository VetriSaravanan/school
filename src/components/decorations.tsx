/**
 * Funky SVG decorations for a playful preschool site.
 * Each component is a self-contained SVG that you can absolutely position
 * inside a `.deco-layer` parent. All colors come from design tokens.
 */
import type { CSSProperties } from "react";

type DecoProps = { className?: string; style?: CSSProperties };

/* ---------- Bunting flag banner ---------- */
export function Bunting({ className = "", style }: DecoProps) {
  const colors = [
    "var(--primary)",
    "var(--secondary)",
    "var(--accent)",
    "var(--teal)",
    "var(--purple)",
    "var(--primary)",
    "var(--secondary)",
    "var(--accent)",
    "var(--teal)",
    "var(--pink)",
    "var(--primary)",
    "var(--secondary)",
    "var(--purple)",
    "var(--teal)",
    "var(--accent)",
    "var(--primary)",
    "var(--secondary)",
    "var(--accent)",
    "var(--teal)",
  ];
  return (
    <svg
      viewBox="0 0 1200 80"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 70, ...style }}
      aria-hidden
    >
      <defs>
        <filter id="bunting-shadow">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity=".15" />
        </filter>
      </defs>
      <g filter="url(#bunting-shadow)">
        <path
          d="M0,18 Q150,8 300,18 Q450,28 600,18 Q750,8 900,18 Q1050,28 1200,18"
          stroke="oklch(0.5 0.02 270)"
          strokeWidth="1.5"
          fill="none"
          opacity=".4"
        />
        {colors.map((c, i) => {
          const x = 50 + i * 60;
          const yTop = i % 2 === 0 ? 18 : 16;
          return (
            <polygon
              key={i}
              points={`${x},${yTop} ${x + 30},${yTop} ${x + 15},${yTop + 30}`}
              fill={c}
            />
          );
        })}
      </g>
    </svg>
  );
}

/* ---------- Rainbow ---------- */
export function Rainbow({ className = "", style }: DecoProps) {
  const arcs = [
    { color: "var(--accent)", offset: 0 },
    { color: "var(--primary)", offset: 12 },
    { color: "var(--secondary)", offset: 24 },
    { color: "var(--teal)", offset: 36 },
    { color: "oklch(0.7 0.13 240)", offset: 48 },
    { color: "var(--purple)", offset: 60 },
  ];
  return (
    <svg
      viewBox="0 0 220 120"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-float-r ${className}`}
      style={style}
      aria-hidden
    >
      {arcs.map((a, i) => (
        <path
          key={i}
          d={`M${10 + a.offset},115 Q110,${a.offset + 0} ${210 - a.offset},115`}
          stroke={a.color}
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/* ---------- Sun with face + spinning rays ---------- */
export function SunFace({ className = "", style }: DecoProps) {
  return (
    <div className={className} style={{ position: "absolute", ...style }} aria-hidden>
      <svg
        viewBox="0 0 90 90"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-spin-slow"
        style={{ width: "100%", height: "100%" }}
      >
        {/* rays */}
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = 45 + Math.cos(angle) * 30;
          const y1 = 45 + Math.sin(angle) * 30;
          const x2 = 45 + Math.cos(angle) * 40;
          const y2 = 45 + Math.sin(angle) * 40;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="var(--secondary)"
              strokeWidth="4"
              strokeLinecap="round"
            />
          );
        })}
      </svg>
      <svg
        viewBox="0 0 90 90"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      >
        <circle
          cx="45"
          cy="45"
          r="22"
          fill="var(--secondary)"
          stroke="oklch(0.7 0.14 80)"
          strokeWidth="2"
        />
        <circle cx="38" cy="42" r="2.5" fill="oklch(0.45 0.12 80)" />
        <circle cx="52" cy="42" r="2.5" fill="oklch(0.45 0.12 80)" />
        <path
          d="M38,52 Q45,58 52,52"
          stroke="oklch(0.45 0.12 80)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/* ---------- Cloud ---------- */
export function Cloud({ className = "", style, size = 130 }: DecoProps & { size?: number }) {
  const h = (size * 70) / 130;
  return (
    <svg
      viewBox="0 0 130 70"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-cloud ${className}`}
      style={{ width: size, height: h, ...style }}
      aria-hidden
    >
      <ellipse cx="65" cy="50" rx="55" ry="22" fill="#fff" />
      <circle cx="40" cy="40" r="22" fill="#fff" />
      <circle cx="70" cy="32" r="28" fill="#fff" />
      <circle cx="100" cy="42" r="18" fill="#fff" />
    </svg>
  );
}

/* ---------- Balloon ---------- */
export function Balloon({
  className = "",
  style,
  color = "var(--accent)",
}: DecoProps & { color?: string }) {
  return (
    <svg
      viewBox="0 0 48 80"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-balloon ${className}`}
      style={style}
      aria-hidden
    >
      <ellipse cx="24" cy="26" rx="20" ry="24" fill={color} />
      <ellipse cx="17" cy="16" rx="6" ry="4" fill="oklch(1 0 0 / .3)" />
      <path
        d="M24,50 Q22,60 24,70 Q22,75 24,80"
        stroke="oklch(0.5 0.02 270)"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="2,2"
      />
      <polygon points="20,50 28,50 24,58" fill={color} />
    </svg>
  );
}

/* ---------- Hot air balloon ---------- */
export function HotAirBalloon({ className = "", style }: DecoProps) {
  return (
    <svg
      viewBox="0 0 80 110"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-float-r ${className}`}
      style={style}
      aria-hidden
    >
      <ellipse cx="40" cy="42" rx="36" ry="40" fill="var(--primary)" />
      <path d="M10,25 Q40,0 70,25" stroke="var(--secondary)" strokeWidth="8" fill="none" />
      <path d="M6,38 Q40,12 74,38" stroke="var(--accent)" strokeWidth="6" fill="none" />
      <path d="M5,52 Q40,28 75,52" stroke="var(--teal)" strokeWidth="5" fill="none" />
      <path d="M7,65 Q40,44 73,65" stroke="var(--purple)" strokeWidth="5" fill="none" />
      <line x1="25" y1="82" x2="30" y2="98" stroke="oklch(0.4 0.05 60)" strokeWidth="1.5" />
      <line x1="55" y1="82" x2="50" y2="98" stroke="oklch(0.4 0.05 60)" strokeWidth="1.5" />
      <rect
        x="26"
        y="98"
        width="28"
        height="12"
        rx="3"
        fill="oklch(0.7 0.07 70)"
        stroke="oklch(0.4 0.05 60)"
        strokeWidth="1.5"
      />
      <ellipse cx="26" cy="30" rx="9" ry="6" fill="oklch(1 0 0 / .25)" />
    </svg>
  );
}

/* ---------- ABC Block ---------- */
export function AbcBlock({
  letter = "A",
  color = "var(--teal)",
  border = "oklch(0.62 0.13 175)",
  className = "",
  style,
}: DecoProps & { letter?: string; color?: string; border?: string }) {
  return (
    <svg
      viewBox="0 0 58 58"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-bounce-fun ${className}`}
      style={style}
      aria-hidden
    >
      <rect
        x="2"
        y="2"
        width="54"
        height="54"
        rx="10"
        fill={color}
        stroke={border}
        strokeWidth="2"
      />
      <rect
        x="6"
        y="6"
        width="46"
        height="46"
        rx="8"
        fill="none"
        stroke="oklch(1 0 0 / .4)"
        strokeWidth="1.5"
      />
      <text
        x="50%"
        y="62%"
        textAnchor="middle"
        fontSize="26"
        fontWeight="bold"
        fontFamily="Fredoka,cursive"
        fill="#fff"
      >
        {letter}
      </text>
    </svg>
  );
}

/* ---------- Number Ball ---------- */
export function NumberBall({
  number = "3",
  className = "",
  style,
}: DecoProps & { number?: string }) {
  return (
    <svg
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-float ${className}`}
      style={style}
      aria-hidden
    >
      <circle
        cx="25"
        cy="25"
        r="23"
        fill="var(--secondary)"
        stroke="oklch(0.7 0.14 80)"
        strokeWidth="2"
      />
      <circle cx="17" cy="17" r="6" fill="oklch(1 0 0 / .4)" />
      <text
        x="50%"
        y="64%"
        textAnchor="middle"
        fontSize="20"
        fontWeight="bold"
        fontFamily="Fredoka,cursive"
        fill="var(--navy)"
      >
        {number}
      </text>
    </svg>
  );
}

/* ---------- Pencil ---------- */
export function Pencil({ className = "", style }: DecoProps) {
  return (
    <svg
      viewBox="0 0 30 80"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-pencil ${className}`}
      style={style}
      aria-hidden
    >
      <rect
        x="6"
        y="8"
        width="18"
        height="55"
        rx="3"
        fill="var(--secondary)"
        stroke="oklch(0.65 0.13 88)"
        strokeWidth="1.5"
      />
      <rect x="6" y="8" width="18" height="10" rx="3" fill="oklch(0.85 0.07 30)" />
      <polygon points="6,63 15,78 24,63" fill="oklch(0.88 0.07 80)" />
      <line x1="14" y1="63" x2="14" y2="78" stroke="oklch(0.4 0.02 270)" strokeWidth="1" />
      <circle cx="15" cy="70" r="2.5" fill="oklch(0.3 0.02 270)" />
      <rect x="7" y="9" width="5" height="53" rx="2" fill="oklch(1 0 0 / .25)" />
    </svg>
  );
}

/* ---------- Crayon ---------- */
export function Crayon({ className = "", style }: DecoProps) {
  return (
    <svg
      viewBox="0 0 24 70"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-crayon ${className}`}
      style={style}
      aria-hidden
    >
      <rect x="4" y="4" width="16" height="50" rx="4" fill="var(--accent)" />
      <rect x="4" y="4" width="16" height="14" rx="4" fill="oklch(0.5 0.18 25)" />
      <polygon points="4,54 12,68 20,54" fill="oklch(0.88 0.07 80)" />
      <rect x="5" y="5" width="5" height="48" rx="2" fill="oklch(1 0 0 / .25)" />
      <text
        x="50%"
        y="44%"
        textAnchor="middle"
        fontSize="6"
        fill="#fff"
        fontFamily="Fredoka,cursive"
      >
        ABC
      </text>
    </svg>
  );
}

/* ---------- Butterfly ---------- */
export function Butterfly({ className = "", style }: DecoProps) {
  return (
    <svg
      viewBox="0 0 60 44"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-butterfly ${className}`}
      style={style}
      aria-hidden
    >
      <ellipse
        cx="15"
        cy="20"
        rx="14"
        ry="10"
        fill="var(--purple)"
        opacity=".9"
        transform="rotate(-20 15 20)"
      />
      <ellipse
        cx="45"
        cy="20"
        rx="14"
        ry="10"
        fill="var(--purple)"
        opacity=".9"
        transform="rotate(20 45 20)"
      />
      <ellipse
        cx="15"
        cy="30"
        rx="10"
        ry="8"
        fill="var(--lavender)"
        opacity=".9"
        transform="rotate(20 15 30)"
      />
      <ellipse
        cx="45"
        cy="30"
        rx="10"
        ry="8"
        fill="var(--lavender)"
        opacity=".9"
        transform="rotate(-20 45 30)"
      />
      <line
        x1="30"
        y1="8"
        x2="24"
        y2="2"
        stroke="oklch(0.3 0.02 270)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="8"
        x2="36"
        y2="2"
        stroke="oklch(0.3 0.02 270)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="30"
        y1="8"
        x2="30"
        y2="38"
        stroke="oklch(0.3 0.02 270)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="2" r="2" fill="var(--primary)" />
      <circle cx="36" cy="2" r="2" fill="var(--primary)" />
    </svg>
  );
}

/* ---------- Twinkling Star ---------- */
export function Star({
  className = "",
  style,
  color = "var(--secondary)",
  delay = 0,
}: DecoProps & { color?: string; delay?: number }) {
  return (
    <svg
      viewBox="0 0 26 26"
      xmlns="http://www.w3.org/2000/svg"
      className={`animate-twinkle ${className}`}
      style={{ animationDelay: `${delay}s`, ...style }}
      aria-hidden
    >
      <polygon
        points="13,2 15.5,9.5 23,9.5 17,14.5 19.5,22 13,17.5 6.5,22 9,14.5 3,9.5 10.5,9.5"
        fill={color}
        stroke="oklch(0.7 0.14 80)"
        strokeWidth="1"
      />
      <polygon
        points="13,5 14.5,10 19,10 15.5,13 17,18 13,15 9,18 10.5,13 7,10 11.5,10"
        fill="oklch(1 0 0 / .4)"
      />
    </svg>
  );
}

/* =============================================================
 * SectionDeco — a curated funky decoration cluster used across
 * sections. Variants give a different vibe per section so the
 * page never feels repetitive.
 * ============================================================= */
type Variant =
  | "hero"
  | "rainbow"
  | "stars"
  | "school"
  | "playful"
  | "balloons"
  | "garden"
  | "sunny"
  | "festive";

export function SectionDeco({ variant = "playful" }: { variant?: Variant }) {
  return (
    <div className="deco-layer deco-mobile-hide" aria-hidden>
      {variant === "hero" && (
        <>
          <Bunting />
          <Rainbow
            style={{
              position: "absolute",
              top: 60,
              right: "5%",
              width: 220,
              height: 120,
              opacity: 0.55,
            }}
          />
          <SunFace style={{ top: 80, left: "6%", width: 90, height: 90, opacity: 0.7 }} />
          <Cloud style={{ position: "absolute", top: 130, left: "20%", opacity: 0.7 }} />
          <Cloud
            size={110}
            style={{
              position: "absolute",
              top: 170,
              right: "28%",
              opacity: 0.6,
              animationDelay: "2s",
            }}
          />
          <Balloon
            color="var(--accent)"
            style={{
              position: "absolute",
              top: 90,
              right: "22%",
              width: 48,
              height: 80,
              opacity: 0.9,
            }}
          />
          <Balloon
            color="var(--secondary)"
            style={{
              position: "absolute",
              top: 70,
              left: "32%",
              width: 44,
              height: 76,
              opacity: 0.85,
              animationDelay: "1s",
            }}
          />
          <Balloon
            color="var(--teal)"
            style={{
              position: "absolute",
              top: 110,
              left: "44%",
              width: 42,
              height: 72,
              opacity: 0.8,
              animationDelay: ".7s",
            }}
          />
          <HotAirBalloon
            style={{
              position: "absolute",
              top: 60,
              left: "56%",
              width: 80,
              height: 110,
              opacity: 0.75,
            }}
          />
          <AbcBlock
            letter="A"
            style={{
              position: "absolute",
              bottom: "22%",
              left: "4%",
              width: 58,
              height: 58,
              opacity: 0.85,
            }}
          />
          <AbcBlock
            letter="B"
            color="var(--purple)"
            border="oklch(0.42 0.14 305)"
            style={{
              position: "absolute",
              bottom: "18%",
              right: "5%",
              width: 52,
              height: 52,
              opacity: 0.8,
              animationDelay: ".8s",
            }}
          />
          <NumberBall
            style={{
              position: "absolute",
              bottom: "30%",
              right: "10%",
              width: 50,
              height: 50,
              opacity: 0.8,
            }}
          />
          <Pencil
            style={{
              position: "absolute",
              bottom: "35%",
              left: "8%",
              width: 30,
              height: 80,
              opacity: 0.7,
            }}
          />
          <Crayon
            style={{
              position: "absolute",
              top: "42%",
              right: "3%",
              width: 24,
              height: 70,
              opacity: 0.65,
            }}
          />
          <Butterfly
            style={{
              position: "absolute",
              top: "36%",
              left: "22%",
              width: 60,
              height: 44,
              opacity: 0.8,
            }}
          />
          <Star
            style={{
              position: "absolute",
              top: "22%",
              left: "47%",
              width: 26,
              height: 26,
              opacity: 0.85,
            }}
          />
          <Star
            color="var(--accent)"
            delay={1.2}
            style={{
              position: "absolute",
              top: "15%",
              left: "62%",
              width: 18,
              height: 18,
              opacity: 0.8,
            }}
          />
          <Star
            color="var(--primary)"
            delay={0.6}
            style={{
              position: "absolute",
              bottom: "28%",
              left: "32%",
              width: 20,
              height: 20,
              opacity: 0.75,
            }}
          />
        </>
      )}

      {variant === "rainbow" && (
        <>
          <Rainbow
            style={{
              position: "absolute",
              top: 20,
              right: -30,
              width: 220,
              height: 120,
              opacity: 0.35,
            }}
          />
          <Cloud style={{ position: "absolute", top: 40, left: "5%", opacity: 0.55 }} />
          <Star
            color="var(--accent)"
            style={{
              position: "absolute",
              top: "18%",
              left: "40%",
              width: 22,
              height: 22,
              opacity: 0.7,
            }}
          />
          <Star
            color="var(--secondary)"
            delay={0.8}
            style={{
              position: "absolute",
              bottom: "20%",
              right: "8%",
              width: 20,
              height: 20,
              opacity: 0.7,
            }}
          />
          <Balloon
            color="var(--primary)"
            style={{
              position: "absolute",
              bottom: 40,
              left: "8%",
              width: 40,
              height: 70,
              opacity: 0.8,
            }}
          />
          <NumberBall
            number="7"
            style={{
              position: "absolute",
              top: "30%",
              right: "6%",
              width: 44,
              height: 44,
              opacity: 0.7,
            }}
          />
        </>
      )}

      {variant === "stars" && (
        <>
          <Star
            color="var(--secondary)"
            style={{
              position: "absolute",
              top: "10%",
              left: "8%",
              width: 24,
              height: 24,
              opacity: 0.8,
            }}
          />
          <Star
            color="var(--accent)"
            delay={0.5}
            style={{
              position: "absolute",
              top: "20%",
              right: "12%",
              width: 20,
              height: 20,
              opacity: 0.8,
            }}
          />
          <Star
            color="var(--primary)"
            delay={1.2}
            style={{
              position: "absolute",
              bottom: "15%",
              left: "20%",
              width: 18,
              height: 18,
              opacity: 0.7,
            }}
          />
          <Star
            color="var(--teal)"
            delay={0.8}
            style={{
              position: "absolute",
              bottom: "30%",
              right: "20%",
              width: 22,
              height: 22,
              opacity: 0.75,
            }}
          />
          <Star
            color="var(--purple)"
            delay={1.5}
            style={{
              position: "absolute",
              top: "50%",
              left: "5%",
              width: 16,
              height: 16,
              opacity: 0.7,
            }}
          />
          <Crayon
            style={{
              position: "absolute",
              top: "8%",
              right: "5%",
              width: 22,
              height: 64,
              opacity: 0.6,
            }}
          />
          <Pencil
            style={{
              position: "absolute",
              bottom: "10%",
              right: "4%",
              width: 28,
              height: 76,
              opacity: 0.65,
            }}
          />
        </>
      )}

      {variant === "school" && (
        <>
          <AbcBlock
            letter="A"
            style={{
              position: "absolute",
              top: "12%",
              left: "4%",
              width: 52,
              height: 52,
              opacity: 0.8,
            }}
          />
          <AbcBlock
            letter="C"
            color="var(--accent)"
            border="oklch(0.45 0.18 17)"
            style={{
              position: "absolute",
              top: "20%",
              right: "6%",
              width: 48,
              height: 48,
              opacity: 0.8,
              animationDelay: ".5s",
            }}
          />
          <NumberBall
            number="1"
            style={{
              position: "absolute",
              bottom: "20%",
              left: "8%",
              width: 46,
              height: 46,
              opacity: 0.75,
            }}
          />
          <NumberBall
            number="2"
            style={{
              position: "absolute",
              bottom: "15%",
              right: "10%",
              width: 42,
              height: 42,
              opacity: 0.75,
            }}
          />
          <Pencil
            style={{
              position: "absolute",
              top: "40%",
              right: "3%",
              width: 26,
              height: 70,
              opacity: 0.6,
            }}
          />
          <Star
            color="var(--secondary)"
            style={{
              position: "absolute",
              top: "8%",
              left: "45%",
              width: 18,
              height: 18,
              opacity: 0.75,
            }}
          />
        </>
      )}

      {variant === "playful" && (
        <>
          <Butterfly
            style={{
              position: "absolute",
              top: "12%",
              left: "6%",
              width: 56,
              height: 40,
              opacity: 0.7,
            }}
          />
          <Star
            color="var(--accent)"
            style={{
              position: "absolute",
              top: "10%",
              right: "8%",
              width: 20,
              height: 20,
              opacity: 0.8,
            }}
          />
          <Crayon
            style={{
              position: "absolute",
              bottom: "15%",
              left: "4%",
              width: 22,
              height: 64,
              opacity: 0.65,
            }}
          />
          <Balloon
            color="var(--teal)"
            style={{
              position: "absolute",
              bottom: "18%",
              right: "5%",
              width: 40,
              height: 70,
              opacity: 0.75,
            }}
          />
          <Star
            color="var(--secondary)"
            delay={1}
            style={{
              position: "absolute",
              top: "55%",
              left: "48%",
              width: 16,
              height: 16,
              opacity: 0.65,
            }}
          />
        </>
      )}

      {variant === "balloons" && (
        <>
          <Balloon
            color="var(--accent)"
            style={{
              position: "absolute",
              top: 30,
              left: "5%",
              width: 44,
              height: 76,
              opacity: 0.8,
            }}
          />
          <Balloon
            color="var(--secondary)"
            style={{
              position: "absolute",
              top: 20,
              right: "10%",
              width: 40,
              height: 70,
              opacity: 0.8,
              animationDelay: ".7s",
            }}
          />
          <Balloon
            color="var(--teal)"
            style={{
              position: "absolute",
              bottom: 30,
              left: "25%",
              width: 42,
              height: 72,
              opacity: 0.75,
              animationDelay: "1.2s",
            }}
          />
          <Star
            color="var(--primary)"
            style={{
              position: "absolute",
              top: "40%",
              right: "5%",
              width: 18,
              height: 18,
              opacity: 0.7,
            }}
          />
          <Cloud size={100} style={{ position: "absolute", top: 60, left: "48%", opacity: 0.55 }} />
        </>
      )}

      {variant === "garden" && (
        <>
          <Butterfly
            style={{
              position: "absolute",
              top: "18%",
              left: "12%",
              width: 56,
              height: 40,
              opacity: 0.8,
            }}
          />
          <Butterfly
            style={{
              position: "absolute",
              top: "55%",
              right: "10%",
              width: 50,
              height: 36,
              opacity: 0.7,
              animationDelay: "2s",
            }}
          />
          <SunFace style={{ top: 30, right: "5%", width: 70, height: 70, opacity: 0.65 }} />
          <Cloud style={{ position: "absolute", top: 80, left: "8%", opacity: 0.55 }} />
          <Star
            color="var(--lime)"
            style={{
              position: "absolute",
              bottom: "20%",
              left: "25%",
              width: 18,
              height: 18,
              opacity: 0.7,
            }}
          />
        </>
      )}

      {variant === "sunny" && (
        <>
          <SunFace style={{ top: 30, left: "5%", width: 80, height: 80, opacity: 0.75 }} />
          <Cloud style={{ position: "absolute", top: 60, right: "8%", opacity: 0.65 }} />
          <Cloud
            size={90}
            style={{
              position: "absolute",
              top: 140,
              left: "30%",
              opacity: 0.55,
              animationDelay: "1.5s",
            }}
          />
          <HotAirBalloon
            style={{
              position: "absolute",
              bottom: 20,
              right: "8%",
              width: 64,
              height: 90,
              opacity: 0.7,
            }}
          />
          <Star
            color="var(--secondary)"
            style={{
              position: "absolute",
              top: "20%",
              right: "30%",
              width: 20,
              height: 20,
              opacity: 0.8,
            }}
          />
        </>
      )}

      {variant === "festive" && (
        <>
          <Bunting />
          <Star
            color="var(--secondary)"
            style={{
              position: "absolute",
              top: "25%",
              left: "8%",
              width: 22,
              height: 22,
              opacity: 0.8,
            }}
          />
          <Star
            color="var(--accent)"
            delay={0.7}
            style={{
              position: "absolute",
              top: "30%",
              right: "10%",
              width: 24,
              height: 24,
              opacity: 0.85,
            }}
          />
          <Star
            color="var(--primary)"
            delay={1.3}
            style={{
              position: "absolute",
              bottom: "25%",
              left: "20%",
              width: 18,
              height: 18,
              opacity: 0.75,
            }}
          />
          <Balloon
            color="var(--accent)"
            style={{
              position: "absolute",
              bottom: 20,
              right: "8%",
              width: 38,
              height: 66,
              opacity: 0.8,
            }}
          />
          <NumberBall
            number="9"
            style={{
              position: "absolute",
              bottom: "35%",
              left: "5%",
              width: 42,
              height: 42,
              opacity: 0.75,
            }}
          />
        </>
      )}
    </div>
  );
}
