"use client";

import { ScanStatusResponse } from "@/hooks/query-hooks/dpdp.query";

interface DpdpProgressProps {
  scanRecord: ScanStatusResponse;
}

export function DpdpProgress({ scanRecord }: DpdpProgressProps) {
  const stage = scanRecord.stage;

  const steps = [
    {
      id: "QUEUED",
      label: "Preparing Scan",
      desc: "Initializing crawlers and security modules.",
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      ),
    },
    {
      id: "PROCESSING",
      label: "Security Assessment",
      desc: "Analyzing cookies, headers, CSP, and privacy docs.",
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.175-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      id: "FINALIZING",
      label: "AI Report Generation",
      desc: "Compiling findings into a detailed audit report.",
      icon: (
        <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
        </svg>
      ),
    },
  ];

  const getStageIndex = (currentStage: string) => {
    switch (currentStage) {
      case "CONFIRMED":
        return 0;
      case "SCANNING":
      case "SCANNED":
        return 1;
      case "REPORTING":
        return 2;
      default:
        return 0;
    }
  };

  const activeIndex = getStageIndex(stage);
  const progressPercent = ((activeIndex + 0.5) / steps.length) * 100;

  return (
    <div className="mx-auto max-w-3xl">
      <style>{`
        @keyframes dp-orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes dp-orbit-rev { 0% { transform: rotate(360deg); } 100% { transform: rotate(0deg); } }
        @keyframes dp-core-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34,211,238,0.15), 0 0 40px rgba(34,211,238,0.05), inset 0 0 20px rgba(34,211,238,0.05); }
          50% { box-shadow: 0 0 30px rgba(34,211,238,0.25), 0 0 60px rgba(34,211,238,0.1), inset 0 0 30px rgba(34,211,238,0.1); }
        }
        @keyframes dp-shimmer { 0% { background-position: -200% center; } 100% { background-position: 200% center; } }
        @keyframes dp-scan-sweep { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes dp-bar-flow { 0% { background-position: 0% center; } 100% { background-position: 200% center; } }
        @keyframes dp-ring-expand {
          0% { transform: scale(0.8); opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        @keyframes dp-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes dp-card-enter {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes dp-line-grow {
          from { height: 0%; }
          to { height: 100%; }
        }
      `}</style>

      <div className="relative rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, #0c2236 0%, #081624 50%, #060f1a 100%)" }}>
        {/* Top accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent 5%, rgba(34,211,238,0.3) 30%, rgba(56,189,248,0.4) 50%, rgba(34,211,238,0.3) 70%, transparent 95%)" }} />

        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(rgba(34,211,238,0.03) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

        {/* Ambient glows */}
        <div className="absolute -top-20 left-1/4 w-60 h-40 bg-cyan-500/[0.04] rounded-full blur-[60px]" />
        <div className="absolute -bottom-16 right-1/4 w-48 h-32 bg-blue-600/[0.03] rounded-full blur-[50px]" />

        <div className="relative px-6 py-7 sm:px-8 sm:py-8">
          {/* Two-column layout: stacks on mobile, side-by-side on sm+ */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-8">

            {/* ─── LEFT: Scanner orb + info ─── */}
            <div className="flex-1 flex flex-col items-center text-center sm:items-center">
              {/* Animated scanner orb */}
              <div className="relative size-28 flex items-center justify-center mb-5" style={{ animation: "dp-float 4s ease-in-out infinite" }}>
                {/* Outer orbit ring with dot */}
                <div className="absolute inset-[-10px]" style={{ animation: "dp-orbit 6s linear infinite" }}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                  <div className="absolute inset-0 rounded-full border border-dashed border-cyan-400/10" />
                </div>
                {/* Middle orbit ring with dot */}
                <div className="absolute inset-[-3px]" style={{ animation: "dp-orbit-rev 8s linear infinite" }}>
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 size-1 rounded-full bg-sky-400/80 shadow-[0_0_4px_rgba(56,189,248,0.6)]" />
                  <div className="absolute inset-0 rounded-full border border-cyan-400/[0.06]" />
                </div>
                {/* Expanding ring pulse */}
                <div className="absolute inset-3 rounded-full border border-cyan-400/20" style={{ animation: "dp-ring-expand 3s ease-out infinite" }} />
                {/* Core orb */}
                <div
                  className="relative size-16 rounded-full flex items-center justify-center border border-cyan-400/20"
                  style={{
                    background: "radial-gradient(circle at 35% 35%, rgba(34,211,238,0.15) 0%, rgba(8,145,178,0.08) 50%, rgba(6,20,32,0.6) 100%)",
                    animation: "dp-core-glow 3s ease-in-out infinite",
                  }}
                >
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        background: "conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,0.12) 40deg, transparent 80deg)",
                        animation: "dp-scan-sweep 2s linear infinite",
                      }}
                    />
                  </div>
                  <svg className="size-6 text-cyan-400 relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-cyan-400/40 mb-1">DPDPA 2023 Compliance</p>
              <h2
                className="text-lg font-extrabold sm:text-xl tracking-tight mb-3"
                style={{
                  color: "transparent",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  backgroundImage: "linear-gradient(135deg, #f1f5f9 0%, #22d3ee 50%, #f1f5f9 100%)",
                  backgroundSize: "200% auto",
                  animation: "dp-shimmer 3s ease-in-out infinite",
                }}
              >
                Security Scan in Progress
              </h2>

              {/* Domain pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm mb-5">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Scanning <span className="text-white/90 font-semibold">{scanRecord.domain}</span>
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full max-w-[220px] mb-2">
                <div className="relative h-1 rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      background: "linear-gradient(90deg, #0891b2, #22d3ee, #67e8f9, #22d3ee)",
                      backgroundSize: "200% 100%",
                      animation: "dp-bar-flow 2s linear infinite",
                    }}
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 size-2.5 rounded-full bg-cyan-400/60 blur-sm transition-all duration-1000"
                    style={{ left: `calc(${progressPercent}% - 5px)` }}
                  />
                </div>
                <p className="text-center mt-1.5 text-[10px] font-mono text-slate-500/70 tabular-nums tracking-widest">
                  {Math.round(progressPercent)}% complete
                </p>
              </div>

              {/* Estimated time */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 mt-1 sm:mt-3">
                <svg className="size-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Estimated: <span className="text-slate-400/80 font-medium">15–30 sec</span></span>
              </div>
            </div>

            {/* ─── Vertical divider (sm+) ─── */}
            <div className="hidden sm:block w-[1px] self-stretch my-2" style={{ background: "linear-gradient(180deg, transparent, rgba(34,211,238,0.12) 30%, rgba(34,211,238,0.12) 70%, transparent)" }} />

            {/* ─── Horizontal divider (mobile) ─── */}
            <div className="sm:hidden h-[1px] my-6 mx-8" style={{ background: "linear-gradient(90deg, transparent, rgba(34,211,238,0.12) 30%, rgba(34,211,238,0.12) 70%, transparent)" }} />

            {/* ─── RIGHT: Step timeline ─── */}
            <div className="flex-1 sm:py-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-4 sm:mb-3">Scan Progress</p>
              <div className="relative space-y-3">
                {/* Vertical timeline line */}
                <div className="absolute left-[17px] top-[18px] bottom-[18px] w-[1px] bg-white/[0.04]">
                  <div
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400/40 to-cyan-400/10 transition-all duration-1000 ease-out"
                    style={{
                      height: `${activeIndex >= steps.length - 1 ? 100 : (activeIndex / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>

                {steps.map((step, idx) => {
                  const isDone = idx < activeIndex;
                  const isActive = idx === activeIndex;
                  const isPending = !isDone && !isActive;

                  return (
                    <div
                      key={step.id}
                      className="relative flex items-start gap-3"
                      style={{ animation: `dp-card-enter 0.4s ease-out ${idx * 0.12}s both` }}
                    >
                      {/* Timeline node */}
                      <div className="relative z-10 shrink-0">
                        <div
                          className={`size-[35px] rounded-full flex items-center justify-center transition-all duration-500 ${
                            isDone
                              ? "bg-emerald-500/15 border border-emerald-400/25 text-emerald-400"
                              : isActive
                              ? "bg-cyan-500/15 border border-cyan-400/30 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                              : "bg-[#0a1825] border border-white/[0.06] text-slate-600"
                          }`}
                        >
                          {isDone ? (
                            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          ) : (
                            step.icon
                          )}
                        </div>
                        {isActive && (
                          <div className="absolute inset-0 rounded-full border border-cyan-400/20" style={{ animation: "dp-ring-expand 2.5s ease-out infinite" }} />
                        )}
                      </div>

                      {/* Step content */}
                      <div className="pt-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3
                            className={`text-[13px] font-semibold tracking-tight transition-colors duration-500 ${
                              isDone ? "text-emerald-300/90" : isActive ? "text-white" : "text-slate-500"
                            }`}
                          >
                            {step.label}
                          </h3>
                          {isDone && (
                            <span className="text-[7px] font-bold uppercase tracking-wider text-emerald-400/60 px-1.5 py-0.5 rounded bg-emerald-400/[0.08]">
                              Done
                            </span>
                          )}
                          {isActive && (
                            <span className="inline-flex items-center gap-1 text-[7px] font-bold uppercase tracking-wider text-cyan-400/70 px-1.5 py-0.5 rounded bg-cyan-400/[0.08]">
                              <span className="relative flex size-1">
                                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                                <span className="relative inline-flex size-1 rounded-full bg-cyan-400" />
                              </span>
                              Running
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] leading-relaxed mt-0.5 transition-colors duration-500 ${isPending ? "text-slate-600" : "text-slate-400/80"}`}>
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: "linear-gradient(90deg, transparent 10%, rgba(34,211,238,0.08) 50%, transparent 90%)" }} />
      </div>
    </div>
  );
}
