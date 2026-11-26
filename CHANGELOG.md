# PetMeta change log

| Item | Result | Files |
| --- | --- | --- |
| 0 | Removed navigation and dragging from the auth logo. Shop and directory logos point to Home. | `components/auth/AnimatedAuth.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `components/PetMeta.tsx`, `ShopFront.tsx`, `ProductDetails.tsx`, `PetCollectionPage.tsx`, `app/auth-recovery.css` |
| 1 | Changed the existing portrait intro from cover to contain to preserve its full frame. | `app/animations.css` |
| 2 | The two active responsive intro cuts showed no fixed sparkle in the inspected frames. Added cleaned copies of the two legacy takes that showed it and kept the originals. The legacy takes have no intro component references to switch. | `public/intro-clean.mp4`, `public/videos/petmeta-intro-v2-clean.mp4` |
| 3 | Kept the existing Firebase recovery and single-use code handling. Opened recovery in a separate tab, prefilled the typed email, and standardized the neutral confirmation. | `components/auth/AnimatedAuth.tsx`, `ForgotPassword.tsx` |
| 4 | Added persistent Firebase sessions, provider fallback and linking, UID profile transactions, route guards, and account display. Existing owner-only Firestore rules already met the requirement. | `components/auth/AuthSession.tsx`, `AnimatedAuth.tsx`, `components/Providers.tsx`, `PetMeta.tsx`, `ShopFront.tsx`, `lib/auth-errors.ts`, `lib/firebase.ts`, `.env.example`, `app/auth-recovery.css` |
| 5 | Moved login and registration onto their own lightweight routes. Warmed the login route, cat and logo around logout and used a direct replace and versioned caching. | `app/login/page.tsx`, `app/register/page.tsx`, `app/[...path]/page.tsx`, `components/auth/AuthPage.tsx`, `lib/preload-auth.ts`, `lib/auth-logo.ts`, `next.config.mjs`, `components/auth/AuthSession.tsx`, `AnimatedAuth.tsx`, `ForgotPassword.tsx`, `ResetPassword.tsx`, `components/ShopFront.tsx`, `PetMeta.tsx` |
| 6 | Added production-only inspection deterrents, production source-map settings, and console stripping. | `components/SourceDeterrent.tsx`, `app/layout.tsx`, `next.config.mjs` |
| 7 | Added first-party consent, accessible preferences, a footer entry, a cookie policy, and consent-gated script loading. | `components/CookieConsent.tsx`, `ShopFront.tsx`, `lib/cookie-consent.ts`, `app/cookies.css`, `app/cookie-policy/page.tsx`, `app/layout.tsx` |
| 8 | Shared the Home and auth logo, aligned shop sections, and cleaned the tab title. The tagged Home and Login header text was already absent from the supplied archive; the hero footnote is outside the header. | `components/PetMetaLogo.tsx`, `ShopSection.tsx`, `ShopFront.tsx`, auth page components, `app/shop-layout.css`, `app/layout.tsx` |
| 9 | Unified dropdown state and dismissal behavior, plus keyboard navigation and focus styling. | `components/useDropdown.tsx`, `DeliveryHome.tsx`, `ShopFront.tsx`, `ShopMenu.tsx`, `app/shop-layout.css` |
| 10 | Replaced menu assets with original WebP illustrations. Added the native modal category drawer below 900 px. | `components/ShopMenu.tsx`, `lib/shop-menu.ts`, `app/shop-layout.css`, `public/shop-menu/`, `scripts/build-shop-menu.cjs`, `scripts/pet-illustration.cjs`, `package.json`, `package-lock.json`, `docs/IMAGE-CREDITS.md` |
| 11 | Created and wired eight original Pet Zone SVG and WebP illustrations. | `public/pet-zone/`, `scripts/build-pet-zone.cjs`, `components/HomeDiscovery.tsx`, `app/discovery.css`, `docs/IMAGE-CREDITS.md` |
| 12 | Put all Pet Zone items in one expandable responsive grid. The existing Pets link already opens the complete category page with a back link. | `components/HomeDiscovery.tsx`, `PetCollectionPage.tsx`, `app/discovery.css` |

See `SETUP-NOTES.md` for local and deployment configuration.

## 23 Nov 2026 – shared navbar and footer
- Navbar is now a full-width (100%) glass bar pinned to the top, with the logo in the top-left corner (`app/site-chrome.css`).
- Navbar extracted to `components/SiteHeader.tsx`; used by the home page and, via `components/SitePage.tsx` + `app/pets/layout.tsx`, by /pets, /pets/[animal] and /pets/details/[id].
- Same footer (`ShopFooter`) now appears on those pages; old per-page headers/footers removed.
- Saved-pets toggle moved from the old pets header into the results bar.
- Home page reads `?open=appointments|location`, `?product=<id>` and `?wishlist=1` so the navbar works from other pages.
- Product details screen now shows the shared navbar and footer and uses the sunny glass theme; added Back/Save bar.
