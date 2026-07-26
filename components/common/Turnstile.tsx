"use client";
import { useEffect, useRef } from "react";

interface TurnstileInstance {
  render: (element: HTMLElement, options: TurnstileOptions) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

interface TurnstileOptions {
  sitekey: string;
  callback: (token: string) => void;
  "error-callback"?: (error: string) => void;
  retry?: "auto" | "never";
  theme?: "dark" | "light";
}

declare global {
  interface Window {
    turnstile: TurnstileInstance;
  }
}

interface TurnstileProps {
  onVerify: (token: string) => void;
}

const Turnstile = ({ onVerify }: TurnstileProps) => {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);
  const onVerifyRef = useRef(onVerify);
  onVerifyRef.current = onVerify;

  useEffect(() => {
    const renderWidget = () => {
      if (!turnstileRef.current || !window.turnstile) return;

      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }

      try {
        const sitekey =
          (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY as string) ||
          "0x4AAAAAABYT1vZpsZ7ca2jt";

        widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
          sitekey,
          callback: (token: string) => onVerifyRef.current(token),
          "error-callback": (error: string) => {
            console.warn("Turnstile error:", error);
          },
          retry: "auto",
          theme: "dark",
        });
      } catch (error) {
        console.error("Turnstile render error:", error);
      }
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    if (!document.querySelector('script[src*="challenges.cloudflare.com/turnstile"]')) {
      scriptRef.current = document.createElement("script");
      scriptRef.current.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      scriptRef.current.async = true;
      scriptRef.current.onload = renderWidget;
      document.body.appendChild(scriptRef.current);
    } else {
      const poll = setInterval(() => {
        if (window.turnstile) {
          clearInterval(poll);
          renderWidget();
        }
      }, 100);
    }

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
        widgetIdRef.current = null;
      }
    };
  }, []);

  return <div ref={turnstileRef} className="inline-flex justify-center my-3" />;
};

export default Turnstile;
