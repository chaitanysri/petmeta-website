export type Consent = {analytics: boolean; marketing: boolean};

type Category = keyof Consent;

// Add approved vendor script URLs by category here. Leave both lists empty until configured.
const scripts: Record<Category, readonly string[]> = {analytics: [], marketing: []};

export function updateConsentScripts(previous: Consent | null, next: Consent) {
  const categories = ['analytics', 'marketing'] as const;
  if (categories.some(category => previous?.[category] && !next[category] && scripts[category].length)) {
    window.location.reload();
    return;
  }
  for (const category of categories) {
    if (!next[category]) continue;
    for (const src of scripts[category]) {
      if (Array.from(document.scripts).some(script => script.dataset.consentSrc === src)) continue;
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.dataset.consentSrc = src;
      document.head.append(script);
    }
  }
}
