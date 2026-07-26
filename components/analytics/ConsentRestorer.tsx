"use client";

import { useEffect } from "react";
import { restoreConsentPreference } from "@/lib/analytics/consent";

export function ConsentRestorer() {
  useEffect(() => {
    restoreConsentPreference();
  }, []);

  return null;
}
