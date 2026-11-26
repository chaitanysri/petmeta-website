import {auth,db} from './firebase';
import {callBusiness} from './business/client';
import {collection,getDocs} from 'firebase/firestore';
import type {ProductDetailItem} from '@/components/ProductDetails';

export type LiveProduct=ProductDetailItem&{businessId:string;branchId:string;productId:string;stock:number;seller:string;images:string[];specifications:Record<string,string>;live:true};
export type CartProduct=ProductDetailItem&{stock:number;seller:string;branchId?:string};
export type LiveOrder={id:string;businessId:string;businessName:string;createdAt:string;status:string;fields:Record<string,string>;items:{productId:string;name:string;quantity:number;price:number;image?:string}[];amount:number;timeline?:{status:string;at:string}[]};
export type SavedAddress={id:string;label:'Home'|'Work'|'Other';name:string;phone:string;house:string;street:string;landmark:string;city:string;state:string;pin:string;isDefault:boolean};

export async function loadLiveProducts():Promise<LiveProduct[]>{
 const directory=await getDocs(collection(db,'publicBusinesses'));
 const rows=await Promise.all(directory.docs.filter(b=>!b.data().closed).map(async business=>{
  try{const products=await getDocs(collection(db,'publicBusinesses',business.id,'publicProducts'));
   return products.docs.map(d=>({id:d.id,...d.data()})).filter((p:any)=>p.status==='Published').map((p:any)=>{
    const f=p.fields||{},images=(p.photos||[]).map((m:{url?:string})=>m.url).filter(Boolean);
    const species=String(f['Pet type']||f.Species||'All');const kind=String(f.Category||'products').toLowerCase();
    return {id:`${business.id}:${p.id}`,productId:p.id,businessId:business.id,branchId:p.branchId,name:p.name,category:kind,species,price:Number(f['Selling price (₹)']||0),mrp:Number(f['MRP (₹)']||0)||undefined,brand:f.Brand||'',image:images[0],images,description:f.Description||f['Product description']||p.name,stock:Number(p.sellable||0),seller:business.data().name,specifications:f,live:true} as LiveProduct;
   });}catch{return [] as LiveProduct[];}
 }));return rows.flat().filter(p=>p.price>0);
}
export async function loadLiveOrders():Promise<LiveOrder[]>{
 if(!auth.currentUser)return [];
 const links=await getDocs(collection(db,'customerBusinesses',auth.currentUser.uid,'businesses'));
 const rows=await Promise.all(links.docs.map(async link=>{try{
  const [activity,catalog]=await Promise.all([callBusiness<{orders:any[]}>('customer.activity',{},link.id),callBusiness<{business:{name:string},products:any[]}>('customer.catalog',{},link.id)]);
  return activity.orders.map(o=>({...o,businessId:link.id,businessName:catalog.business.name,items:(o.items||[]).map((item:any)=>({...item,image:catalog.products.find(p=>p.id===item.productId)?.photos?.[0]?.url}))})) as LiveOrder[];
 }catch{return [] as LiveOrder[];}}));return rows.flat().sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
export function addressText(a:SavedAddress){return [a.house,a.street,a.landmark,a.city,a.state,a.pin].filter(Boolean).join(', ');}
