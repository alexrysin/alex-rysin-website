"use client";

import { m, useReducedMotion } from "framer-motion";

type Props = {
  className?: string;
};

export default function Section2Diagram({ className }: Props) {
  const reduce = useReducedMotion();
  const viewport = { once: true, amount: 0.35 };

  const tween = (delay: number, duration = 0.5) =>
    reduce ? { duration: 0 } : { duration, delay, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <m.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 600 780"
      className={className ?? "w-full h-auto max-w-md mx-auto"}
      role="img"
      aria-labelledby="s2-title s2-desc"
      preserveAspectRatio="xMidYMid meet"
    >
      <title id="s2-title">מהפיזור לתמונה אחת</title>
      <desc id="s2-desc">
        ארבע החלטות פיננסיות נפרדות שהופכות למערכת מחוברת אחת
      </desc>

      <defs>
        <style>{`.s2lbl { font-family: 'Heebo', 'Assistant', 'Rubik', sans-serif; }`}</style>
      </defs>

      {/* ============ TOP ZONE: BEFORE ============ */}
      <m.g
        initial={{ opacity: 0, y: -8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={tween(0, 0.5)}
      >
        <text
          x="300"
          y="42"
          textAnchor="middle"
          className="s2lbl"
          fontSize="14"
          fontWeight="700"
          fill="#6B7280"
          letterSpacing="1"
        >
          היום
        </text>
        <line x1="265" y1="56" x2="335" y2="56" stroke="#D1D5DB" strokeWidth="1" />
      </m.g>

      {/* Scattered icons + question marks, staggered in */}
      {[
        { type: "house", tx: 130, ty: 115, q: { x: 108, y: 108 } },
        { type: "chart", tx: 420, ty: 95, q: { x: 492, y: 88 } },
        { type: "coin", tx: 360, ty: 215, q: { x: 438, y: 208 } },
        { type: "bag", tx: 195, ty: 240, q: { x: 170, y: 232 } },
      ].map((it, i) => (
        <m.g
          key={`top-${it.type}`}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={tween(0.15 + i * 0.1, 0.45)}
        >
          <text
            x={it.q.x}
            y={it.q.y}
            fill="#D1D5DB"
            fontFamily="Heebo,sans-serif"
            fontSize="26"
            fontWeight="800"
          >
            ?
          </text>
          <g transform={`translate(${it.tx},${it.ty})`}>
            <circle cx="35" cy="35" r="34" fill="#F9FAFB" stroke="#D1D5DB" strokeWidth="1.5" />
            <IconPath type={it.type} color="#9CA3AF" />
          </g>
        </m.g>
      ))}

      {/* ============ DIVIDER ============ */}
      <m.line
        x1="80"
        y1="345"
        x2="520"
        y2="345"
        stroke="#E5E7EB"
        strokeWidth="1"
        strokeDasharray="3 6"
        initial={{ opacity: 0, pathLength: 0 }}
        whileInView={{ opacity: 1, pathLength: 1 }}
        viewport={viewport}
        transition={tween(0.7, 0.5)}
      />

      {/* ============ ARROW ============ */}
      <m.g
        initial={{ opacity: 0, y: -16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewport}
        transition={tween(0.95, 0.55)}
      >
        <line x1="300" y1="365" x2="300" y2="420" stroke="#4d6617" strokeWidth="3" strokeLinecap="round" />
        <path
          d="M284 407 L300 423 L316 407"
          fill="none"
          stroke="#4d6617"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </m.g>

      {/* ============ BOTTOM ZONE LABEL ============ */}
      <m.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={tween(1.3, 0.4)}
      >
        <text
          x="300"
          y="455"
          textAnchor="middle"
          className="s2lbl"
          fontSize="14"
          fontWeight="700"
          fill="#1C3879"
          letterSpacing="0.5"
        >
          אחרי התהליך
        </text>
        <line x1="230" y1="469" x2="370" y2="469" stroke="#1C3879" strokeWidth="1" opacity="0.35" />
      </m.g>

      {/* ============ CONNECTION LINES (draw out from hex) ============ */}
      {[
        { x1: 300, y1: 545, x2: 300, y2: 510 },
        { x1: 339, y1: 590, x2: 385, y2: 590 },
        { x1: 300, y1: 635, x2: 300, y2: 670 },
        { x1: 261, y1: 590, x2: 215, y2: 590 },
      ].map((ln, i) => (
        <m.line
          key={`ln-${i}`}
          x1={ln.x1}
          y1={ln.y1}
          x2={ln.x2}
          y2={ln.y2}
          stroke="#4d6617"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.55"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={viewport}
          transition={tween(1.7 + i * 0.08, 0.45)}
        />
      ))}

      {/* ============ HEXAGON (fade in) ============ */}
      <m.g
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={viewport}
        transition={tween(1.5, 0.55)}
      >
        <polygon points="300,545 339,567.5 339,612.5 300,635 261,612.5 261,567.5" fill="#1C3879" />
        <text
          x="300"
          y="587"
          textAnchor="middle"
          className="s2lbl"
          fontSize="13"
          fontWeight="700"
          fill="#FFFFFF"
        >
          האסטרטגיה
        </text>
        <text
          x="300"
          y="606"
          textAnchor="middle"
          className="s2lbl"
          fontSize="13"
          fontWeight="700"
          fill="#FFFFFF"
        >
          שלכם
        </text>
      </m.g>

      {/* ============ BOTTOM ICONS (fade in around hex) ============ */}
      {[
        { type: "house", tx: 270, ty: 480, pos: "top" },
        { type: "chart", tx: 385, ty: 560, pos: "right" },
        { type: "coin", tx: 270, ty: 670, pos: "bottom" },
        { type: "bag", tx: 155, ty: 560, pos: "left" },
      ].map((it, i) => (
        <m.g
          key={`bot-${it.type}`}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewport}
          transition={tween(2.05 + i * 0.12, 0.5)}
        >
          <g transform={`translate(${it.tx},${it.ty})`}>
            <circle cx="30" cy="30" r="30" fill="#FFFFFF" stroke="#1C3879" strokeWidth="1.6" />
            <IconPath type={it.type} color="#1C3879" small />
          </g>
        </m.g>
      ))}
    </m.svg>
  );
}

/* ────────── Icon path helper ────────── */
function IconPath({
  type,
  color,
  small = false,
}: {
  type: string;
  color: string;
  small?: boolean;
}) {
  const o = small ? -5 : 0;

  if (type === "house") {
    return (
      <>
        <path
          d={`M${20 + o} ${40 + o} L${35 + o} ${24 + o} L${50 + o} ${40 + o} L${50 + o} ${51 + o} L${20 + o} ${51 + o} Z`}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <rect
          x={31 + o}
          y={42 + o}
          width="8"
          height="9"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
        />
      </>
    );
  }
  if (type === "chart") {
    return (
      <>
        <path
          d={`M${18 + o} ${50 + o} L${28 + o} ${40 + o} L${36 + o} ${46 + o} L${52 + o} ${26 + o}`}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M${44 + o} ${26 + o} L${52 + o} ${26 + o} L${52 + o} ${34 + o}`}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    );
  }
  if (type === "coin") {
    return (
      <>
        <circle
          cx={35 + o}
          cy={35 + o}
          r={small ? 13 : 15}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
        />
        <text
          x={35 + o}
          y={(small ? 36 : 41) + o}
          textAnchor="middle"
          fontFamily="Heebo,sans-serif"
          fontSize={small ? "15" : "17"}
          fontWeight="700"
          fill={color}
        >
          ₪
        </text>
      </>
    );
  }
  if (type === "bag") {
    return (
      <>
        <rect
          x={20 + o}
          y={31 + o}
          width="30"
          height="20"
          rx="2"
          fill="none"
          stroke={color}
          strokeWidth="2.2"
        />
        <path
          d={`M${28 + o} ${31 + o} L${28 + o} ${26 + o} Q${28 + o} ${24 + o} ${30 + o} ${24 + o} L${40 + o} ${24 + o} Q${42 + o} ${24 + o} ${42 + o} ${26 + o} L${42 + o} ${31 + o}`}
          fill="none"
          stroke={color}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1={20 + o}
          y1={40 + o}
          x2={50 + o}
          y2={40 + o}
          stroke={color}
          strokeWidth="1.5"
        />
      </>
    );
  }
  return null;
}
