export const dpdpKeys = {
  all: ["dpdp"] as const,
  discover: (url: string) => [...dpdpKeys.all, "discover", url] as const,
  scan: (scanID: string) => [...dpdpKeys.all, "scan", scanID] as const,
};
