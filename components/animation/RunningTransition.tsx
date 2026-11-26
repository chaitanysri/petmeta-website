'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { ArrowRight } from 'lucide-react';

// Shown right after a successful sign-in. It used to play a low-resolution (848x478) video that looked
// blurry on full-size screens; this is drawn live in the browser, so it is sharp at any resolution
// and always matches the site's logo and colours.
const AnimatedKitten = dynamic(() => import('@/components/three/PhotoCat'), { ssr: false });
const SHOW_MS = 2600;      // how long the welcome stays once the kitten is on screen
const FALLBACK_MS = 5000;  // if the kitten can't load (e.g. no WebGL), continue anyway

export default function RunningTransition({ onDone, name }: { onDone: () => void; name?: string }) {
  const finished = useRef(false);
  const callback = useRef(onDone);
  callback.current = onDone;
  const [catReady, setCatReady] = useState(false);
  const loaded = useCallback(() => setCatReady(true), []);
  const finish = useCallback(() => { if (!finished.current) { finished.current = true; callback.current(); } }, []);
  // The clock starts when the kitten appears, so a slow first load never skips the welcome.
  useEffect(() => {
    const timer = setTimeout(finish, catReady ? SHOW_MS : FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [catReady, finish]);
  const first = (name ?? '').trim().split(/\s+/)[0];

  return <section className="welcome-moment" data-testid="running-transition" aria-label="Welcome to PetMeta" data-ready={catReady} style={{ ['--welcome-ms' as string]: `${SHOW_MS}ms` }}>
    <button className="welcome-skip" onClick={finish}>Skip <ArrowRight size={16} /></button>
    <div className="welcome-body">
      <img className="welcome-logo" src="/branding/petmeta-orange-transparent.png" alt="PetMeta" />
      <div className="welcome-cat" data-ready={catReady}>
        <AnimatedKitten mood="joyful" onReady={loaded} />
        <div className="cat-sparkles" aria-hidden="true"><span>✦</span><span>✧</span><span>✦</span></div>
      </div>
      <h1 className="welcome-title">{first && first.toLowerCase() !== 'pet' ? `Welcome, ${first}!` : 'Welcome to PetMeta!'}</h1>
      <p className="welcome-sub" role="status">Getting your happy place ready…</p>
      <div className="welcome-progress" aria-hidden="true"><span /></div>
    </div>
  </section>;
}
