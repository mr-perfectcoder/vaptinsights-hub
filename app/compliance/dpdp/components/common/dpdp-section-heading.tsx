export function DpdpSectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return <div className="max-w-2xl"><p className="text-xs font-semibold tracking-[0.18em] text-cyan-300">{eyebrow}</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">{title}</h2>{description ? <p className="mt-4 leading-7 text-slate-400">{description}</p> : null}</div>;
}
