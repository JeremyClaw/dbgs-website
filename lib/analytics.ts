// Thin wrapper so section components can call trackEvent() without caring
// whether analytics is configured yet. No-ops until NEXT_PUBLIC_ANALYTICS_ID is set.
export function trackEvent(name: string, data?: Record<string, unknown>) {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_ID) return;
  if (typeof window === "undefined") return;

  // Placeholder integration point — wire up a real provider here once
  // NEXT_PUBLIC_ANALYTICS_ID is set (e.g. Plausible, Fathom, GA4).
  console.log("[analytics]", name, data);
}
