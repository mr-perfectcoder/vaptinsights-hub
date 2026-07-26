"use client";

import React, { memo } from "react";
import { CustomUrlsSectionProps } from "../../types/dpdp-form.types";

export const CustomUrlsSection = memo(function CustomUrlsSection({
  items,
  onChange,
}: CustomUrlsSectionProps) {
  const getUniqueId = () => (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9));
  
  const add = () =>
    onChange([...items, { id: getUniqueId(), field_name: "", value: "", error: undefined }]);

  const remove = (id: string) => onChange(items.filter((it) => it.id !== id));

  const update = (id: string, key: "field_name" | "value", val: string) =>
    onChange(items.map((it) => (it.id === id ? { ...it, [key]: val, error: undefined } : it)));

  return (
    <div className="flex flex-col gap-3">
      {/* Header row */}
      {items.length > 0 && (
        <div className="grid grid-cols-[140px_1fr_28px] gap-2 px-0.5">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Field Label</span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600">URL</span>
          <span />
        </div>
      )}

      {/* Entries */}
      {items.map((item) => (
        <div key={item.id} className="grid grid-cols-[140px_1fr_28px] gap-2 items-start">
          {/* Field name */}
          <input
            type="text"
            value={item.field_name}
            onChange={(e) => update(item.id, "field_name", e.target.value)}
            placeholder="e.g. Cookie Policy"
            className="h-9 px-3 rounded-xl border border-white/8 bg-[#050f1a] text-sm text-slate-200
              placeholder:text-slate-700 outline-none focus:border-cyan-500/40 focus:ring-1
              focus:ring-cyan-500/10 transition w-full"
          />
          {/* URL */}
          <div className={`flex items-center gap-2 rounded-xl border px-3 bg-[#050f1a] transition-all ${
            item.error ? "border-rose-500/40 ring-1 ring-rose-500/15" : "border-white/8 focus-within:border-cyan-500/40 focus-within:ring-1 focus-within:ring-cyan-500/10"
          }`}>
            <svg className="size-3 shrink-0 text-slate-600" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12.5 3.5a4.5 4.5 0 0 1 0 9H10m-3 0a4.5 4.5 0 0 1 0-9H10m0 0v9" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={item.value}
              onChange={(e) => update(item.id, "value", e.target.value)}
              placeholder="https://example.com/page"
              className="h-9 w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-700 font-mono"
            />
          </div>
          {/* Remove */}
          <button
            type="button"
            onClick={() => remove(item.id)}
            className="mt-1 grid size-7 place-items-center rounded-lg border border-white/8 text-slate-600
              hover:border-rose-500/30 hover:text-rose-400 hover:bg-rose-500/5 transition-all duration-150 shrink-0"
            title="Remove"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5">
              <path strokeLinecap="round" d="M4 4l8 8M12 4l-8 8"/>
            </svg>
          </button>
          {item.error && (
            <p className="col-span-3 -mt-1 text-xs text-rose-400 flex items-center gap-1 pl-0.5">
              <span>⚠</span> {item.error}
            </p>
          )}
        </div>
      ))}

      {/* Add button */}
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-2 w-fit px-3.5 py-2 rounded-xl border border-dashed border-white/15
          text-xs font-semibold text-slate-500 hover:border-cyan-500/40 hover:text-cyan-400
          hover:bg-cyan-500/5 transition-all duration-150 group"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5 group-hover:scale-110 transition-transform">
          <path strokeLinecap="round" d="M8 3v10M3 8h10"/>
        </svg>
        Add custom legal page URL
      </button>
    </div>
  );
});
