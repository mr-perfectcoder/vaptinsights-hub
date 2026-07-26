"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface FieldHelpOption {
  label: string;
  whenToChoose: string;
  details: string;
}

export interface FieldHelpContent {
  title: string;
  section: string;
  whyNeeded: string;
  dpdpReference: string;
  example: string;
  impactIfMissing: string;
  optionsBreakdown?: FieldHelpOption[];
}

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: FieldHelpContent | null;
}

export function InfoModal({ isOpen, onClose, content }: InfoModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    // Prevent background page scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!mounted || !isOpen || !content) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#020912]/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#07192a] p-6 shadow-2xl shadow-cyan-950/50">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/8">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold text-sm">
              ℹ
            </span>
            <div>
              <span className="text-xs font-bold font-mono uppercase tracking-widest text-cyan-400">
                {content.section}
              </span>
              <h3 className="text-base font-bold text-white leading-tight">
                {content.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-7 place-items-center rounded-lg border border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/5 hover:text-white transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-4 space-y-4 text-xs leading-relaxed text-slate-300 max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10 pr-1">
          {/* Why Needed */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Why is this required?
            </h4>
            <p className="text-slate-300 text-xs">{content.whyNeeded}</p>
          </div>

          {/* Options Breakdown (If available) */}
          {content.optionsBreakdown && content.optionsBreakdown.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                <span>📋</span> Select Options Guide (When to choose which)
              </h4>
              <div className="space-y-2">
                {content.optionsBreakdown.map((opt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-white/8 bg-[#040e18]/80 space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-cyan-300">
                        {opt.label}
                      </span>
                      <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {opt.whenToChoose}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {opt.details}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DPDPA 2023 Law Reference */}
          <div className="rounded-xl border border-cyan-500/15 bg-cyan-500/5 p-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1 flex items-center gap-1.5">
              <span>⚖</span> Legal Reference (DPDPA 2023)
            </h4>
            <p className="text-slate-300 font-mono text-xs">
              {content.dpdpReference}
            </p>
          </div>

          {/* Example */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Valid Example
            </h4>
            <code className="block p-2 rounded-lg bg-[#040e18] border border-white/6 text-cyan-300 font-mono text-xs break-all">
              {content.example}
            </code>
          </div>

          {/* Compliance Impact */}
          <div className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 flex items-center gap-1.5">
              <span>⚠️</span> Compliance Audit Impact
            </h4>
            <p className="text-slate-300 text-xs">
              {content.impactIfMissing}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-white/8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/10 text-xs font-semibold text-white hover:bg-white/15 transition cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

interface InfoButtonProps {
  content: FieldHelpContent;
  onClick: (content: FieldHelpContent) => void;
}

export function InfoButton({ content, onClick }: InfoButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(content)}
      title={`Learn more about ${content.title}`}
      className="inline-flex items-center justify-center size-4 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-400 hover:text-[#061420] hover:border-cyan-400 transition-all duration-150 text-[10px] font-bold shrink-0 ml-1 cursor-pointer"
    >
      i
    </button>
  );
}
