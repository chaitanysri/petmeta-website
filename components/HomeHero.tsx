'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowRight, BriefcaseMedical, HeartHandshake, PawPrint, Play, Scissors, ShieldCheck, Truck, UtensilsCrossed, X} from 'lucide-react';

// Edit the marketing copy here. Nothing below is wired to real pricing.
const SALE_LABEL = 'Get Up to';
const SALE_VALUE = '50% OFF';
const TRUST = [
  {icon: ShieldCheck, lines: ['Trusted', 'Quality']},
  {icon: Truck, lines: ['Fast & Safe', 'Delivery']},
  {icon: HeartHandshake, lines: ['Pet Care', 'Expert Support']},
  {icon: PawPrint, lines: ['Happy Pets', 'Happy You']},
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({behavior: 'smooth', block: 'start'});
}

export default function HomeHero() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [video, setVideo] = useState(false);

  useEffect(() => {
    const node = dialog.current;
    if (video && !node?.open) node?.showModal();
    if (!video && node?.open) node.close();
  }, [video]);

  return <section className="sun-hero" aria-labelledby="sun-hero-title">
    <div className="sun-hero-copy">
      <span className="sun-eyebrow">The Pet Lifestyle Store</span>
      <h1 id="sun-hero-title"><span>The Connect</span><span className="sun-grad">Care Together</span></h1>
      <p className="sun-hero-sub">Because they’re not just pets, they’re <em>family</em>.</p>
      <div className="sun-hero-actions">
        <button type="button" className="sun-btn" onClick={() => scrollToId('pet-zone')}>Explore Our Collection <ArrowRight size={18}/></button>
        <button type="button" className="sun-watch" onClick={() => setVideo(true)}><span><Play size={16} fill="currentColor"/></span>Watch Video</button>
      </div>
    </div>
    <div className="sun-hero-visual">
      <img className="sun-hero-photo" src="/home/hero-pets.webp" width={842} height={677} alt="A golden retriever and a tabby kitten resting their paws on a ledge" draggable={false} fetchPriority="high"/>
    </div>
    <ul className="sun-trust" aria-label="Why PetMeta">
      {TRUST.map(({icon: Icon, lines}) => <li key={lines[0]}><Icon size={30} strokeWidth={1.6}/><span>{lines[0]}<br/>{lines[1]}</span></li>)}
    </ul>
    <button type="button" className="sun-sale" onClick={() => scrollToId('bomb-deals')}>
      <img src="/home/logo-mark.png" alt="" width={56} height={44} draggable={false}/>
      <span>{SALE_LABEL}<b>{SALE_VALUE}</b></span>
      <i aria-hidden="true"><ArrowRight size={18}/></i>
    </button>
    <dialog className="sun-video" ref={dialog} aria-label="PetMeta video" onClose={() => setVideo(false)}
      onClick={event => {if (event.target === event.currentTarget) setVideo(false);}}>
      <button type="button" className="sun-video-close" aria-label="Close video" onClick={() => setVideo(false)}><X size={20}/></button>
      {video && <video src="/videos/petmeta-intro-responsive.mp4" poster="/videos/petmeta-intro-poster.jpg" controls autoPlay playsInline/>}
    </dialog>
  </section>;
}

const SLIDES = [
  {title: 'Pet Care, All in One Place', text: 'Discover pets, pet food, accessories, veterinary care and more — at PetMeta.', cta: 'Explore Now', go: 'pets'},
  {title: 'Good Food. Happy Tails.', text: 'Thoughtfully picked food and treats for every kind of pet.', cta: 'Shop Pet Food', go: 'food'},
  {title: 'Expert Care, Close By.', text: 'Find veterinary clinics near you and plan a visit.', cta: 'Find a Vet', go: 'vet'},
  {title: 'Fresh Fur. Big Smiles.', text: 'Book a grooming session your pet will love.', cta: 'Book Grooming', go: 'grooming'},
];
const TILES = [
  {icon: PawPrint, label: 'Buy Pets', go: 'pets'},
  {icon: UtensilsCrossed, label: 'Pet Food', go: 'food'},
  {icon: BriefcaseMedical, label: 'Vet Care', go: 'vet'},
  {icon: Scissors, label: 'Grooming', go: 'grooming'},
];

export function HomeBanner({onSelect}: {onSelect: (category: string) => void}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = setInterval(() => {if (!document.hidden) setIndex(i => (i + 1) % SLIDES.length);}, 6500);
    return () => clearInterval(timer);
  }, [paused]);
  const slide = SLIDES[index];
  return <section className="sun-banner-row" aria-label="Shop PetMeta">
    <div className="sun-banner" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <div className="sun-banner-copy" aria-live="off">
        <h2 key={slide.title}>{(()=>{const m=slide.title.match(/^(.+?[,.])\s+(.+)$/);return m?<>{m[1]}<br/>{m[2]}</>:slide.title})()}</h2>
        <p key={slide.text}>{slide.text}</p>
        <button type="button" className="sun-btn" onClick={() => onSelect(slide.go)}>{slide.cta} <ArrowRight size={18}/></button>
      </div>
      <img className="sun-banner-photo" src="/home/banner-pets.webp" width={554} height={264} alt="" draggable={false} loading="lazy"/>
      <div className="sun-dots" role="group" aria-label="Choose banner">
        {SLIDES.map((s, i) => <button type="button" key={s.title} aria-label={`Show banner ${i + 1}: ${s.title}`} aria-current={i === index} onClick={() => setIndex(i)}/>)}
      </div>
    </div>
    <div className="sun-tiles">
      {TILES.map(({icon: Icon, label, go}) => <button type="button" key={label} onClick={() => onSelect(go)}><Icon size={40} strokeWidth={1.7}/><span>{label}</span></button>)}
    </div>
  </section>;
}
