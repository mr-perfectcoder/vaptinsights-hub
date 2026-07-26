"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useDPDPDiscover } from "@/hooks/query-hooks/dpdp.query";
import { homepageScanSchema, normalizeScanUrl } from "@/lib/validation/dpdp-scan.schema";
import { dpdpCopy, dpdpFooterLinks } from "../../constants/dpdp-homepage";
import { DpdpHeader } from "../common/dpdp-header";
import { DpdpIcon } from "../common/dpdp-icon";
import Turnstile from "@/components/common/Turnstile";

/* ── Animated grid background ─────────────────────────────────── */
function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* Grid pattern */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
      {/* Radial glows */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(6,182,212,0.08)_0%,transparent_70%)]" />
      <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(99,102,241,0.06)_0%,transparent_70%)]" />
    </div>
  );
}

/* ── Floating orb decorations ─────────────────────────────────── */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute top-[15%] left-[8%] w-2 h-2 rounded-full bg-cyan-400/40 animate-[pulse_3s_ease-in-out_infinite]" />
      <div className="absolute top-[25%] right-[12%] w-1.5 h-1.5 rounded-full bg-indigo-400/30 animate-[pulse_4s_ease-in-out_infinite_0.5s]" />
      <div className="absolute top-[60%] left-[15%] w-1 h-1 rounded-full bg-teal-400/25 animate-[pulse_5s_ease-in-out_infinite_1s]" />
      <div className="absolute top-[45%] right-[20%] w-2.5 h-2.5 rounded-full bg-cyan-300/15 animate-[pulse_3.5s_ease-in-out_infinite_0.7s]" />
    </div>
  );
}

/* ── Stat counter ─────────────────────────────────────────────── */
function StatNumber({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 1800;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [end]);
  return <>{count.toLocaleString()}{suffix}</>;
}

