'use client';
import {useState,useEffect} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ArrowLeft,ArrowRight,ChevronLeft,ChevronRight,Heart,Info,Maximize2,PawPrint,MapPin,ShoppingBag,UserRound} from 'lucide-react';
import {AUTH_LOGO_SRC} from '@/lib/auth-logo';
import type {PetProfile} from '@/lib/pet-catalog';

export default function PetDetailView({pet}:{pet:PetProfile}){
 const router=useRouter();
 const [active,setActive]=useState(0),[saved,setSaved]=useState(false),[zoom,setZoom]=useState(false);
 // The supplied catalog has one illustration per profile; never invent extra gallery photos.
 const gallery=[pet.image];
 useEffect(()=>{try{const ids=JSON.parse(localStorage.getItem('pm-market-saved')||'[]');setSaved(Array.isArray(ids)&&ids.includes(pet.id));}catch{}},[pet.id]);
 function toggleSave(){try{const ids=JSON.parse(localStorage.getItem('pm-market-saved')||'[]');const current=Array.isArray(ids)?ids:[];const next=saved?current.filter((id:string)=>id!==pet.id):[...current,pet.id];localStorage.setItem('pm-market-saved',JSON.stringify(next));setSaved(!saved);window.dispatchEvent(new Event('pm-store-change'));}catch{}}
 return <div className="pet-reference-page">
   <main className="pet-reference-main"><Link href={`/pets/${pet.species.toLowerCase()}`} className="pet-reference-back"><ArrowLeft size={20}/> Back to {pet.species}s</Link>
   <div className="pet-reference-columns"><div className="pet-reference-media"><div className="pet-reference-hero"><span className="pet-reference-chip"><PawPrint size={18}/>{pet.species}</span><img src={gallery[active]} alt={`${pet.name} profile portrait`} /><button type="button" className="pet-reference-expand" onClick={()=>setZoom(true)} aria-label="Enlarge pet photo"><Maximize2 size={21}/></button></div><div className="pet-reference-thumbs"><button disabled={gallery.length===1} onClick={()=>setActive((active+gallery.length-1)%gallery.length)} aria-label="Previous image"><ChevronLeft/></button>{gallery.map((src,i)=><button key={src} className={i===active?'is-current':''} onClick={()=>setActive(i)} aria-label={`Show image ${i+1}`} aria-pressed={active===i}><img src={src} alt=""/></button>)}<button disabled={gallery.length===1} onClick={()=>setActive((active+1)%gallery.length)} aria-label="Next image"><ChevronRight/></button></div><div className="pet-reference-editorial"><span><PawPrint size={30}/></span><div><small>THE PETMETA EDIT</small><strong>A little companion. A lot of love.</strong></div></div></div>
   <section className="pet-reference-info"><p className="pet-reference-eyebrow">PETMETA PET COLLECTION <span>—</span></p><h1>{pet.name}</h1><div className="pet-reference-meta"><span><PawPrint size={18}/> {pet.species}</span><i/> <span>{pet.breed}</span></div><p className="pet-reference-description">Discover the {pet.name}, featured in the PetMeta pet collection. Explore the profile and browse more pets through PetMeta.</p><div className="pet-reference-price"><small>Illustrative price</small><strong>₹{pet.price.toLocaleString('en-IN')}</strong><p>Example price only. This is not a live seller listing.</p></div><div className="pet-reference-facts"><div><PawPrint/><b>Breed</b><span>{pet.breed}</span></div><div><Info/><b>Age</b><span>Not specified</span></div><div><Info/><b>Gender</b><span>Not specified</span></div><div><Info/><b>Vaccination</b><span>Not specified</span></div></div><div className="pet-reference-actions"><button type="button" onClick={()=>router.push('/pets')}><PawPrint size={20}/> Browse pets <ArrowRight size={18}/></button><button type="button" onClick={toggleSave}><Heart size={20} fill={saved?'#ff9b25':'none'}/>{saved?'Saved to Wishlist':'Add to Wishlist'}</button></div><p className="pet-reference-disclaimer"><Info size={18}/> This is an illustrative breed profile; a seller, price, vaccination record, pedigree or availability has not been verified.</p></section></div></main>
   {zoom&&<div className="pet-reference-lightbox" role="dialog" aria-modal="true" aria-label="Expanded pet photo" onClick={()=>setZoom(false)}><button onClick={()=>setZoom(false)} aria-label="Close enlarged image">✕</button><img src={pet.image} alt={pet.name}/></div>}
 </div>;
}
