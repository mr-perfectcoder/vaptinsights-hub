"use client";

import React, { memo } from "react";
import { SectionCardProps } from "../../types/dpdp-form.types";

export const SectionCard = memo(function SectionCard({
  step,
  title,
  badge,
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div className={`rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.03] to-transparent overflow-hidden flex flex-col ${className}`}>
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/8 bg-gradient-to-r from-white/[0.02] to-transparent shrink-0">
        <div className="flex items-center gap-2.5">
          <span className="grid size-5 place-items-center rounded-md bg-cyan-500/10 text-cyan-400 text-xs font-bold font-mono">{step}</span>
          <h3 className="text-sm font-bold text-slate-200">{title}</h3>
        </div>
        <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-xs font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{badge}</span>
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">{children}</div>
    </div>
  );
});