export function DpdpHomepage() {
  const router = useRouter();
  const [apiErrorMsg, setApiErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const discoverMutation = useDPDPDiscover();

  const formik = useFormik({
    initialValues: { url: "" },
    validationSchema: homepageScanSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values, { setSubmitting }) => {
      setApiErrorMsg("");
      const normalizedUrl = normalizeScanUrl(values.url, "origin");
      discoverMutation.mutate(normalizedUrl, {
        onSuccess: (data) => router.push(`/compliance/dpdp/${data.scan_id}`),
        onError: (err) => {
          setSubmitting(false);
          setApiErrorMsg(err.message || "Failed to analyze URL. Please check if the host resolves.");
        },
      });
    },
  });

  const isProcessing = formik.isSubmitting || discoverMutation.isPending;
  const displayError = (formik.submitCount > 0 && formik.errors.url) || apiErrorMsg;

  return (
    <main className="min-h-screen flex flex-col bg-[#050e18] text-slate-100 selection:bg-cyan-400/20 selection:text-white">
      <DpdpHeader minimal />

      {/* ━━━ HERO ━━━ */}
      <section className="relative isolate flex-1 flex items-center justify-center py-20 sm:py-28 lg:py-36">
        <GridBackground />
        <FloatingOrbs />

        {/* Top decorative line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />

        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className="grid lg:grid-cols-[1fr_auto] gap-16 lg:gap-20 items-center">

            {/* ── Left column: Copy ── */}
            <div className="max-w-xl space-y-7">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-500/25 bg-cyan-500/8 px-3.5 py-1 text-xs font-semibold tracking-[0.08em] text-cyan-300 uppercase">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex size-2 rounded-full bg-cyan-400" />
                </span>
                {dpdpCopy.hero.eyebrow}
              </div>

              <h1 className="text-[2.5rem] sm:text-5xl lg:text-[3.4rem] font-extrabold tracking-[-0.025em] leading-[1.1] text-white">
                India's DPDP{" "}
                <br className="hidden sm:block" />
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-300 to-cyan-400">
                    Technical Readiness
                  </span>
                </span>
                {" "}Scanner
              </h1>

              <p className="text-base sm:text-lg leading-relaxed text-slate-400 max-w-md">
                {dpdpCopy.hero.description}
              </p>

              {/* Social proof stats */}
              <div className="flex items-center gap-8 pt-2">
                <div>
                  <div className="text-2xl font-black text-white tabular-nums">
                    <StatNumber end={2400} suffix="+" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Scans Completed</div>
                </div>
                <div className="w-px h-10 bg-white/8" />
                <div>
                  <div className="text-2xl font-black text-white tabular-nums">
                    <StatNumber end={180} suffix="+" />
                  </div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Domains Assessed</div>
                </div>
                <div className="w-px h-10 bg-white/8" />
                <div>
                  <div className="text-2xl font-black text-emerald-400 tabular-nums">Free</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Forever</div>
                </div>
              </div>
            </div>

            {/* ── Right column: Scanner card ── */}
            <div className="w-full max-w-[480px] lg:max-w-[480px] mx-auto lg:mx-0">
              <div className={`relative rounded-2xl transition-all duration-500 ${
                inputFocused
                  ? "shadow-[0_0_60px_-12px_rgba(6,182,212,0.25)]"
                  : "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]"
              }`}>
                {/* Card glow border */}
                <div className={`absolute -inset-px rounded-2xl transition-opacity duration-500 bg-gradient-to-b from-cyan-500/30 via-cyan-500/5 to-transparent ${
                  inputFocused ? "opacity-100" : "opacity-50"
                }`} />

                <form
                  onSubmit={formik.handleSubmit}
                  className="relative rounded-2xl bg-[#0a1a2a] border border-white/[0.06] p-7 sm:p-8 space-y-5"
                >
                  {/* Card header */}
                  <div className="flex items-center justify-between">
                    <label htmlFor="website-url" className="text-[13px] font-bold uppercase tracking-widest text-slate-400">
                      {dpdpCopy.hero.fieldLabel}
                    </label>
                    <span className="flex items-center gap-1.5 text-[13px] text-emerald-400/80 font-medium">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      Secure
                    </span>
                  </div>

                  {/* URL Input */}
                  <div className={`flex items-center gap-3 rounded-xl border px-4 py-1 transition-all duration-300 ${
                    displayError
                      ? "border-rose-500/50 bg-rose-950/10"
                      : inputFocused
                      ? "border-cyan-500/50 bg-cyan-950/10"
                      : "border-white/8 bg-white/[0.02]"
                  }`}>
                    <DpdpIcon name="search" className={`size-5 shrink-0 transition-colors duration-300 ${
                      inputFocused ? "text-cyan-400" : "text-slate-500"
                    }`} />
                    <input
                      id="website-url"
                      name="url"
                      type="text"
                      value={formik.values.url}
                      onChange={(e) => {
                        setApiErrorMsg("");
                        formik.handleChange(e);
                      }}
                      onFocus={() => setInputFocused(true)}
                      onBlur={(e) => {
                        setInputFocused(false);
                        formik.handleBlur(e);
                      }}
                      placeholder={dpdpCopy.hero.fieldPlaceholder}
                      className="h-14 w-full bg-transparent text-base text-white outline-none placeholder:text-slate-600 font-medium"
                      aria-invalid={Boolean(displayError)}
                      aria-describedby={displayError ? "url-error" : undefined}
                    />
                  </div>

                  {displayError && (
                    <p id="url-error" role="alert" className="text-[13px] font-medium text-rose-400 flex items-center gap-2 animate-fadeIn">
                      <span className="size-1.5 rounded-full bg-rose-400 animate-pulse shrink-0" />
                      {displayError}
                    </p>
                  )}

                  {/* Turnstile widget */}
                  <div className="flex justify-center scale-[0.92] origin-center">
                    <Turnstile onVerify={(token) => setTurnstileToken(token)} />
                  </div>

                  {/* Submit button */}
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="group relative w-full h-14 rounded-xl text-base font-bold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer overflow-hidden"
                  >
                    {/* Gradient background with shimmer */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400 bg-[length:200%_100%] group-hover:animate-[shimmer_2s_ease-in-out_infinite]" />
                    <span className="relative flex items-center justify-center gap-2.5 text-[#050e18]">
                      {isProcessing ? (
                        <>
                          <div className="size-5 rounded-full border-2 border-[#050e18]/30 border-t-[#050e18] animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <DpdpIcon name="scan" className="size-5" />
                          {dpdpCopy.hero.scanAction}
                        </>
                      )}
                    </span>
                  </button>

                  {/* Trust badges */}
                  <div className="flex items-center justify-center gap-6 pt-1 text-[13px] text-slate-500">
                    {dpdpCopy.hero.proofPoints.map((item) => (
                      <span key={item} className="inline-flex items-center gap-1.5">
                        <svg className="size-4 text-emerald-400/70" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        {item}
                      </span>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ━━━ PROBLEMS SOLVED ━━━ */}
      <section className="relative border-t border-white/[0.04] bg-[#040c15] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-xl mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-500/60">What Problem It Solves</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Bridge the Gap Between Regulation & Technical Code
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              The DPDPA 2023 mandates strict technical safeguards for data fiduciaries. We automate the technical verification so engineering teams can remediate risks fast.
            </p>
          </div>

          <div className="grid gap-px md:grid-cols-3 rounded-2xl overflow-hidden border border-white/[0.04] bg-white/[0.02]">
            {[
              {
                title: "Technical Safeguards",
                sub: "Section 8(5)",
                desc: "Identify missing security headers, absent CSP policies, and exposed tracking scripts that increase data breach exposure and regulatory risk.",
                accent: "from-cyan-400 to-blue-500",
              },
              {
                title: "Notice & Consent",
                sub: "Section 5",
                desc: "Detect un-consented third-party trackers, missing cookie controls, and inaccessible privacy policies before auditors do.",
                accent: "from-violet-400 to-indigo-500",
              },
              {
                title: "Developer-First Remediation",
                sub: "Actionable",
                desc: "Skip vague legal advice. Get precise code snippets, header configurations, and incident playbooks your team can deploy today.",
                accent: "from-emerald-400 to-teal-500",
              },
            ].map((card) => (
              <div key={card.title} className="group relative bg-[#050e18] p-7 sm:p-8 transition-colors hover:bg-[#071320]">
                {/* Top accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <span className="inline-block text-xs font-mono font-semibold text-slate-500 mb-3 tracking-wide">{card.sub}</span>
                <h3 className="text-base font-bold text-white mb-3">{card.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ━━━ HOW IT WORKS ━━━ */}
      <section className="relative border-t border-white/[0.04] bg-[#050e18] py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-10">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-500/60">Assessment Pipeline</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              How the DPDPA Technical Scan Works
            </h2>
            <p className="mt-3 text-sm text-slate-400 leading-relaxed">
              Four automated stages from URL discovery to actionable compliance reports.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {([
              { num: "01", title: "Discovery & Crawling", desc: "Automated analysis of public notice URLs, cookie consent banners, sitemaps, and user login entrypoints.", badgeCls: "bg-cyan-500/10 text-cyan-400 border-cyan-500/15" },
              { num: "02", title: "Security Safeguards Audit", desc: "Evaluates CSP, HTTP security headers, cookie flags, and third-party tracking scripts.", badgeCls: "bg-blue-500/10 text-blue-400 border-blue-500/15" },
              { num: "03", title: "AI Compliance Engine", desc: "Interprets technical findings against the DPDPA 2023 legal framework and 2025 implementation rules.", badgeCls: "bg-violet-500/10 text-violet-400 border-violet-500/15" },
              { num: "04", title: "Actionable Report", desc: "Delivers compliance scores, gap evidence, policy drafts, and incident response playbooks.", badgeCls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" },
            ] as const).map((s, i) => (
              <div key={s.num} className="group relative">
                {/* Connector line between steps on large screens */}
                {i < 3 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(100%+2px)] w-[calc(1.5rem-4px)] h-px bg-gradient-to-r from-white/10 to-transparent z-10" />
                )}
                <div className="relative rounded-xl border border-white/[0.06] bg-[#0a1520]/80 p-6 h-full transition-all duration-300 hover:border-white/10 hover:bg-[#0c1825]">
                  <span className={`inline-flex items-center justify-center size-9 rounded-lg text-xs font-mono font-black border mb-4 ${s.badgeCls}`}>
                    {s.num}
                  </span>
                  <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━ FOOTER ━━━ */}
      <footer className="border-t border-white/[0.04] bg-[#040c15]">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <a href={dpdpCopy.vaptInsightsUrl} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-300 transition">
              <DpdpIcon name="arrow" className="size-4" />
              {dpdpCopy.backToVaptInsights}
            </a>
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500" aria-label="Footer navigation">
              {dpdpFooterLinks.map((link) =>
                link.isExternal ? (
                  <a href={link.href} target={link.target} rel={link.target === "_blank" ? "noopener noreferrer" : undefined} key={link.label} className="transition hover:text-slate-300">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} key={link.label} className="transition hover:text-slate-300">
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
          <p className="mt-6 border-t border-white/[0.04] pt-5 text-xs text-slate-600">{dpdpCopy.footer.disclaimer}</p>
        </div>
      </footer>
    </main>
  );
}
