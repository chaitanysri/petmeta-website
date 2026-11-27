'use client';
import {useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {CalendarDays,Check,Heart,SlidersHorizontal,ShoppingCart,Search,X} from 'lucide-react';
import SitePage from './SitePage';
import PointImage from './PointImage';
import BombDeals from './BombDeals';
import {tilePosition} from './BreedCollections';
import {storeProducts} from '@/lib/store-catalog';
import {useDeals} from '@/lib/bomb-deals';
import {shopMenus} from '@/lib/shop-menu';
import {categoryConfig,CATEGORY_PRODUCTS,CATEGORY_SLUGS,SERVICE_PAGES,type CategorySlug} from '@/lib/category-pages';

type Sort='featured'|'low'|'high'|'discount'|'name';
const money=(n:number)=>'₹'+Math.round(n).toLocaleString('en-IN');
const PRICE_BUCKETS=[{id:'a',label:'Under ₹300',min:0,max:300},{id:'b',label:'₹300 – ₹600',min:300,max:600},{id:'c',label:'₹600 – ₹1,000',min:600,max:1000},{id:'d',label:'Over ₹1,000',min:1000,max:Infinity}];
const DISCOUNTS=[{id:25,label:'25% off or more'},{id:40,label:'40% off or more'},{id:50,label:'50% off or more'}];
const inRule=(slug:CategorySlug,p:{id:string;category:string})=>{const r=CATEGORY_PRODUCTS[slug];return !!(r.ids?.includes(p.id)||r.categories?.includes(p.category))};

/** One listing page for a navigation item: Food, Accessories, Grooming, Veterinary, Toys, Health & Wellness, Offers. */
export default function CategoryPage({slug}:{slug:CategorySlug}){
  const params=useSearchParams();
  const cfg=useMemo(()=>categoryConfig(slug),[slug]);
  const service=SERVICE_PAGES[slug];
  const {price:dealPrice}=useDeals();
  const [query,setQuery]=useState(params.get('search')||''),[saved,setSaved]=useState<string[]>([]),[notice,setNotice]=useState('');
  const [sort,setSort]=useState<Sort>('featured'),[species,setSpecies]=useState('All'),[bucket,setBucket]=useState(''),[minOff,setMinOff]=useState(0),[brands,setBrands]=useState<string[]>([]),[sub,setSub]=useState(-1),[filtersOpen,setFiltersOpen]=useState(false);
  const [toast,setToast]=useState<{ok:boolean;text:string}|null>(null);

  useEffect(()=>{
    const load=()=>{try{setSaved(JSON.parse(localStorage.getItem('pm-market-saved')||'[]'))}catch{}};
    load();window.addEventListener('pm-store-change',load);return()=>window.removeEventListener('pm-store-change',load);
  },[]);
  useEffect(()=>{setQuery(params.get('search')||'');setSpecies('All');setBucket('');setMinOff(0);setBrands([]);setSub(-1);setSort('featured')},[params,slug]);
  useEffect(()=>{window.scrollTo({top:0})},[slug]);
  useEffect(()=>{
    const product=params.get('product'),section=params.get('section');
    const timer=setTimeout(()=>{
      if(product)window.dispatchEvent(new CustomEvent('pm-open-product',{detail:product}));
      if(section)document.querySelector('.'+CSS.escape(section))?.scrollIntoView({behavior:'smooth',block:'start'});
    },product?500:250);
    return()=>clearTimeout(timer);
  },[params,slug]);
  useEffect(()=>{
    const onResult=(e:Event)=>{const d=(e as CustomEvent).detail;setToast({ok:!!d?.ok,text:d?.ok?'Added to your cart':(d?.message||'This item could not be added.')})};
    window.addEventListener('pm-cart-result',onResult);return()=>window.removeEventListener('pm-cart-result',onResult);
  },[]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(null),4500);return()=>clearTimeout(t)},[toast]);

  /* every product that belongs on this page, with today's deal price */
  const all=useMemo(()=>storeProducts.filter(p=>inRule(slug,p)).map(p=>({...p,orig:p.price})),[slug]);
  const items=all.map(p=>({...p,price:dealPrice(p.id,p.orig)}));
  const off=(p:{price:number;mrp:number})=>Math.round((1-p.price/p.mrp)*100);

  /* "Shop by type" tiles come from the dropdown groups that point at products */
  const tiles=cfg.points.map((pt,i)=>({i,title:pt.title,ids:pt.links.flatMap(l=>l.action.type==='product'?[l.action.productId]:[])})).filter(t=>t.ids.some(id=>all.some(p=>p.id===id)));

  const speciesList=[...new Set(all.map(p=>p.species).filter(s=>s!=='All'))];
  const brandList=[...new Set(all.map(p=>p.brand))].sort();
  const q=query.trim().toLowerCase();
  const shown=items
    .filter(p=>!q||`${p.name} ${p.description} ${p.brand} ${p.species}`.toLowerCase().includes(q))
    .filter(p=>species==='All'||p.species===species||p.species==='All')
    .filter(p=>{const b=PRICE_BUCKETS.find(x=>x.id===bucket);return !b||(p.price>=b.min&&p.price<b.max)})
    .filter(p=>off(p)>=minOff)
    .filter(p=>!brands.length||brands.includes(p.brand))
    .filter(p=>sub<0||(tiles.find(t=>t.i===sub)?.ids.includes(p.id)??true))
    .sort((a,b)=>sort==='low'?a.price-b.price:sort==='high'?b.price-a.price:sort==='discount'?off(b)-off(a):sort==='name'?a.name.localeCompare(b.name):0);

  const activeFilters=[
    species!=='All'&&{k:'species',label:`For ${species.toLowerCase()}s`,clear:()=>setSpecies('All')},
    bucket&&{k:'price',label:PRICE_BUCKETS.find(b=>b.id===bucket)!.label,clear:()=>setBucket('')},
    minOff>0&&{k:'off',label:`${minOff}% off or more`,clear:()=>setMinOff(0)},
    ...brands.map(b=>({k:'brand'+b,label:b,clear:()=>setBrands(brands.filter(x=>x!==b))})),
    sub>=0&&{k:'sub',label:tiles.find(t=>t.i===sub)?.title||'',clear:()=>setSub(-1)},
    q&&{k:'q',label:`“${query}”`,clear:()=>setQuery('')},
  ].filter(Boolean) as {k:string;label:string;clear:()=>void}[];
  const clearAll=()=>{setSpecies('All');setBucket('');setMinOff(0);setBrands([]);setSub(-1);setQuery('')};

  const open=(id:string)=>window.dispatchEvent(new CustomEvent('pm-open-product',{detail:id}));
  const add=(id:string)=>window.dispatchEvent(new CustomEvent('pm-add-to-cart',{detail:id}));
  const favourite=(id:string)=>{
    try{const next=saved.includes(id)?saved.filter(x=>x!==id):[...saved,id];localStorage.setItem('pm-market-saved',JSON.stringify(next));setSaved(next);window.dispatchEvent(new Event('pm-store-change'))}
    catch{setNotice('Could not save favourites. Check browser storage and try again.')}
  };
  const countFor=(s:CategorySlug)=>storeProducts.filter(p=>inRule(s,p)).length;
  const label=(s:string)=>shopMenus.find(m=>m.id===s)?.label||s;

  return <SitePage>
    <main className={`delivery-home pm-cat-page az-list pm-cat-${slug}`} id={`category-${slug}`}>
      <nav className="pm-cat-breadcrumb" aria-label="Breadcrumb"><Link href="/home">Home</Link><span>›</span><span aria-current="page">{cfg.label}</span></nav>

      <section className="az-list-banner">
        <div><span className="az-list-eyebrow">{cfg.eyebrow}</span><h1>{cfg.heading}</h1><p>{cfg.description}</p>
          {service&&<Link className="az-list-book" href={service.href}><CalendarDays size={17}/> {service.label}</Link>}</div>
        <PointImage className="az-list-banner-img" name={`${slug}-0`} width={800} height={500} eager/>
      </section>

      {slug==='offers'&&<div className="pm-cat-offers-block az-list-deals"><BombDeals onNotice={setNotice}/></div>}

      {tiles.length>1&&<section className="az-list-tiles" aria-label={`Shop ${cfg.label} by type`}>
        <h2>Shop by type</h2>
        <div role="group" className="az-list-tilerow">
          <button type="button" aria-pressed={sub<0} onClick={()=>setSub(-1)}><span className="all">All</span>All {cfg.label.toLowerCase()}</button>
          {tiles.map(t=><button type="button" key={t.i} aria-pressed={sub===t.i} onClick={()=>setSub(sub===t.i?-1:t.i)}><PointImage name={`${slug}-${t.i}`} alt="" width={160} height={100}/>{t.title}</button>)}
        </div>
      </section>}

      <div className="az-list-layout" id="pm-cat-products">
        <aside className={`az-list-filters${filtersOpen?' is-open':''}`} aria-label="Filters">
          <div className="az-list-filters-head"><b>Filters</b><button type="button" aria-label="Close filters" onClick={()=>setFiltersOpen(false)}><X size={18}/></button></div>
          <div className="az-list-group"><h3>Shop by department</h3>
            <ul>{CATEGORY_SLUGS.map(s=><li key={s}>{s===slug?<b>{label(s)} <small>({countFor(s)})</small></b>:<Link href={`/${s}`}>{label(s)} <small>({countFor(s)})</small></Link>}</li>)}<li><Link href="/pets">All pets <small>(breeds)</small></Link></li></ul></div>
          {speciesList.length>0&&<div className="az-list-group"><h3>Pet type</h3>
            <ul>{['All',...speciesList].map(s=><li key={s}><label><input type="radio" name="species" checked={species===s} onChange={()=>setSpecies(s)}/>{s==='All'?'All pets':s+'s'}</label></li>)}</ul></div>}
          <div className="az-list-group"><h3>Price</h3>
            <ul><li><label><input type="radio" name="price" checked={!bucket} onChange={()=>setBucket('')}/>Any price</label></li>
              {PRICE_BUCKETS.filter(b=>items.some(p=>p.price>=b.min&&p.price<b.max)).map(b=><li key={b.id}><label><input type="radio" name="price" checked={bucket===b.id} onChange={()=>setBucket(b.id)}/>{b.label}</label></li>)}</ul></div>
          <div className="az-list-group"><h3>Discount</h3>
            <ul><li><label><input type="radio" name="off" checked={minOff===0} onChange={()=>setMinOff(0)}/>Any discount</label></li>
              {DISCOUNTS.filter(d=>items.some(p=>off(p)>=d.id)).map(d=><li key={d.id}><label><input type="radio" name="off" checked={minOff===d.id} onChange={()=>setMinOff(d.id)}/>{d.label}</label></li>)}</ul></div>
          {brandList.length>1&&<div className="az-list-group"><h3>Brand</h3>
            <ul>{brandList.map(b=><li key={b}><label><input type="checkbox" checked={brands.includes(b)} onChange={()=>setBrands(brands.includes(b)?brands.filter(x=>x!==b):[...brands,b])}/>{b}</label></li>)}</ul></div>}
          {activeFilters.length>0&&<button type="button" className="az-list-clear" onClick={clearAll}>Clear all filters</button>}
          <button type="button" className="az-list-apply" onClick={()=>setFiltersOpen(false)}>Show {shown.length} result{shown.length===1?'':'s'}</button>
        </aside>

        <section className="az-list-results" aria-label={`${cfg.label} products`}>
          <div className="az-list-toolbar">
            <p className="az-list-count" role="status"><b>{shown.length}</b> {shown.length===1?'result':'results'} in {cfg.label}</p>
            <button type="button" className="az-list-filter-btn" onClick={()=>setFiltersOpen(true)}><SlidersHorizontal size={16}/> Filters{activeFilters.length?` (${activeFilters.length})`:''}</button>
            <label className="az-list-search"><Search size={16}/><input aria-label={`Search ${cfg.label}`} placeholder={`Search ${cfg.label.toLowerCase()}…`} value={query} onChange={e=>setQuery(e.target.value)}/>{query&&<button type="button" aria-label="Clear search" onClick={()=>setQuery('')}><X size={14}/></button>}</label>
            <label className="az-list-sort">Sort by <select value={sort} onChange={e=>setSort(e.target.value as Sort)}>
              <option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="discount">Biggest discount</option><option value="name">Name: A to Z</option></select></label>
          </div>
          {activeFilters.length>0&&<div className="az-list-chips">{activeFilters.map(f=><button type="button" key={f.k} onClick={f.clear}>{f.label} <X size={13}/></button>)}<button type="button" className="clear" onClick={clearAll}>Clear all</button></div>}
          {notice&&<p className="pm-cat-notice" role="status">{notice}</p>}

          <div className="az-list-grid">
            {shown.map(p=>{const deal=p.price<p.orig;return <article className="az-list-card" key={p.id}>
              <button type="button" className="az-list-photo" aria-label={`View ${p.name} details`} onClick={()=>open(p.id)}>
                <span className="product-photo" style={{backgroundPosition:tilePosition(p.tile)}} role="img" aria-label={p.name}/>
                {deal&&<b className="az-list-deal">Bomb Deal</b>}
              </button>
              <button className="az-list-heart" aria-label={`Wishlist ${p.name}`} aria-pressed={saved.includes(p.id)} onClick={()=>favourite(p.id)}><Heart size={18} fill={saved.includes(p.id)?'#ff7408':'none'}/></button>
              <div className="az-list-info">
                <small>{p.brand} · {p.species==='All'?'All pets':p.species}</small>
                <h3><button type="button" onClick={()=>open(p.id)}>{p.name}</button></h3>
                <p className="az-list-desc">{p.description.replace(/^Sample product · /,'')}</p>
                <div className="az-list-price"><b>{money(p.price)}</b><del>{money(p.mrp)}</del><em>{off(p)}% off</em></div>
                <div className="az-list-actions"><button type="button" className="cart" onClick={()=>add(p.id)}><ShoppingCart size={16}/> Add to cart</button><button type="button" className="view" onClick={()=>open(p.id)}>View details</button></div>
              </div>
            </article>})}
          </div>
          {!shown.length&&<div className="az-list-empty"><h3>No products match your filters</h3><p>Try removing a filter or searching for something else.</p><button type="button" onClick={clearAll}>Clear all filters</button></div>}
        </section>
      </div>
      {toast&&<div className={`az-list-toast${toast.ok?'':' bad'}`} role="status">{toast.ok&&<Check size={17}/>}<span>{toast.text}</span>{toast.ok&&<button type="button" onClick={()=>{window.dispatchEvent(new Event('pm-open-cart'));setToast(null)}}>Go to cart</button>}<button type="button" aria-label="Dismiss" onClick={()=>setToast(null)}><X size={15}/></button></div>}
    </main>
  </SitePage>;
}
