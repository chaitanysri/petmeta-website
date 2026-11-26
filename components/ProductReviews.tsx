'use client';
import {useEffect,useState} from 'react';
import {collection,getDocs,query,where} from 'firebase/firestore';
import {getStorage,ref,uploadBytes} from 'firebase/storage';
import {auth,db} from '@/lib/firebase';
import {callBusiness} from '@/lib/business/client';

type Review={id:string;rating:number;text:string;displayName:string;createdAt:string;images:string[]};
export function ProductReviews({businessId,productId}:{businessId:string;productId:string}){
 const [reviews,setReviews]=useState<Review[]>([]),[error,setError]=useState('');
 useEffect(()=>{let active=true;getDocs(query(collection(db,'publicBusinesses',businessId,'publicReviews'),where('productId','==',productId),where('status','==','Approved'))).then(s=>{if(active)setReviews(s.docs.map(d=>({id:d.id,...d.data()} as Review)).sort((a,b)=>b.createdAt.localeCompare(a.createdAt)))}).catch(e=>{if(active)setError(e.message)});return()=>{active=false}},[businessId,productId]);
 const average=reviews.length?reviews.reduce((n,r)=>n+r.rating,0)/reviews.length:0;
 return <section className="commerce-reviews"><h2>Customer reviews</h2>{reviews.length?<><p>★ {average.toFixed(1)} · {reviews.length} verified review{reviews.length===1?'':'s'}</p>{reviews.map(r=><article key={r.id}><b>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</b> <span>{r.displayName} · {new Date(r.createdAt).toLocaleDateString()}</span><p>{r.text}</p><div className="commerce-review-images">{r.images?.map(url=><img src={url} alt="Customer review" key={url}/>)}</div></article>)}</>:<p>No verified reviews yet.</p>}{error&&<p role="alert">Reviews are unavailable: {error}</p>}</section>;
}
export function ReviewForm({businessId,orderId,productId,onDone}:{businessId:string;orderId:string;productId:string;onDone:()=>void}){
 const [rating,setRating]=useState(0),[body,setBody]=useState(''),[photos,setPhotos]=useState<File[]>([]),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e:React.FormEvent){e.preventDefault();if(!auth.currentUser){setError('Sign in to review your purchase.');return}if(rating<1||body.trim().length<10){setError('Choose stars and write at least 10 characters.');return}setBusy(true);setError('');try{
  const uploaded=[];for(const file of photos){if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>4*1024*1024)throw Error('Choose JPG, PNG or WebP images under 4 MB.');const path=`reviews/${businessId}/${orderId}/${productId}/${auth.currentUser.uid}/${crypto.randomUUID()}`;await uploadBytes(ref(getStorage(auth.app,'gs://petmeta-e8470.firebasestorage.app'),path),file,{contentType:file.type});uploaded.push({path});}
  await callBusiness('customer.review.submit',{orderId,productId,rating,text:body.trim(),images:uploaded},businessId);onDone();
 }catch(e){setError((e as Error).message)}finally{setBusy(false)}}
 return <form className="commerce-review-form" onSubmit={submit}><h3>Rate your purchase</h3><div role="group" aria-label="Star rating">{[1,2,3,4,5].map(n=><button key={n} type="button" aria-label={`${n} star${n===1?'':'s'}`} aria-pressed={rating===n} onClick={()=>setRating(n)}>{n<=rating?'★':'☆'}</button>)}</div><label>Your review<textarea required minLength={10} maxLength={2000} value={body} onChange={e=>setBody(e.target.value)}/></label><label>Add up to three photos<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e=>setPhotos(Array.from(e.target.files||[]).slice(0,3))}/></label>{photos.length>0&&<p>{photos.map(f=>f.name).join(', ')}</p>}{error&&<p role="alert">{error}</p>}<button className="market-primary" disabled={busy}>{busy?'Submitting…':'Submit review'}</button></form>;
}
