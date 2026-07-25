"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { useDPDPDiscover } from "@/hooks/query-hooks/dpdp.query";
import { homepageScanSchema, normalizeScanUrl } from "@/lib/validation/dpdp-scan.schema";
import { dpdpCopy, dpdpFooterLinks } from "../constants/dpdp-homepage";
import { DpdpHeader } from "./dpdp-header";
import { DpdpIcon } from "./dpdp-icon";

export function DpdpHomepage() {
  const router = useRouter();
  const [apiErrorMsg, setApiErrorMsg] = useState("");
  const discoverMutation = useDPDPDiscover();

  const formik = useFormik({
    initialValues: { url: "" },
    validationSchema: homepageScanSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values, { setSubmitting }) => {
      setApiErrorMsg("");
      const normalizedUrl = normalizeScanUrl(values.url, "origin");
      
      discoverMutation.mutate(normalizedUrl, {
        onSuccess: (data) => {
          router.push(`/compliance/dpdp/${data.scan_id}`);
        },
        onError: (err) => {
          setSubmitting(false);
          setApiErrorMsg(err.message || "Failed to analyze URL. Please check if the host resolves.");
        },
      });
    },
  });

  const isProcessing = formik.isSubmitting || discoverMutation.isPending;
  const displayError = (formik.touched.url && formik.errors.url) || apiErrorMsg;

  const steps = [
    {
      num: "01",
      title: "Discovery & Crawling",
      desc: "Automated analysis of public notice URLs, cookie consent banners, sitemaps, and user login entrypoints.",
    },
    {
      num: "02",
      title: "Security Safeguards Audit",
      desc: "Evaluates Content Security Policy (CSP), HTTP security headers, cookie flags, and third-party tracking scripts.",
    },
    {
      num: "03",
      title: "AI Compliance Engine",
      desc: "Interprets technical findings against the DPDPA 2023 legal framework and expected 2025 implementation rules.",
    },
    {
      num: "04",
      title: "Actionable Report & Playbook",
      desc: "Delivers a structured compliance score, gap evidence, policy update drafts, and incident response playbooks.",
    },
  ];

  const problemsSolved = [
    {
      icon: "🛡️",
      title: "Technical Safeguards (Section 8(5))",
      desc: "Identify missing security headers, missing CSP policies, and exposed tracking scripts that increase data breach exposure and regulatory risk.",
    },
    {
      icon: "📋",
      title: "Notice & Consent Compliance (Section 5)",
      desc: "Detect un-consented third-party trackers, missing cookie controls, and inaccessible privacy policies before audits.",
    },
    {
      icon: "⚡",
      title: "Developer-First Remediation",
      desc: "Skip vague legal advice. Get precise, actionable code snippets, header configurations, and incident playbooks your team can deploy immediately.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col justify-between bg-[#061420] text-slate-100 overflow-hidden">
      <div>
        <DpdpHeader minimal />

        {/* Hero / Scanner Section */}
        <section id="scanner" className="relative isolate py-16 sm:py-24 lg:py-28">
          {/* Ambient Background Lights */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_20%,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(14,116,144,0.12),transparent_40%)]" />
          
          <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-cyan-300 uppercase">
                <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                {dpdpCopy.hero.eyebrow}
              </span>

              <h1 className="mt-8 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                India's DPDP Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-cyan-400">Readiness Scanner</span>
              </h1>

              <p className="mx-auto mt-6 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-300 font-normal">
                {dpdpCopy.hero.description}
              </p>

              {/* URL Input Form */}
              <form 
                onSubmit={formik.handleSubmit} 
                className="mx-auto mt-10 max-w-xl rounded-2xl border border-white/12 bg-[#0b2130]/90 p-3 text-left shadow-2xl shadow-black/40 sm:p-4 backdrop-blur-xl"
              >
                <label htmlFor="website-url" className="mb-2 block px-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {dpdpCopy.hero.fieldLabel}
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className={`flex flex-1 items-center gap-3 rounded-xl border bg-[#061420] px-3.5 py-1 text-slate-400 transition ${
                    displayError ? "border-rose-500/60 focus-within:border-rose-500" : "border-white/10 focus-within:border-cyan-400/50"
                  }`}>
                    <DpdpIcon name="search" className="size-4 shrink-0 text-cyan-400" />
                    <input 
                      id="website-url" 
                      name="url"
                      type="text" 
                      value={formik.values.url}
                      onChange={(e) => {
                        setApiErrorMsg("");
                        formik.handleChange(e);
                      }}
                      onBlur={formik.handleBlur}
                      aria-invalid={Boolean(displayError)}
                      aria-describedby={displayError ? "website-url-error" : undefined}
                      placeholder={dpdpCopy.hero.fieldPlaceholder} 
                      className="h-11 w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500 font-medium" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 text-sm font-bold text-[#061420] transition hover:bg-cyan-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-cyan-400/20 shrink-0"
                  >
                    {isProcessing ? (
                      <>
                        <div className="size-4 rounded-full border-2 border-[#061420] border-t-transparent animate-spin" />
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <DpdpIcon name="scan" className="size-4" />
                        <span>{dpdpCopy.hero.scanAction}</span>
                      </>
                    )}
                  </button>
                </div>
                {displayError && (
                  <p id="website-url-error" role="alert" className="mt-3 px-2 text-xs font-medium text-rose-400 flex items-center gap-1.5 animate-fadeIn">
                    <span>⚠️</span> {displayError}
                  </p>
                )}
              </form>

              {/* Proof Points */}
              <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
                {dpdpCopy.hero.proofPoints.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Problems Solved */}
        <section className="border-t border-white/8 bg-[#04101a] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400/70">What Problem It Solves</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Bridge the Gap Between Regulation &amp; Technical Code
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                The DPDPA 2023 mandates strict technical safeguards for data fiduciaries. We automate the technical verification so engineering teams can remediate risks fast.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {problemsSolved.map((item) => (
                <div 
                  key={item.title}
                  className="rounded-2xl border border-white/8 bg-[#071726]/80 p-6 backdrop-blur-sm transition hover:border-cyan-400/25 hover:bg-[#091f33]"
                >
                  <span className="text-3xl">{item.icon}</span>
                  <h3 className="mt-4 text-base font-bold text-white">{item.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: How Processing Works */}
        <section className="border-t border-white/8 bg-[#061420] py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-400/70">Assessment Pipeline</span>
              <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                How the DPDPA Technical Scan Works
              </h2>
              <p className="mt-3 text-sm text-slate-400">
                Four automated stages to discover, analyze, and generate actionable compliance reports.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <div key={s.num} className="relative rounded-2xl border border-white/8 bg-[#0a1f30]/60 p-6">
                  <span className="text-xs font-mono font-bold text-cyan-400/60 block mb-2">{s.num}</span>
                  <h3 className="text-sm font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Clean Footer */}
      <footer className="border-t border-white/8 bg-[#04101a]">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <a href={dpdpCopy.vaptInsightsUrl} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-cyan-300 transition">
              <DpdpIcon name="arrow" className="size-4" />
              {dpdpCopy.backToVaptInsights}
            </a>
            <nav className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400" aria-label="Footer navigation">
              {dpdpFooterLinks.map((link) => 
                link.isExternal ? (
                  <a href={link.href} target={link.target} rel={link.target === "_blank" ? "noopener noreferrer" : undefined} key={link.label} className="transition hover:text-cyan-300">
                    {link.label}
                  </a>
                ) : (
                  <Link href={link.href} key={link.label} className="transition hover:text-cyan-300">
                    {link.label}
                  </Link>
                )
              )}
            </nav>
          </div>
          <p className="mt-6 border-t border-white/8 pt-5 text-xs text-slate-500">{dpdpCopy.footer.disclaimer}</p>
        </div>
      </footer>
    </main>
  );
}
