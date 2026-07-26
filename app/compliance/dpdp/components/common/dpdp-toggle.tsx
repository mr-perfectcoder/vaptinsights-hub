"use client";

import React, { memo } from "react";
import { ToggleProps } from "../../types/dpdp-form.types";
import { InfoButton } from "./dpdp-info-modal";

export const Toggle = memo(function Toggle({
  name,
  checked,
  onChange,
  label,
  description,
  badge,
  helpContent,
  onOpenHelp,
}: ToggleProps) {
  return (
    <div className="flex items-start justify-between gap-3 select-none rounded-xl border border-white/6 bg-white/[0.02] hover:border-white/12 hover:bg-white/[0.04] p-3.5 transition-all duration-200">
      <label className="flex items-start gap-3 cursor-pointer flex-1 min-w-0">
        <input name={name} type="checkbox" checked={Boolean(checked)} onChange={onChange} className="sr-only" />
        <span className={`relative mt-0.5 block h-[20px] w-[38px] shrink-0 rounded-full border transition-colors duration-300 ${
          checked ? "border-cyan-500/50 bg-cyan-500/20" : "border-white/10 bg-slate-800 group-hover:border-white/20"
        }`}>
          <span
            style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
            className={`absolute top-1/2 left-[3px] block size-[14px] rounded-full transition-all duration-300 ${
              checked ? "-translate-y-1/2 translate-x-[18px] bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.5)]" : "-translate-y-1/2 translate-x-0 bg-slate-500"
            }`}
          />
        </span>
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors flex items-center gap-1.5 flex-wrap">
            {label}
            {badge && <span className="px-1.5 rounded text-xs font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{badge}</span>}
          </span>
          <p className="text-xs leading-relaxed text-slate-500">{description}</p>
        </div>
      </label>
      {helpContent && onOpenHelp && (
        <InfoButton content={helpContent} onClick={onOpenHelp} />
      )}
    </div>
  );
});
