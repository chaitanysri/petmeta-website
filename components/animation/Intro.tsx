'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { preloadAuthAssets } from '@/lib/preload-auth';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';

// Two cuts of the same 10 s animation so it fits every screen without letterboxing:
//  - wide: 1080x700 crop of the logo band, used on landscape / desktop / tablet-landscape screens;
//          any extra screen width is filled with the clip's own background colour (see backgroundAt)
//  - tall: original 1080x1920 portrait cut, used on phones and tablets held upright
type Variant = 'wide' | 'tall';
const SOURCES: Record<Variant, { src: string; poster: string }> = {
  wide: { src: '/videos/petmeta-intro-responsive.mp4', poster: '/videos/petmeta-intro-poster.jpg' },
  tall: { src: '/videos/petmeta-intro-v3.mp4', poster: '/videos/petmeta-intro-poster-tall.jpg' },
};
const TALL_QUERY = '(max-aspect-ratio: 4/5)';

// The clip's own background is flat light grey, fading to brand yellow between 8.3 s and 9.2 s.
// Painting the area around the video with the same colour makes it read as one full-screen picture.
const GREY = [236, 236, 236];
const YELLOW = [249, 192, 40];
const FADE_FROM = 8.3;
const FADE_TO = 9.2;
function backgroundAt(time: number) {
  const k = Math.min(1, Math.max(0, (time - FADE_FROM) / (FADE_TO - FADE_FROM)));
  return `rgb(${GREY.map((g, i) => Math.round(g + (YELLOW[i] - g) * k)).join(',')})`;
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const video = useRef<HTMLVideoElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const resumeAt = useRef(0);
  const callback = useRef(onDone);
  const [variant, setVariant] = useState<Variant | null>(null);
  const [failed, setFailed] = useState(false);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  callback.current = onDone;
  const finish = useCallback(() => { if (!done.current) { done.current = true; callback.current(); } }, []);

  // Load the login page's cat while the intro plays.
  useEffect(() => { preloadAuthAssets(href => router.prefetch(href)); }, [router]);

  // Pick the cut that matches the screen shape (after mount, so server and client markup agree),
  // and switch seamlessly if the device is rotated or the window is resized mid-intro.
  useEffect(() => {
    const query = window.matchMedia(TALL_QUERY);
    const pick = () => {
      const next: Variant = query.matches ? 'tall' : 'wide';
      setVariant(current => {
        if (current && current !== next) resumeAt.current = video.current?.currentTime ?? 0;
        return next;
      });
    };
    pick();
    query.addEventListener('change', pick);
    return () => query.removeEventListener('change', pick);
  }, []);

  // Use media time and ended, not a wall-clock timer: a slow video must not be skipped.
  useEffect(() => { if (variant) video.current?.play().catch(() => setPaused(true)); }, [variant]);

  // Keep the surrounding background in step with the video's own background colour.
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const media = video.current;
      if (media && root.current) root.current.style.setProperty('--intro-bg', backgroundAt(media.currentTime));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const source = variant ? SOURCES[variant] : null;
  return <div ref={root} className={`intro intro-clean intro-${variant ?? 'wide'}`} data-testid="intro">
    {source && <video key={variant} ref={video} className="intro-main" src={source.src} poster={source.poster} autoPlay muted={muted} playsInline preload="auto" onEnded={finish}
      onError={() => setFailed(true)}
      onLoadedMetadata={event => { if (resumeAt.current > 0) { event.currentTarget.currentTime = resumeAt.current; resumeAt.current = 0; } }}
      onPlaying={() => setPaused(false)}
      onTimeUpdate={event => { const media = event.currentTarget; setProgress(media.duration ? media.currentTime / media.duration : 0); }} />}
    <button onClick={finish} className="skip">Skip intro <ArrowRight size={16} /></button>
    {!failed && <button className="intro-sound" onClick={() => setMuted(!muted)} aria-label={muted ? 'Unmute intro video' : 'Mute intro video'}>{muted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>}
    {paused && !failed && <button className="intro-play button" onClick={() => video.current?.play()}>Play intro</button>}
    {failed && <div className="intro-fallback"><p>The intro video couldn’t load.</p><button className="button" onClick={finish}>Continue to sign in <ArrowRight size={18} /></button></div>}
    <div className="intro-timeline"><span style={{ transform: `scaleX(${progress})` }} /></div>
  </div>;
}
