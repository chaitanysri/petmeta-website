# Sunny Glass theme (home page)

Applies the yellow/orange glass design from `home_page.zip` to `/home` only.

## What changed
- `app/theme-sunny.css` (new, imported LAST in `app/layout.tsx`): all styling, scoped to `.delivery-home`.
- `components/HomeHero.tsx`: hero (screen 1) + "Pet Care, All in One Place" banner and quick tiles.
- `components/ShopFront.tsx`: uses HomeHero/HomeBanner; Home pill; calendar icon; lower shop sections show only after a category/search/wishlist is chosen.
- `components/ShopMenu.tsx`, `lib/shop-menu.ts`: Home pill, nav icons, photo badges, Pets menu labels as in design.
- `components/HomeDiscovery.tsx`: Pet Zone / Pets headings, photo cards for the 6 existing pets.
- `components/DeliveryHome.tsx`: booking + marketplace sections appear on demand; Marketplace uses `cartOnly` otherwise; footer hidden until a category is chosen (`<ShopFooter chrome={...}/>`).
- `components/BombDeals.tsx`: `id="bomb-deals"` anchor only.
- Font: `@fontsource-variable/montserrat` (run `npm install`).
- Images cropped from the design screens live in `public/home/` (hero, banner, menu photos, Pet Zone icons, pet photos).
  Replace them with final artwork later using the same file names.

## Easy places to edit later
- Offer chip text / video: top of `components/HomeHero.tsx` (`SALE_LABEL`, `SALE_VALUE`, video path).
- Footer on home: `chrome={category!=='all'}` in `DeliveryHome.tsx`.
- Colors: variables at the top of `app/theme-sunny.css`.

## Not changed
Login, rider, business, pet pages, product details, auth logic.
