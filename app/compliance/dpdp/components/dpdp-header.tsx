import Link from "next/link";
import { dpdpCopy } from "../constants/dpdp-homepage";
import { DpdpIcon } from "./dpdp-icon";

function DpdpBrand() {
  return (
    <Link href="/compliance/dpdp" className="flex items-center gap-3" aria-label={dpdpCopy.appName}>
      <span className="grid size-9 place-items-center rounded-md bg-[#5966e9] text-sm font-black text-white shadow-lg shadow-indigo-500/20">V</span>
      <span>
        <span className="block text-sm font-bold tracking-tight text-white">
          {dpdpCopy.appBrand} <span className="text-cyan-300">× {dpdpCopy.appProduct}</span>
        </span>
        <span className="block text-xs text-slate-400">{dpdpCopy.appDescription}</span>
      </span>
    </Link>
  );
}

interface DpdpHeaderProps {
  minimal?: boolean;
}

export function DpdpHeader({ minimal = false }: DpdpHeaderProps) {
  if (minimal) {
    return (
      <header className="border-b border-white/8 bg-[#061420]/95">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Top row */}
          <div className="flex h-10 items-center justify-between border-b border-white/5">
            <a href={dpdpCopy.vaptInsightsUrl} className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition hover:text-white">
              <DpdpIcon name="arrow" className="size-4" />
              {dpdpCopy.backToVaptInsights}
            </a>
          </div>

          {/* Main brand row */}
          <div className="flex h-16 items-center justify-between">
            <DpdpBrand />
            
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                <span className="size-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Beta v1.0
              </span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b border-white/8 bg-[#061420]/95">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between lg:hidden">
          <DpdpBrand />
          <details className="group relative">
            <summary aria-label="Open DPDP navigation" className="flex size-10 cursor-pointer list-none items-center justify-center rounded-md text-white transition hover:bg-white/5 [&::-webkit-details-marker]:hidden">
              <span className="flex flex-col gap-1.5" aria-hidden="true"><span className="h-0.5 w-5 rounded-full bg-current" /><span className="h-0.5 w-5 rounded-full bg-current" /><span className="h-0.5 w-5 rounded-full bg-current" /></span>
            </summary>
            <nav className="absolute right-0 top-12 z-20 w-64 rounded-xl border border-white/10 bg-[#0a1d2a] p-2 shadow-2xl shadow-black/40" aria-label="DPDP navigation">
              <a href={"/"} className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"><DpdpIcon name="arrow" className="size-4" />{dpdpCopy.backToVaptInsights}</a>
              <div className="my-1 border-t border-white/8" />
              {dpdpCopy.navigation.map((item) => <a href={item.href} key={item.label} className="block rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-cyan-200">{item.label}</a>)}
              <a href="#scanner" className="mt-2 block rounded-lg bg-cyan-400 px-3 py-3 text-center text-sm font-bold text-[#061420] transition hover:bg-cyan-300">{dpdpCopy.runSecurityScanAction}</a>
            </nav>
          </details>
        </div>

        <div className="hidden lg:block">
          <div className="flex h-14 items-center"><a href="/" className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 transition hover:text-white"><DpdpIcon name="arrow" className="size-4" />{dpdpCopy.backToVaptInsights}</a></div>
          <div className="flex min-h-18 items-center justify-between gap-4 border-t border-white/8 py-4">
            <DpdpBrand />
            <nav className="flex gap-5 text-sm text-slate-300" aria-label="DPDP navigation">{dpdpCopy.navigation.map((item) => <a href={item.href} key={item.label} className="whitespace-nowrap transition hover:text-cyan-300">{item.label}</a>)}</nav>
            <div className="flex items-center gap-3"><a href="#resources" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5">{dpdpCopy.searchAction}<DpdpIcon name="search" className="size-4" /></a><a href="#scanner" className="rounded-lg bg-cyan-400 px-3.5 py-2.5 text-sm font-bold text-[#061420] transition hover:bg-cyan-300">{dpdpCopy.runSecurityScanAction}</a></div>
          </div>
        </div>
      </div>
    </header>
  );
}
