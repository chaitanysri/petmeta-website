'use client';
import Link from 'next/link';
import {ArrowRight, BriefcaseMedical, CalendarCheck, HeartHandshake, MapPin, PawPrint, Scissors, Search, ShieldCheck, ShoppingBag, UtensilsCrossed} from 'lucide-react';
import SitePage from './SitePage';

const WHAT=[
  {icon:PawPrint,title:'Pets and breeds',text:'Explore dogs, cats and small pets, learn about each breed and find a companion that suits your home.',href:'/pets',cta:'Explore pets'},
  {icon:UtensilsCrossed,title:'Food and essentials',text:'Everyday food, accessories and toys for every stage of your pet’s life, all in one place.',href:'/food',cta:'Shop essentials'},
  {icon:Scissors,title:'Grooming',text:'Find grooming studios near you and book a session when it suits you.',href:'/grooming',cta:'Find grooming'},
  {icon:BriefcaseMedical,title:'Veterinary and wellness',text:'Discover local vets and health and wellness care, with appointments you can keep track of.',href:'/vet',cta:'Find a vet'},
];
const STEPS=[
  {icon:Search,title:'Discover',text:'Browse pets, products and local care providers in one marketplace.'},
  {icon:ShoppingBag,title:'Choose',text:'Compare options, check the seller or provider details and pick what fits.'},
  {icon:CalendarCheck,title:'Buy or book',text:'Pay securely online for products and manage your appointments from your account.'},
];
const VALUES=[
  {icon:ShieldCheck,title:'Transparent by design',text:'Seller and provider details are shown so you can check them before you buy or book.'},
  {icon:MapPin,title:'Local first',text:'We help neighbourhood shops, clinics and groomers reach pet owners near them.'},
  {icon:HeartHandshake,title:'Pets at the centre',text:'Every feature starts with one question: does this make life better for pets and their people?'},
];

export default function AboutPage(){
  return <SitePage>
    <main className="delivery-home about-page" id="about">
      <section className="about-hero">
        <div className="about-hero-copy">
          <span className="about-eyebrow">About PetMeta</span>
          <h1>For the love of <span>little paws.</span></h1>
          <p className="about-lead">Because pets aren’t just part of our lives. They make our lives whole. PetMeta brings the everyday parts of being a pet parent together in one welcoming place.</p>
          <div className="about-actions">
            <Link className="about-btn" href="/pets">Explore pets <ArrowRight size={18}/></Link>
            <a className="about-link" href="#about-story">Read our story</a>
          </div>
        </div>
        <div className="about-hero-visual"><img src="/home/hero-pets.webp" width={842} height={677} alt="A golden retriever and a tabby kitten resting their paws on a ledge" draggable={false}/></div>
      </section>

      <section className="about-story about-card" id="about-story">
        <div><span className="about-eyebrow dark">Our story</span><h2>One happy place. <em>A lifetime of care.</em></h2></div>
        <div className="about-story-text">
          <p>Looking after a pet often means juggling many things: finding the right companion, shopping for the right food, booking a groomer, and making time for the vet. They usually live in different places.</p>
          <p>PetMeta was created around a simple idea: caring for the ones you love should feel a little easier. We bring pets, essentials and trusted local care services together, so pet owners can discover, choose and book with confidence.</p>
          <p>We connect pet owners with sellers and care providers. Our promise is to keep the experience warm, clear and honest, so you always know who you are buying from or booking with.</p>
        </div>
      </section>

      <section className="about-section" aria-labelledby="about-what">
        <div className="about-head"><span className="about-eyebrow dark">What you can do</span><h2 id="about-what">Everything for your pet, in one place</h2></div>
        <div className="about-grid4">{WHAT.map(({icon:Icon,title,text,href,cta})=><article className="about-card about-feature" key={title}><span className="about-icon"><Icon size={26}/></span><h3>{title}</h3><p>{text}</p><Link href={href}>{cta} <ArrowRight size={16}/></Link></article>)}</div>
      </section>

      <section className="about-section" aria-labelledby="about-how">
        <div className="about-head"><span className="about-eyebrow dark">How it works</span><h2 id="about-how">Simple from the first click</h2></div>
        <ol className="about-steps">{STEPS.map(({icon:Icon,title,text},i)=><li className="about-card" key={title}><b aria-hidden="true">{i+1}</b><span className="about-icon"><Icon size={24}/></span><h3>{title}</h3><p>{text}</p></li>)}</ol>
      </section>

      <section className="about-section" aria-labelledby="about-values">
        <div className="about-head"><span className="about-eyebrow dark">What we stand for</span><h2 id="about-values">Our promise to pet people</h2></div>
        <div className="about-grid3">{VALUES.map(({icon:Icon,title,text})=><article className="about-value" key={title}><span className="about-icon solid"><Icon size={24}/></span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
      </section>

    </main>
  </SitePage>;
}
