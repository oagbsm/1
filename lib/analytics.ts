// lib/analytics.ts

// Optional: helps TypeScript understand window.gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export function gtagEvent(
  name: string,
  params?: Record<string, any>
) {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;

  window.gtag("event", name, params || {});
}
