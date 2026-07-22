export type DpdpIconName =
  | "arrow"
  | "shield"
  | "search"
  | "scan"
  | "document"
  | "cookie"
  | "eye"
  | "code"
  | "chevron";

export interface DpdpTool {
  title: string;
  description: string;
  icon: DpdpIconName;
  accentClassName: string;
}

export interface DpdpArticle {
  category: string;
  title: string;
  readTime: string;
}

export interface DpdpFooterLink {
  label: string;
  href: string;
  isExternal?: boolean;
  target?: string;
}
