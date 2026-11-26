import {AUTH_LOGO_SRC} from './auth-logo';

// Warm up everything the login page needs (3D cat code, its sprite sheet, the login route)
// while the intro video is still playing, so the cat is already there when the login page opens.
let started = false;
export function preloadAuthAssets(prefetchRoute?: (href: string) => void) {
  if (typeof window === 'undefined') return;
  prefetchRoute?.('/login');
  if (started) return;
  started = true;
  void import('@/components/three/PhotoCat').catch(() => { started = false; });
  const logo = new Image();
  logo.src = AUTH_LOGO_SRC;
  void logo.decode?.().catch(() => undefined);
  const img = new Image();
  img.decoding = 'async';
  img.src = '/cat-moods.png';
  void img.decode?.().catch(() => undefined);
}
