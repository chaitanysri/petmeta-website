'use client';
import {useEffect,useRef,useState} from 'react';
import {useRouter} from 'next/navigation';
import {MapPin, Heart, ShoppingBag, UserRound, ChevronDown, ArrowRight, ArrowLeft, Truck, ShieldCheck, RefreshCw, Stethoscope, X, Plus, Minus, Pause, Play, CalendarDays, Instagram, Facebook, Youtube, MessageCircle, Mail, Phone, Clock, Headphones} from 'lucide-react';
import {SOCIAL_LINKS,CONTACT} from '@/lib/site-links';
import {preloadAuthAssets} from '@/lib/preload-auth';
import {useAuthSession} from './auth/AuthSession';
import BreedCollections,{tilePosition} from './BreedCollections';
import PhotoBreeds from './PhotoBreeds';
import HomeHero,{HomeBanner} from './HomeHero';
import SmallPetsWeb from './SmallPetsWeb';
import HomeDiscovery from './HomeDiscovery';
import StoreMotion from './StoreMotion';
import BombDeals from './BombDeals';
import PetMetaLogo from './PetMetaLogo';
import ShopSection from './ShopSection';
import SiteHeader from './SiteHeader';
import type { ShopMenuAction } from '@/lib/shop-menu';
import {useDeals} from '@/lib/bomb-deals';
import {storeProducts} from '@/lib/store-catalog';
export default function ShopFront({category,choose,query,setQuery,onNotice,onPetBrowse,locationLabel,locationOpen,onLocationClick,locationTrigger}:{category:string;choose:(s:string)=>void;query:string;setQuery:(s:string)=>void;onNotice:(s:string)=>void;onPetBrowse:(kind:string)=>void;locationLabel:string;locationOpen:boolean;onLocationClick:()=>void;locationTrigger:(node:HTMLButtonElement|null)=>void}){
 const router=useRouter();
 const {user,logout}=useAuthSession();
 const [cart,setCart]=useState<Record<string,number>>({}),[saved,setSaved]=useState<string[]>([]),[max,setMax]=useState(1500),[brand,setBrand]=useState('All'),[sort,setSort]=useState('featured'),[wishOnly,setWishOnly]=useState(false),[seconds,setSeconds]=useState(0);
 useEffect(()=>{const load=()=>{try{setCart(JSON.parse(localStorage.getItem('pm-store-cart')||'{}'));setSaved(JSON.parse(localStorage.getItem('pm-market-saved')||'[]'))}catch{}};load();window.addEventListener('pm-store-change',load);const tick=()=>{const now=new Date(),end=new Date();end.setHours(24,0,0,0);setSeconds(Math.floor((+end-+now)/1000))};tick();const timer=setInterval(tick,1000);return()=>{window.removeEventListener('pm-store-change',load);clearInterval(timer)}},[]);
 useEffect(()=>{if(new URLSearchParams(window.location.search).get('wishlist')==='1'){choose('all');setWishOnly(true);setTimeout(()=>document.getElementById('shop-products')?.scrollIntoView({behavior:'smooth'}),400)}},[]);
 function select(c:string){if(["dogs","cats","app"].includes(c)){setQuery("");document.getElementById(c==="app"?"petmeta-app":c==="dogs"?"dog-breeds":"cat-breeds")?.scrollIntoView({behavior:"smooth"});return;}setWishOnly(false);choose(c);if(!['pets','grooming','vet'].includes(c))setTimeout(()=>document.getElementById('shop-products')?.scrollIntoView({behavior:'smooth'}),50)}
 const showMore=category!=='all'||wishOnly||!!query;
 function goHome(){setWishOnly(false);setQuery('');choose('all');window.scrollTo({top:0,behavior:'smooth'})}
 function menuAction(action:ShopMenuAction){
  if(action.type==='category'){setQuery(action.query||'');select(action.category)}
  else if(action.type==='product')window.dispatchEvent(new CustomEvent('pm-open-product',{detail:action.productId}));
  else if(action.type==='pet')router.push(action.pet==='all'?'/pets':`/pets/${action.pet}`);
  else if(action.type==='appointments')window.dispatchEvent(new Event('pm-open-appointments'));
  else setTimeout(()=>document.querySelector(action.selector)?.scrollIntoView({behavior:'smooth',block:'start'}),0);
 }
 function quantity(id:string,d:number){window.dispatchEvent(new CustomEvent('pm-open-product',{detail:id}));onNotice('This catalogue item is a preview. Choose a published seller product to purchase.')}
 function favourite(id:string){const next=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem('pm-market-saved',JSON.stringify(next));setSaved(next);window.dispatchEvent(new Event('pm-store-change'))}
 const siteHandlers=useRef<{action:(a:ShopMenuAction)=>void;home:()=>void;wish:()=>void}>({action:()=>{},home:()=>{},wish:()=>{}});
 siteHandlers.current={action:menuAction,home:goHome,wish:()=>{choose('all');setWishOnly(true);setTimeout(()=>document.getElementById('shop-products')?.scrollIntoView({behavior:'smooth'}),60)}};
 useEffect(()=>{const a=(e:Event)=>siteHandlers.current.action((e as CustomEvent).detail);const h=()=>siteHandlers.current.home();const w=()=>siteHandlers.current.wish();window.addEventListener('pm-site-action',a);window.addEventListener('pm-site-home',h);window.addEventListener('pm-site-wishlist',w);return()=>{window.removeEventListener('pm-site-action',a);window.removeEventListener('pm-site-home',h);window.removeEventListener('pm-site-wishlist',w)}},[]);
 const {price:dealPrice}=useDeals();
 const pricedProducts=storeProducts.map(p=>({...p,price:dealPrice(p.id,p.price)}));
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 const filtered=pricedProducts.filter(p=>(category==='all'||category==='offers'||category==='pets'||category==='vet'||p.category===category)&&p.price<=max&&(brand==='All'||p.brand===brand)&&(!wishOnly||saved.includes(p.id))&&`${p.name} ${p.description} ${p.brand}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:0);
 function card(p:typeof storeProducts[number],deal=false){return <article className="shop-product" key={p.id}><button type="button" className="pd-card-open" aria-label={`View ${p.name} details`} onClick={()=>window.dispatchEvent(new CustomEvent('pm-open-product',{detail:p.id}))}><div className="product-photo" style={{backgroundPosition:tilePosition(p.tile)}} role="img" aria-label={p.name}/></button><button className="shop-heart" aria-label={`Wishlist ${p.name}`} aria-pressed={saved.includes(p.id)} onClick={()=>favourite(p.id)}><Heart size={18} fill={saved.includes(p.id)?'#ffc800':'none'}/></button>{deal&&<span className="limited-ribbon">LIMITED TIME</span>}<div className="shop-product-copy"><small>{p.brand} · Sample product</small><h3><button type="button" className="pd-card-name" onClick={()=>window.dispatchEvent(new CustomEvent('pm-open-product',{detail:p.id}))}>{p.name}</button></h3><span className="product-rating">☆ Not yet reviewed</span><div className="price-line"><b>₹{p.price}</b><del>₹{p.mrp}</del><em>{Math.round((1-p.price/p.mrp)*100)}% off</em></div><button className="shop-add" onClick={()=>quantity(p.id,1)}>View details <Plus size={15}/></button></div></article>}
 return <><StoreMotion/>
 <SiteHeader category={category} query={query} locationLabel={locationLabel} locationOpen={locationOpen} locationTrigger={locationTrigger} onLocationClick={onLocationClick} onMenuAction={menuAction} onHome={goHome} onNotice={onNotice} onAccountItem={t=>{if(t==='My Pets')select('pets');else{setWishOnly(true);document.getElementById('shop-products')?.scrollIntoView({behavior:'smooth'})}}} onWishlist={()=>{choose('all');setWishOnly(true);document.getElementById('shop-products')?.scrollIntoView({behavior:'smooth'})}}/>
 <HomeHero/>
 <HomeBanner onSelect={select}/>
 <section className="pm-home-category-strip" aria-label="Explore all PetMeta categories"><div className="pm-home-category-heading"><span>EXPLORE PETMETA</span><h2>Everything your pet needs, in one place.</h2></div><div className="pm-home-category-links">{[['Home','all'],['Pets','pets'],['Food','food'],['Accessories','accessories'],['Grooming','grooming'],['Veterinary','vet'],['Toys','toys'],['Health & Wellness','health'],['Offers','offers']].map(([label,id])=><button key={id} type="button" aria-pressed={category===id} onClick={()=>{if(id==='pets'){router.push('/pets');return}if(id==='all'){goHome();return}if(id==='toys'){setQuery('play');select('accessories');return}setQuery('');select(id)}}>{label}<ArrowRight size={14} aria-hidden="true"/></button>)}</div></section>
 <div className="shop-main"><HomeDiscovery onSelect={select} onListings={kind=>{setQuery('');setWishOnly(false);onPetBrowse(kind)}}/><BombDeals onNotice={onNotice}/>
 {showMore&&<><PhotoBreeds query={query}/><SmallPetsWeb/><BreedCollections query={query} cart={cart} add={(id,d=1)=>quantity(id,d)}/><ShopSection id="shop-products" className="shop-products-area"><div className="shop-section-title"><div><span>THOUGHTFULLY PICKED. HAPPILY PRICED.</span><h2>{wishOnly?'Your wishlist':query?`Results for “${query}”`:'Everyday love, extraordinary finds.'}</h2></div><small>Preview catalog · Prices and offers are examples</small></div>
 <div className="shop-filter-bar"><label>Budget <input type="range" min="200" max="1500" step="50" value={max} onChange={e=>setMax(+e.target.value)}/> ₹{max}</label><label>Brand <select value={brand} onChange={e=>setBrand(e.target.value)}><option>All</option><option>PetMeta</option><option>Paw Pantry</option><option>Kind Paws</option></select></label><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select><button onClick={()=>{setMax(1500);setBrand('All');setQuery('');setWishOnly(false);choose('all')}}>Clear filters</button></div>
 {([['food','Deals on Pet Food','GOOD FOOD. EVEN BETTER DAYS.'],['grooming','Grooming Essentials','A LITTLE PAMPERING GOES A LONG WAY.'],['health','Health & Wellness','THOUGHTFUL CARE FOR EVERY LIFE STAGE.'],['accessories','Trending Toys & Accessories','MORE PLAY. MORE TAIL WAGS.']] as string[][]).map(([c,title,kicker])=>{const row=filtered.filter(p=>p.category===c);return row.length?<section className="shop-product-section" key={c}><div className="shop-row-banner"><div><small>{kicker}</small><h2>{title}</h2></div><button onClick={()=>select(c)}>View all <ArrowRight size={16}/></button></div><div className="shop-product-row">{row.map(p=>card(p))}</div></section>:null})}{!filtered.length&&<p className="market-empty">No products match. Clear a filter or try another search.</p>}
 </ShopSection><ShopSection className="shop-booking-cta"><div className="booking-lifestyle lifestyle-photo" role="img" aria-label="Professional groomer caring for a spaniel" style={{backgroundPosition:tilePosition(7,3)}}/><div><span>GOOD CARE IS ALWAYS CLOSE.</span><h2>A fresh groom.<br/>A little peace of mind.</h2><p>Book a grooming session or vet visit near you.</p><button onClick={()=>select('grooming')}>Book grooming <ArrowRight size={17}/></button><button className="secondary" onClick={()=>select('vet')}>Find a vet</button></div></ShopSection>
 <section className="shop-trust">{[[Truck,'Fast Delivery','Delivery options shown when stores connect'],[Stethoscope,'Expert veterinary care','Check credentials with your chosen provider'],[ShieldCheck,'Genuine Products','Seller details available before purchase'],[RefreshCw,'Easy Returns','Review the seller’s terms before ordering']].map(([Icon,title,desc]:any)=><div key={title}><Icon size={24}/><div><b>{title}</b><small>{desc}</small></div></div>)}</section>
 <section className="daily-deals"><div className="shop-row-banner"><div><small>A LITTLE TREAT FOR TODAY.</small><h2>Deals of the day</h2></div><div className="deals-clock"><span>Preview ends in</span><b>{String(Math.floor(seconds/3600)).padStart(2,'0')} : {String(Math.floor(seconds/60)%60).padStart(2,'0')} : {String(seconds%60).padStart(2,'0')}</b></div></div><div className="shop-product-row">{pricedProducts.filter(p=>p.category==='offers').map(p=>card(p,true))}</div></section></>}</div>
 </>
}
export function ShopFooter({chrome=true}:{chrome?:boolean}) {
 const [panel,setPanel]=useState('');
 const [message,setMessage]=useState('');
 useEffect(()=>{const open=()=>{setPanel('Partner registration');setMessage('')};window.addEventListener('pm-partner',open);return()=>window.removeEventListener('pm-partner',open)},[]);
 const links:{heading:string;items:string[][]}[]=[
  {heading:'Shop',items:[['All pets','/pets'],['Pet food','/home?category=food'],['Accessories','/home?category=accessories'],['Toys','/home?category=accessories&search=play'],['Offers','/home?category=offers','Sale']]},
  {heading:'Care services',items:[['Grooming','/home?category=grooming'],['Veterinary','/home?category=vet'],['Health & wellness','/home?category=health'],['My appointments','/home?open=appointments']]},
  {heading:'Company and help',items:[['About PetMeta','/about'],['Become a partner','#partner','','Partner registration'],['Contact and support','#support','','Contact & Support'],['FAQs','#faq','','FAQs']]}
 ];
 const legal=[['Privacy policy','#privacy','Privacy Policy'],['Terms and conditions','#terms','Terms & Conditions'],['Disclaimer','#disclaimer','Disclaimer']];
 const socials:[typeof Instagram,string,string][]=[[Instagram,'Instagram',SOCIAL_LINKS.instagram],[Facebook,'Facebook',SOCIAL_LINKS.facebook],[Youtube,'YouTube',SOCIAL_LINKS.youtube],[MessageCircle,'Chat with us',SOCIAL_LINKS.chat]];
 const [nlEmail,setNlEmail]=useState(''),[nlMsg,setNlMsg]=useState('');
 function subscribe(e:React.FormEvent){e.preventDefault();try{localStorage.setItem('pm-newsletter-email',nlEmail)}catch{}setNlMsg('Thanks! Your email is saved on this device. Newsletter sign-up is not live yet.');setNlEmail('')}
 function handleClick(href:string,label:string){if(href.startsWith('#')){setPanel(label);setMessage('')}else window.location.assign(href)}
 return <>
 {chrome&&<footer className="pm-footer2" id="petmeta-footer" aria-label="PetMeta website footer">
  <div className="pm-f2-wrap">
   <section className="pm-f2-cta" aria-label="List your business on PetMeta"><div><h2>Run a pet shop, clinic or grooming studio?</h2><p>Reach pet owners near you by listing on PetMeta.</p></div><div className="pm-f2-cta-actions"><button type="button" className="dark" onClick={()=>handleClick('#partner','Partner registration')}>Become a partner</button><button type="button" className="ghost" onClick={()=>handleClick('#support','Contact & Support')}>Talk to us</button></div></section>
   <div className="pm-f2-main">
    <div className="pm-f2-brand"><PetMetaLogo home/><p>Pets, essentials and local care services in one welcoming marketplace.</p>
     <div className="pm-f2-social">{socials.map(([Icon,label,url])=>url?<a key={label} href={url} target="_blank" rel="noopener noreferrer" aria-label={label}><Icon size={17}/></a>:<button type="button" key={label} aria-label={label} title={`${label}: coming soon`} onClick={()=>handleClick('#support','Contact & Support')}><Icon size={17}/></button>)}</div></div>
    <div className="pm-f2-right">
     <div className="pm-f2-cols">{links.map(group=><nav className="pm-f2-col" key={group.heading} aria-label={group.heading}><h3>{group.heading}</h3>{group.items.map(([label,href,tag,panelName])=><button type="button" key={label} onClick={()=>handleClick(href,panelName||label)}>{label}{tag&&<em>{tag}</em>}</button>)}</nav>)}</div>
     <div className="pm-f2-contact">
      <div><span aria-hidden="true"><Mail size={19}/></span><p><b>Email us</b><small>{CONTACT.email}</small></p></div>
      <div><span aria-hidden="true"><Phone size={19}/></span><p><b>Call us</b><small>{CONTACT.phone}</small></p></div>
      <div><span aria-hidden="true"><Clock size={19}/></span><p><b>Support hours</b><small>{CONTACT.hours}</small></p></div>
     </div>
    </div>
   </div>
   <form className="pm-f2-news" onSubmit={subscribe} aria-label="Newsletter sign-up"><div><h3>Get pet care tips and offers</h3><p>Feeding guides, grooming advice and deals from local sellers. One email a week, no spam.</p></div><div className="pm-f2-news-form"><div><input type="email" required placeholder="Your email" aria-label="Your email" value={nlEmail} onChange={e=>setNlEmail(e.target.value)}/><button type="submit">Subscribe</button></div>{nlMsg&&<small role="status">{nlMsg}</small>}</div></form>
   <div className="pm-f2-trust">
    <div><span aria-hidden="true"><ShieldCheck size={22}/></span><p><b>Verified sellers</b><small>Check seller details before you buy.</small></p></div>
    <div><span aria-hidden="true"><MapPin size={22}/></span><p><b>Local providers</b><small>Vets and groomers in your area.</small></p></div>
    <div><span aria-hidden="true"><Headphones size={22}/></span><p><b>Friendly support</b><small>Help with orders and bookings.</small></p></div>
   </div>
   <div className="pm-f2-bottom"><span>© {new Date().getFullYear()} PetMeta. Made for happier pets and their people.</span><nav aria-label="Legal">{legal.map(([label,href,panelName])=><button type="button" key={label} onClick={()=>handleClick(href,panelName)}>{label}</button>)}</nav></div>
  </div>
 </footer>}
 {panel&&<div className="market-overlay"><section className="market-dialog" role="dialog" aria-modal="true" aria-label={panel}><button className="market-close" aria-label="Close information" onClick={()=>setPanel('')}><X/></button><h2>{panel}</h2>{panel==='Partner registration'?<form className="listing-form" onSubmit={e=>{e.preventDefault();localStorage.setItem('pm-partner-draft',JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))));setMessage('Partner interest saved on this device. Submission is not live yet.')}}><label>Business name<input name="business" required/></label><label>Email<input name="email" type="email" required/></label><label>City<input name="city" required/></label><button className="market-primary wide">Save partner interest</button></form>:<p>{panel==='Contact & Support'?`Email: ${CONTACT.email}  ·  Phone: ${CONTACT.phone}  ·  Support hours: ${CONTACT.hours}`:panel==='About PetMeta'?'PetMeta connects pet owners and sellers with products and pet-care providers.':panel==='Disclaimer'?'PetMeta acts as a marketplace intermediary. Verify seller listings, provider credentials, availability and pricing directly.': 'This informational page is pending approved launch content. Please do not treat this preview as final policy or contact information.'}</p>}{message&&<p role="status">{message}</p>}</section></div>}
 </>;
}
