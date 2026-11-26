'use client';

import {useEffect, useRef, useState} from 'react';
import {ArrowRight, CalendarDays, X} from 'lucide-react';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import CategoryIcon from './CategoryIcon';
import catalogue from '@/lib/home-discovery.json';
import TrainingDetails, {TrainingRequests} from './TrainingDetails';

const species = ['Dog','Cat','Rabbit','Tortoise','Fish','Bird'];
// Pets row, in the order shown in the design. `photo` is cropped from the design; rabbit has no design photo yet, so it uses the cutout.
const petCards = [
  {label:'Puppy',slug:'dog',photo:'/home/pet-dog.webp'},
  {label:'Kitten',slug:'cat',photo:'/home/pet-cat.webp'},
  {label:'Rabbit',slug:'rabbit',photo:'/pet-hero/md/rabbit.webp',cutout:true},
  {label:'Parrot',slug:'bird',photo:'/home/pet-bird.webp'},
  {label:'Fish',slug:'fish',photo:'/home/pet-fish.webp'},
  {label:'Turtle',slug:'tortoise',photo:'/home/pet-tortoise.webp'},
];
const services = ['Hospitals','Food','Accessories','Grooming','Adoption','Training','Acquire','More'];
type Program = typeof catalogue.training[number];
export default function HomeDiscovery({onSelect,onListings}:{onSelect:(category:string)=>void;onListings:(kind:string)=>void}) {
  const router=useRouter();
  
  const [training,setTraining] = useState(false);
  const [trainingAnimal,setTrainingAnimal] = useState('Dog');
  const [program,setProgram] = useState<Program|null>(null);
  const [requests,setRequests] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(()=>{const select=(event:Event)=>{const name=(event as CustomEvent<string>).detail;if(species.includes(name))router.push(`/pets/${name.toLowerCase()}`);};window.addEventListener('pm-browse-animal',select);return()=>window.removeEventListener('pm-browse-animal',select);},[router]);
  useEffect(()=>{const open=(event:Event)=>{const selected=catalogue.training.find(item=>item.id===(event as CustomEvent<string>).detail);if(selected){setRequests(false);setProgram(selected);setTraining(true);}};window.addEventListener('pm-open-training',open);return()=>window.removeEventListener('pm-open-training',open);},[]);
  useEffect(() => {
    const node = dialog.current;
    if ((training) && !node?.open) node?.showModal();
    else if (!training && node?.open) node.close();
    if (node?.open) {node.scrollTop=0; node.querySelector<HTMLButtonElement>('button')?.focus();}
  },[training,program,requests]);

  function close() {setTraining(false); setProgram(null); setRequests(false);}
  function service(index:number) {
    if (index === 5) {setProgram(null); setRequests(false); setTraining(true); return;}
    if (index === 7) {document.getElementById('pet-zone')?.scrollIntoView({behavior:'smooth'}); return;}
    if (index === 4 || index === 6) {onListings(index===4?'Adoption':'Sale'); return;}
    onSelect(['vet','food','accessories','grooming'][index]);
  }

  return <div className="home-discovery">
    <section className="discovery-section" id="pet-zone" aria-labelledby="pet-zone-title">
      <div className="discovery-heading"><div><span>EVERY LITTLE NEED, IN ONE PLACE</span><h2 id="pet-zone-title">Pet <b>Zone</b></h2><p>Explore our wide range of pet care services</p></div><a href="#pet-zone-services" aria-label="Browse all Pet Zone services">Explore services <ArrowRight size={19}/></a></div>
      <div className="discovery-grid" id="pet-zone-services" aria-label="Pet Zone services">{services.map((name,index)=><button className="discovery-category" type="button" key={name} onClick={()=>service(index)} ><span className="discovery-icon pet-zone-icon"><img src={'/home/zone-'+name.toLowerCase()+'.webp'} width={120} height={110} loading="lazy" alt={name+' illustration'}/></span><span>{name}</span></button>)}</div>
    </section>
    <section className="discovery-section" id="pets-discovery" aria-labelledby="pets-discovery-title">
      <div className="discovery-heading"><div><span>FIND YOUR KIND OF COMPANY</span><h2 id="pets-discovery-title">Pe<b>ts</b></h2></div><Link href="/pets" aria-label="See all pet categories">See all <ArrowRight size={19}/></Link></div>
      <div className="discovery-grid" aria-label="Pet categories">{petCards.map(card=><Link className="discovery-category pet-photo-card" href={`/pets/${card.slug}`} key={card.slug}><span className={'pet-photo'+(card.cutout?' is-cutout':'')}><img src={card.photo} width={177} height={170} loading="lazy" alt=""/></span><span className="pet-photo-label">{card.label}<i aria-hidden="true"><ArrowRight size={18}/></i></span></Link>)}</div>
    </section>

    <dialog className={`discovery-dialog${training?' discovery-training-screen':''}`} ref={dialog} onClose={close} onClick={event=>{if(event.target===event.currentTarget){const rect=event.currentTarget.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)close();}}} aria-label="Pet Training">
      <button type="button" className="discovery-dialog-close" aria-label="Close details" onClick={close}><X size={22}/></button>

      {training&&!program&&!requests&&<div className="discovery-training"><span className="discovery-eyebrow">HAPPIER PETS. BETTER BONDS.</span><div className="training-list-heading"><h2>Pet Training</h2><button onClick={()=>setRequests(true)}><CalendarDays size={17}/> My training requests</button></div><p>Explore positive training and enrichment routines for every pet.</p><div className="discovery-training-tabs" aria-label="Choose training animal">{species.map((name,index)=><button type="button" key={name} aria-pressed={trainingAnimal===name} onClick={()=>setTrainingAnimal(name)}><CategoryIcon index={index} animal/>{name}</button>)}</div><h3>Training programs for {trainingAnimal}</h3><p className="discovery-sample">Sample programs · Trainer availability is not connected</p><div className="discovery-program-grid">{catalogue.training.filter(item=>item.species===trainingAnimal).map(item=><article key={item.id}><button className="training-program-photo" aria-label={`View ${item.name} details`} onClick={()=>setProgram(item)}><img src={item.image} alt={`${item.species}: ${item.name}`} loading="lazy" width="400" height="300"/></button><div><h4>{item.name}</h4><p>{item.weeks} weeks · Sample program</p><b>₹{item.price.toLocaleString('en-IN')}</b><button className="discovery-primary" onClick={()=>setProgram(item)}>View details <ArrowRight size={16}/></button></div></article>)}</div></div>}
      {training&&program&&<TrainingDetails key={program.id} program={program} onBack={()=>setProgram(null)} onViewCart={()=>{close();requestAnimationFrame(()=>window.dispatchEvent(new Event('pm-open-cart')));}}/>}
      {training&&requests&&!program&&<TrainingRequests onBack={()=>setRequests(false)} onProgram={id=>{setRequests(false);setProgram(catalogue.training.find(item=>item.id===id)||null);}}/>}
    </dialog>
  </div>;
}
