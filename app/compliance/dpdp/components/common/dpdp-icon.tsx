import type { ReactNode } from "react";
import type { DpdpIconName } from "../../types/dpdp-homepage";

const iconPaths: Record<DpdpIconName, ReactNode> = {
  arrow: <path d="M19 12H5m0 0 6 6m-6-6 6-6" />,
  shield: <path d="M12 3 4.5 6v5.2c0 4.7 3.2 8.9 7.5 9.8 4.3-.9 7.5-5.1 7.5-9.8V6L12 3Z" />,
  search: <><circle cx="11" cy="11" r="6" /><path d="m16 16 4 4" /></>,
  scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3m8 0h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" /><path d="M8 12h8" /></>,
  document: <><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v5h5M9 13h6m-6 4h6" /></>,
  cookie: <><path d="M19 13.5A7.5 7.5 0 1 1 10.5 5 4.5 4.5 0 0 0 19 13.5Z" /><circle cx="9" cy="13" r=".7" fill="currentColor" /><circle cx="13" cy="17" r=".7" fill="currentColor" /><circle cx="15.5" cy="11.5" r=".7" fill="currentColor" /></>,
  eye: <><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6Z" /><circle cx="12" cy="12" r="2.5" /></>,
  code: <><path d="m8 9-3 3 3 3m8-6 3 3-3 3m-2-10-4 14" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
};

export function DpdpIcon({ name, className = "" }: { name: DpdpIconName; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{iconPaths[name]}</svg>;
}
