"use client";

import React, { memo } from "react";
import { UrlFieldProps } from "../../types/dpdp-form.types";
import { InfoButton } from "../common/dpdp-info-modal";

export const UrlField = memo(function UrlField({
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  discoveredValue,
  isConfirmed,
  onConfirm,
  isNotAvailable,
  onToggleNotAvailable,
  onClearValue,
  helpContent,
  onOpenHelp,
}: UrlFieldProps) {
  const safeValue = value ?? "";
  const hasError = !isNotAvailable && touched && !!error;
  const hasValue = Boolean(safeValue && safeValue.trim().length > 0);
  const isAutofilled = !!discoveredValue && safeValue === discoveredValue && !isConfirmed && hasValue;
  const isEditedOrConfirmed = hasValue && (safeValue !== discoveredValue || isConfirmed);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (discoveredValue && e.target.value !== discoveredValue && !isConfirmed && e.target.value.trim().length > 0) {
      onConfirm();
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      {/* Label row */}
      <div className="flex items-center justify-between min-h-[18px]">
        <div className="flex items-center gap-1">
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            {label}
          </label>
          {helpContent && onOpenHelp && (
            <InfoButton content={helpContent} onClick={onOpenHelp} />
          )}
        </div>
        {isNotAvailable && (
          <span className="text-xs text-slate-500 italic">Not available</span>
        )}
        {!isNotAvailable && isEditedOrConfirmed && (
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <span>✓</span> Confirmed
          </span>
        )}
      </div>

      {/* Input — hidden when not-available */}
      {!isNotAvailable && (
        <>
          <div className={`flex items-center gap-2 rounded-xl border px-3 transition-all ${
            hasError || (!hasValue && touched)
              ? "border-rose-500/40 bg-rose-500/5 ring-1 ring-rose-500/15"
              : isAutofilled
                ? "border-amber-500/50 bg-amber-500/5 ring-1 ring-amber-500/10"
                : isEditedOrConfirmed
                  ? "border-emerald-500/25 bg-emerald-500/5 focus-within:border-emerald-400/40"
                  : "border-white/8 bg-[#050f1a] focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/10"
          }`}>
            {/* link icon */}
            <svg className={`size-3 shrink-0 ${isAutofilled ? "text-amber-500/60" : isEditedOrConfirmed ? "text-emerald-500/50" : "text-slate-600"}`}
              viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12.5 3.5a4.5 4.5 0 0 1 0 9H10m-3 0a4.5 4.5 0 0 1 0-9H10m0 0v9" strokeLinecap="round"/>
            </svg>

            <input
              id={id}
              name={name}
              type="text"
              value={safeValue}
              onChange={handleChange}
              onBlur={onBlur}
              aria-invalid={hasError}
              placeholder={placeholder}
              className={`h-9 w-full bg-transparent text-sm outline-none font-mono placeholder:text-slate-700 ${
                isAutofilled ? "text-amber-200" : isEditedOrConfirmed ? "text-emerald-100" : "text-slate-200"
              }`}
            />

            {/* Confirm button — only shown in amber/unconfirmed state */}
            {isAutofilled && (
              <button
                type="button"
                onClick={onConfirm}
                className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold
                  bg-amber-500/20 text-amber-300 border border-amber-500/30
                  hover:bg-amber-400/30 hover:text-amber-200 transition-all duration-150 whitespace-nowrap"
              >
                ✓ Confirm
              </button>
            )}
          </div>

          {/* Amber hint */}
          {isAutofilled && (
            <p className="text-xs text-amber-400/80 flex items-center gap-1.5">
              <span>⚠</span> Auto-discovered — review and confirm this URL
            </p>
          )}

          {/* Error */}
          {hasError && (
            <p className="text-xs text-rose-400 flex items-center gap-1"><span>⚠</span> {error}</p>
          )}
        </>
      )}

      {/* "I don't have this" checkbox */}
      <label className="mt-0.5 flex items-center gap-2 cursor-pointer group w-fit select-none">
        <input
          type="checkbox"
          checked={isNotAvailable}
          onChange={() => {
            if (!isNotAvailable) onClearValue();
            onToggleNotAvailable();
          }}
          className="sr-only"
        />
        <span className={`grid size-3.5 place-items-center rounded border transition-all duration-150 ${
          isNotAvailable
            ? "border-slate-500 bg-slate-500/20"
            : "border-white/15 bg-transparent group-hover:border-white/30"
        }`}>
          {isNotAvailable && <span className="text-xs text-slate-400 font-bold leading-none">✓</span>}
        </span>
        <span className={`text-xs transition-colors ${
          isNotAvailable ? "text-slate-400" : "text-slate-600 group-hover:text-slate-400"
        }`}>
          I don&apos;t have {label.toLowerCase().replace(" (optional)", "").replace(" url", " a URL")}
        </span>
      </label>
    </div>
  );
});
