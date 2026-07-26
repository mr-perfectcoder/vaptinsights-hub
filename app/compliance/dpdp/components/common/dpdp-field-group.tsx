"use client";

import React, { memo } from "react";
import { FieldGroupProps } from "../../types/dpdp-form.types";
import { InfoButton } from "./dpdp-info-modal";

export const FieldGroup = memo(function FieldGroup({
  label,
  badge,
  htmlFor,
  hint,
  required,
  helpContent,
  onOpenHelp,
  children,
}: FieldGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <label htmlFor={htmlFor} className="text-xs font-semibold uppercase tracking-widest text-slate-500">
          {label} {required && <span className="text-rose-400 font-bold">*</span>}
        </label>
        {badge && <span className="px-1.5 rounded text-xs font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{badge}</span>}
        {helpContent && onOpenHelp && (
          <InfoButton content={helpContent} onClick={onOpenHelp} />
        )}
      </div>
      {children}
      {hint && <p className="text-xs text-slate-600 leading-relaxed">{hint}</p>}
    </div>
  );
});
