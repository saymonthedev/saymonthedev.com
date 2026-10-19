import type { CSSProperties } from "react";
import { introDelay } from "@/lib/style";

/**
 * Trilhas que convergem para o cartão, como ligações de um circuito.
 * Ficam fora da coluna de texto e só aparecem a partir do desktop.
 */
const traces = [
  { d: "M960 0 V92 Q960 112 980 112 H1010 Q1030 112 1030 132 V220", dur: "6.5s", delay: "0.4s" },
  { d: "M1440 168 H1262 Q1242 168 1242 188 V220", dur: "5.5s", delay: "1.6s" },
  { d: "M1440 520 H1300", dur: "4.5s", delay: "2.8s" },
  { d: "M1120 900 V808 Q1120 788 1100 788 H1060 Q1040 788 1040 768 V700", dur: "6s", delay: "1s" },
  { d: "M0 128 H64 Q84 128 84 148 V300", dur: "7s", delay: "3.4s" },
];

const nodes = [
  [980, 112],
  [1262, 168],
  [1100, 788],
  [84, 300],
];

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="intro-fade absolute top-[-28rem] right-[-22rem] size-[64rem] rounded-full sm:right-[-14rem] lg:top-[-22rem] lg:right-[-8rem]"
        style={introDelay(200)}
      >
        <div className="hero-glow size-full rounded-full" />
      </div>
      <div className="absolute top-[40%] left-[-30rem] size-[52rem] rounded-full bg-[radial-gradient(closest-side,rgb(15_23_42/0.95),transparent)]" />

      <div className="intro-fade hero-grid absolute inset-0" style={introDelay(0)} />
      <div className="hero-grid-lit absolute inset-0 hidden md:block" />

      <svg
        className="intro-fade absolute inset-0 hidden size-full xl:block"
        style={introDelay(900)}
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
      >
        <g fill="none" stroke="rgb(148 163 184 / 0.13)" strokeWidth="1">
          {traces.map((trace) => (
            <path key={trace.d} d={trace.d} />
          ))}
        </g>
        <g style={{ filter: "drop-shadow(0 0 6px rgb(59 130 246 / 0.9))" }}>
          {traces.map((trace) => (
            <path
              key={trace.d}
              d={trace.d}
              pathLength={1000}
              className="trace-pulse"
              style={{ "--dur": trace.dur, "--delay": trace.delay } as CSSProperties}
            />
          ))}
        </g>
        {nodes.map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="5" fill="#05070B" stroke="rgb(148 163 184 / 0.25)" />
            <circle cx={cx} cy={cy} r="1.75" fill="rgb(147 197 253 / 0.8)" />
          </g>
        ))}
      </svg>

      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-950" />
    </div>
  );
}
