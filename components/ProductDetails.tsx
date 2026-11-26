'use client';

import {useEffect, useRef, useState, type ReactNode} from 'react';
import {ArrowLeft, ArrowRight, Bomb, Check, ChevronDown, ChevronLeft, ChevronRight, Heart, Layers, Lock, Minus, Package, PawPrint, Plus, ShoppingCart, Star, Tag, X} from 'lucide-react';
import {ensureDeals,saveDeals,useDeals} from '@/lib/bomb-deals';
import {ProductReviews} from './ProductReviews';
import SiteHeader from './SiteHeader';
import {ShopFooter} from './ShopFront';

export type ProductDetailItem = {id:string;name:string;category:string;species:string;price:number;mrp?:number;brand?:string;tile?:number;image?:string;images?:string[];icon?:string;description:string;breed?:string;age?:string;city?:string;contact?:string;local?:boolean;kind?:string;published?:boolean;owner?:string;live?:boolean;stock?:number;seller?:string;businessId?:string;productId?:string;specifications?:Record<string,string>};
type Props = {product:ProductDetailItem;price:number;coupon:boolean;onCouponChange:(value:boolean)=>void;saved:boolean;onSave:()=>void;onClose:()=>void;onAdd:(amount:number)=>boolean;onBuy:(amount:number)=>boolean;onViewCart:()=>void;petActions?:ReactNode;message?:string;related?:ProductDetailItem[];onSelectRelated?:(item:ProductDetailItem)=>void;onAddRelated?:(id:string)=>boolean};

export default function ProductDetails({product:p,price,coupon,onCouponChange,saved,onSave,onClose,onAdd,onBuy,onViewCart,petActions,message,related=[],onSelectRelated,onAddRelated}:Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [amount,setAmount] = useState(1);
  const [offers,setOffers] = useState(true);
  const [added,setAdded] = useState(false);
  const [tab,setTab]=useState('overview');
  const [zoom,setZoom] = useState(false);
  const [activeImage,setActiveImage]=useState(0);
  const rail1=useRef<HTMLDivElement>(null);
  const [addedRelated,setAddedRelated]=useState<string[]>([]);
  const pet = p.category === 'pets';
  const {campaign,now}=useDeals();
  const inDeals=!p.live&&!pet&&!!campaign&&now<campaign.endsAt&&campaign.ids.includes(p.id);
  const dealActive=inDeals&&!!campaign?.revealed.includes(p.id)&&price<p.price;
  const seconds=campaign?Math.max(0,Math.ceil((campaign.endsAt-now)/1000)):0;
  const clock=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
  const outOfStock=p.live?Number(p.stock||0)<1:pet&&p.species==='Tortoise';
  const purchasable = !pet && !outOfStock && price>0;
  const mrp = p.mrp || p.price;
  const saving = Math.max(0,mrp-price);
  const subtotal = price*amount;
  const discount = 0;
  const payable = subtotal-discount;
  const currency = (value:number) => `₹${value.toLocaleString('en-IN')}`;

  useEffect(()=>{const node=dialog.current;if(node&&!node.open)node.showModal();},[]);

  function close(){dialog.current?.close();}
  function unlock(){const current=ensureDeals();if(current.ids.includes(p.id)&&!current.revealed.includes(p.id))saveDeals({...current,revealed:[...current.revealed,p.id]});}

  function photo(className='') {
    const current=p.images?.[activeImage]||p.image;
    return current ? <img className={className} src={current} alt={p.name} width="800" height="800" style={{objectFit:'contain'}} onError={event=>{event.currentTarget.style.display='none'}}/> : p.tile!=null ? <div className={`pd-atlas ${className}`} role="img" aria-label={p.name} style={{backgroundImage:`url('${pet?'/breed-poses-v2.png':'/product-atlas.png'}')`,backgroundPosition:`${p.tile%4*100/3}% ${Math.floor(p.tile/4)*100/3}%`}}/> : <div className={`pd-placeholder ${className}`} role="img" aria-label={p.name}>{p.icon||<PawPrint size={90}/>}</div>;
  }

  type View={url?:string;z?:number;fx?:number;fy?:number};
  function buildViews():View[]{
    const urls=p.images&&p.images.length?p.images:p.image?[p.image]:[];
    const base:View[]=urls.length?urls.map(url=>({url})):p.tile!=null?[{}]:[];
    if(!base.length)return base;
    const src=urls[0];
    const crops:[number,number,number][]=[[1.6,.5,.5],[2.2,.5,.35],[2.2,.5,.65],[2.2,.35,.5],[2.2,.65,.5]];
    const out=[...base];
    for(const [z,fx,fy] of crops){if(out.length>=5)break;if(!urls.length||urls.length<4)out.push({url:src,z,fx,fy});}
    return out;
  }
  function viewEl(v:View|undefined,className=''){
    if(!v)return <div className={`pd-placeholder ${className}`} role="img" aria-label={p.name}>{p.icon||<PawPrint size={90}/>}</div>;
    if(v.z==null)return v.url?<img className={className} src={v.url} alt={p.name} width="800" height="800" style={{objectFit:'contain'}}/>:<div className={`pd-atlas ${className}`} role="img" aria-label={p.name} style={{backgroundImage:"url('/product-atlas.png')",backgroundPosition:`${(p.tile||0)%4*100/3}% ${Math.floor((p.tile||0)/4)*100/3}%`}}/>;
    const z=v.z,fx=v.fx??.5,fy=v.fy??.5;
    if(v.url)return <div className={`pd-atlas ${className}`} role="img" aria-label={`${p.name} close-up`} style={{backgroundImage:`url('${v.url}')`,backgroundRepeat:'no-repeat',backgroundSize:`${z*100}%`,backgroundPosition:`${(z*fx-.5)/(z-1)*100}% ${(z*fy-.5)/(z-1)*100}%`}}/>;
    const col=(p.tile||0)%4,row=Math.floor((p.tile||0)/4);
    return <div className={`pd-atlas ${className}`} role="img" aria-label={`${p.name} close-up`} style={{backgroundImage:"url('/product-atlas.png')",backgroundRepeat:'no-repeat',backgroundSize:`${400*z}% ${400*z}%`,backgroundPosition:`${(z*(col+fx)-.5)/(4*z-1)*100}% ${(z*(row+fy)-.5)/(4*z-1)*100}%`}}/>;
  }

  function thumb(item:ProductDetailItem){
    return item.image ? <img src={item.image} alt={item.name} loading="lazy"/> : item.tile!=null ? <div className="pd-atlas" role="img" aria-label={item.name} style={{backgroundImage:"url('/product-atlas.png')",backgroundPosition:`${item.tile%4*100/3}% ${Math.floor(item.tile/4)*100/3}%`}}/> : <div className="pd-placeholder" style={{fontSize:56,height:'100%'}}>{item.icon||<PawPrint size={48}/>}</div>;
  }
  function scrollRail(ref:React.RefObject<HTMLDivElement>,dir:number){ref.current?.scrollBy({left:dir*440,behavior:'smooth'});}
  function relatedRow(items:ProductDetailItem[],ref:React.RefObject<HTMLDivElement>,title:string,sub:string){
    if(!items.length)return null;
    return <section className="az-card az-section" aria-label={title}><h2>{title}</h2><p className="az-fine" style={{marginTop:-8,marginBottom:12}}>{sub}</p><div className="az-rail-wrap"><button type="button" className="az-rail-nav l" aria-label="Scroll left" onClick={()=>scrollRail(ref,-1)}><ChevronLeft size={20}/></button><div className="az-rail" ref={ref}>{items.map(item=>{const off=item.mrp&&item.mrp>item.price?Math.round((1-item.price/item.mrp)*100):0;const done=addedRelated.includes(item.id);return <article className="az-item" key={item.id}>
      <button type="button" className="thumb" aria-label={`View ${item.name}`} onClick={()=>onSelectRelated?.(item)}>{thumb(item)}</button>
      <h3><button type="button" style={{all:'unset',cursor:'pointer'}} onClick={()=>onSelectRelated?.(item)}>{item.name}</button></h3>
      <small>{item.brand||'PetMeta'} · {item.species==='All'?'All pets':item.species}</small>
      <div className="row"><b>{currency(item.price)}</b>{item.mrp&&item.mrp>item.price&&<><del>{currency(item.mrp)}</del><em>{off}% off</em></>}</div>
      {onAddRelated&&<button type="button" className="add" onClick={()=>{if(onAddRelated(item.id))setAddedRelated(v=>[...v,item.id]);}}>{done?'Added ✓ Add another':'Add to cart'}</button>}
    </article>;})}</div><button type="button" className="az-rail-nav r" aria-label="Scroll right" onClick={()=>scrollRail(ref,1)}><ChevronRight size={20}/></button></div></section>;
  }

  if(!pet){
    const off=mrp>price?Math.round((1-price/mrp)*100):0;
    const views=buildViews();
    const parts=p.description.split('·').map(x=>x.trim()).filter(x=>x&&!/^sample product$/i.test(x)&&!/^preview offer$/i.test(x));
    const pack=(p.description.match(/\b\d+(?:\.\d+)?\s?(?:kg|g|ml|l|pcs?|pack)\b/i)||[])[0]||'';
    const notes=parts.filter(x=>x!==pack);
    const forWho=p.species==='All'?'All pets':`${p.species}s`;
    const code=`PM-${p.category.slice(0,4).toUpperCase()}-${String(p.id).replace(/[^a-z0-9]/gi,'').slice(0,8).toUpperCase()}`;
    const bullets=[
      p.brand?`Brand: ${p.brand}`:'',
      `Suitable for: ${forWho.toLowerCase()}`,
      `Category: ${p.category}`,
      ...parts,
      p.live?`Sold by ${p.seller}`:'',
    ].filter(Boolean);
    const liveSpecs=p.live?Object.entries(p.specifications||{}).filter(([k])=>!['Description','Selling price (₹)','MRP (₹)'].includes(k)).map(([k,v])=>[k,String(v)] as [string,string]):[];
    const specRows:[string,string][]=[['Product name',p.name],['Brand',p.brand||'PetMeta'],['Category',p.category],['Suitable for',forWho],...(pack?[['Pack size',pack] as [string,string]]:[]),...liveSpecs,['Item code',code],['Availability',outOfStock?'Currently unavailable':'In stock'],['M.R.P.',currency(mrp)],['Price today',currency(price)]];
    const tiles:[typeof Package,string,string][]=[[Package,'Pack size',pack||'Standard pack'],[PawPrint,'Suitable for',forWho],[Tag,'Brand',p.brand||'PetMeta'],[Layers,'Category',p.category.replace(/^./,c=>c.toUpperCase())]];
    const blurb=`${p.name}${p.brand?` by ${p.brand}`:''} is made for ${forWho.toLowerCase()}${pack?` and comes in a ${pack} pack`:''}.${notes.length?` ${notes.map(n=>n.replace(/\.$/,'')).join('. ')}.`:''}`;
    const similarFirst=related.slice(0,10);
    return <dialog className="product-details-screen az-screen" ref={dialog} onClose={onClose} onCancel={event=>{if(zoom){event.preventDefault();setZoom(false);}}} aria-label={`${p.name} product details`}>
      <div className="delivery-home pm-site-chrome" hidden={zoom}><SiteHeader beforeNavigate={close}/></div>
      <div className="az-crumbs" hidden={zoom}><button type="button" onClick={close} aria-label="Back to products"><ArrowLeft size={16}/> Back to results</button><span>PetMeta › {p.category.replace(/^./,c=>c.toUpperCase())} › {p.species==='All'?'All pets':p.species}</span></div>
      {inDeals&&<div className="az-deal-banner" hidden={zoom}><div><Bomb size={26}/><div><b>{dealActive?'BOMB DEAL UNLOCKED':'A SURPRISE PRICE DROP AWAITS'}</b><small>{dealActive?`You save ${currency(p.price-price)} (${Math.round((1-price/p.price)*100)}% off) while this deal lasts`:'One of this window’s 10 surprise picks'}</small></div>{dealActive?<div className="clock"><small>DEAL ENDS IN</small><b aria-label={`Deal ends in ${clock}`}>{clock}</b></div>:<button type="button" onClick={unlock}>Reveal my price <ArrowRight size={14}/></button>}</div></div>}
      <main className="az-main" hidden={zoom}>
        <section className="az-card az-gallery" aria-label="Product images">
          {views.length>1&&<div className="az-thumbs" role="group" aria-label="Choose an image">{views.map((v,index)=><button key={index} type="button" aria-label={`View image ${index+1} of ${views.length}`} aria-pressed={activeImage===index} onClick={()=>setActiveImage(index)} onMouseEnter={()=>setActiveImage(index)}>{viewEl(v)}</button>)}</div>}
          <button className="az-photo" type="button" onClick={()=>setZoom(true)} aria-label={`Enlarge ${p.name} photo`} style={views.length>1?undefined:{gridColumn:'1/-1'}}>{viewEl(views[activeImage])}{dealActive&&<b className="pd-photo-deal"><Bomb size={14}/> BOMB DEAL · {Math.round((1-price/p.price)*100)}% OFF</b>}<span>Click to enlarge <Plus size={14}/></span></button>
        </section>
        <section className="az-card az-info" aria-label="Product information">
          <div className="az-brand">{p.live?`Sold by ${p.seller}`:`Visit the ${p.brand||'PetMeta'} store`}</div>
          <h1>{p.name}</h1>
          <p className="az-rating"><span className="stars" aria-hidden="true">{[0,1,2,3,4].map(i=><Star key={i} size={16}/>)}</span>{p.live?'Verified customer reviews below':'Not yet reviewed'}</p>
          <div className="az-pricebox">
            {dealActive&&<span className="az-badge"><Bomb size={13}/> Limited time Bomb Deal</span>}
            <div className="az-price-row">{off>0&&<span className="az-off">−{off}%</span>}<span className="az-price"><sup>₹</sup>{price.toLocaleString('en-IN')}</span></div>
            {mrp>price&&<div className="az-mrp">M.R.P.: <del>{currency(mrp)}</del></div>}
            {mrp>price&&<div className="az-save">You save {currency(mrp-price)} ({off}%)</div>}
            <div className="az-fine">Delivery charges and taxes, if any, are shown at checkout.</div>
          </div>
          <div className="az-pay"><Lock size={18}/><div><b>Pay your way</b><br/>UPI, cards, net banking and wallets through Razorpay’s secure checkout.</div></div>
          <div className="az-about"><h2>About this item</h2><ul>{bullets.map((b,i)=><li key={i}>{b}</li>)}</ul></div>
        </section>
        <aside className="az-card az-buybox" aria-label="Buy this item">
          <div className="az-price"><sup>₹</sup>{price.toLocaleString('en-IN')}</div>
          {mrp>price&&<div className="az-mrp">M.R.P.: <del>{currency(mrp)}</del> · {off}% off</div>}
          <div className={`az-stock${outOfStock?' out':''}`}>{outOfStock?'Currently unavailable':'In stock'}</div>
          <dl className="az-sold"><dt>Ships from</dt><dd>PetMeta</dd><dt>Sold by</dt><dd>{p.live?p.seller:p.brand||'PetMeta'}</dd><dt>Payment</dt><dd>Secure online payment</dd></dl>
          {purchasable&&<div className="az-qty"><label htmlFor="az-qty-select">Quantity:</label><select id="az-qty-select" value={amount} onChange={e=>setAmount(Number(e.target.value))}>{Array.from({length:Math.min(10,p.live?Number(p.stock||1):10)},(_,i)=>i+1).map(n=><option key={n} value={n}>{n}</option>)}</select></div>}
          {message&&<p className="az-status" role="status">{message}</p>}
          {purchasable?<><button type="button" className="az-btn cart" onClick={()=>{if(onAdd(amount))setAdded(true);}}><ShoppingCart size={18}/> {added?'Add more to cart':'Add to cart'}</button><button type="button" className="az-btn buy" onClick={()=>onBuy(amount)}>Buy now · {currency(payable)}</button></>:<p className="az-status">{outOfStock?'This item is currently unavailable.':'This item is not available to purchase.'}</p>}
          {added&&<p className="az-added" role="status"><Check size={16}/> Added to cart. <button type="button" onClick={onViewCart}>Go to cart</button></p>}
          <div className="az-secure"><Lock size={16}/><span>Secure transaction. Payment is handled by Razorpay.</span></div>
          <button type="button" className="az-btn save" onClick={onSave} aria-pressed={saved}><Heart size={16} fill={saved?'#ff7408':'none'}/> {saved?'Saved to wishlist':'Add to wishlist'}</button>
        </aside>
      </main>
      <div className="az-below" hidden={zoom}>
        {relatedRow(similarFirst,rail1,'Similar products','Items like this one, picked for the same pets and needs.')}
        <section className="az-card az-section az-pinfo" aria-label="Product information"><h2>Product information</h2>
          <div className="az-tiles">{tiles.map(([Icon,label,value])=><div key={label}><span aria-hidden="true"><Icon size={20}/></span><small>{label}</small><b>{value}</b></div>)}</div>
          <div className="az-pcols">
            <div><h3>Technical details</h3><dl className="az-table">{specRows.map(([k,v])=><><dt key={k+'t'}>{k}</dt><dd key={k+'d'}>{v}</dd></>)}</dl></div>
            <div><h3>Product description</h3><p className="az-desc">{blurb}</p>{notes.length>0&&<><h3>Good to know</h3><ul className="az-know">{notes.map((n,i)=><li key={i}><Check size={16}/> {n}</li>)}</ul></>}<div className="az-pay" style={{marginTop:16}}><Lock size={18}/><div><b>Secure checkout</b><br/>Pay with UPI, cards, net banking or wallets. Delivery charges and taxes, if any, are shown before you pay.</div></div></div>
          </div>
        </section>
        {p.live&&p.businessId&&p.productId&&<div className="az-card az-section commerce-product-extras" style={{padding:'0 24px 22px'}}><ProductReviews businessId={p.businessId} productId={p.productId}/></div>}
      </div>
      <div className="delivery-home pm-site-chrome" hidden={zoom}><ShopFooter chrome/></div>
      {zoom&&<div className="pd-zoom" role="region" aria-label="Enlarged product image"><button type="button" autoFocus onClick={()=>setZoom(false)} aria-label="Close enlarged image"><X size={24}/></button>{viewEl(views[activeImage])}</div>}
    </dialog>;
  }

  return <dialog className={`product-details-screen${pet?' pd-pet-screen':''}`} ref={dialog} onClose={onClose} onCancel={event=>{if(zoom){event.preventDefault();setZoom(false);}}} aria-label={`${p.name} product details`}>
    <div className="delivery-home pm-site-chrome" hidden={zoom}><SiteHeader beforeNavigate={close}/></div>
    <div className="pd-backbar" hidden={zoom}><button type="button" onClick={close} aria-label="Back to products"><ArrowLeft size={20}/><span>Back</span></button><button type="button" onClick={onSave} aria-label={saved?'Remove from wishlist':'Save to wishlist'} aria-pressed={saved}><Heart size={19} fill={saved?'#ff7408':'none'}/><span>{saved?'Saved':'Save'}</span></button></div>
    <main className="pd-layout" hidden={zoom}>
      <section className="pd-gallery" aria-label="Product image and information">
        <button className="pd-main-photo" type="button" onClick={()=>setZoom(true)} aria-label={`Enlarge ${p.name} photo`}>{photo()}{dealActive&&<b className="pd-photo-deal"><Bomb size={15}/> BOMB DEAL · {Math.round((1-price/p.price)*100)}% LESS</b>}<span>Explore the details · View full image <Plus size={15}/></span></button>
        {p.images&&p.images.length>1&&<div className="commerce-thumbnails">{p.images.map((url,index)=><button key={url} type="button" aria-label={`View image ${index+1}`} aria-pressed={activeImage===index} onClick={()=>setActiveImage(index)}><img src={url} alt=""/></button>)}</div>}<article className="pd-story"><div className="pd-story-mark"><PawPrint size={27} strokeWidth={1.6}/></div><div><span className="pd-eyebrow">THE PETMETA EDIT</span><h2>{pet?'A little companion. A lot of love.':'Thoughtful picks. Happier little lives.'}</h2><p>{p.species==='All'?'Every pet':p.species} <span>·</span> {pet?'Pet collection':p.category.replace(/^./,s=>s.toUpperCase())}</p></div></article>
        <article className="pd-description"><span className="pd-eyebrow">A CLOSER LOOK</span><h2>About {pet?'this companion':'this product'}</h2><p>{p.description}</p><dl><div><dt>Category</dt><dd>{p.category}</dd></div><div><dt>Pet type</dt><dd>{p.species==='All'?'All pets':p.species}</dd></div>{p.breed&&<div><dt>Breed</dt><dd>{p.breed}</dd></div>}{p.age&&<div><dt>Age</dt><dd>{p.age}</dd></div>}{p.city&&<div><dt>Location</dt><dd>{p.city}</dd></div>}<div><dt>Listing</dt><dd>{p.published?'Seller listing':p.local?'Your saved draft':'Illustrative catalogue'}</dd></div></dl></article>
      </section>
      <section className="pd-summary" aria-label="Product pricing and options">
        <div className="pd-brand">{p.live?`${p.seller} · ${p.category}`:pet?'PetMeta pet collection':`${p.brand||'PetMeta'} · ${p.category}`}</div>
        <h1>{p.name}</h1><p className="pd-subtitle">{p.species==='All'?'For all your little friends':`For ${p.species.toLowerCase()}${p.species==='Fish'?'':'s'}`} {p.breed&&`· ${p.breed}`}</p>
        <p className="pd-review"><Star size={16}/> {p.live?"Verified customer reviews below":"Catalogue preview"}</p>
        {inDeals&&<div className={`pd-deal-strip${dealActive?' is-unlocked':''}`}><span className="pd-deal-symbol"><Bomb size={23}/></span><div><b>{dealActive?'Your Bomb Deal is unlocked':'A surprise price drop awaits'}</b><small>{dealActive?`Save ${currency(p.price-price)} off the regular ${currency(p.price)} price`:'One of this window’s 10 surprise picks'}</small></div>{dealActive?<div className="pd-deal-clock"><span>ENDS IN</span><b aria-label={`Deal ends in ${clock}`}>{clock}</b></div>:<button type="button" onClick={unlock}>Unlock deal <ArrowRight size={14}/></button>}</div>}
        <div className="pd-price-panel"><span className="pd-eyebrow">{dealActive?'YOUR UNLOCKED PRICE':pet?'PROFILE PRICE':'A LITTLE LESS. A LITTLE MORE LOVE.'}</span><div className="pd-price"><strong>{price?currency(price):p.local||p.published?'Adoption':'Photo profile'}</strong>{p.live&&saving>0&&<><del>{currency(mrp)}</del><span>{Math.round(saving/mrp*100)}% off</span></>}</div>
        <p className="pd-price-note">{p.live?`${p.stock} in stock · Sold by ${p.seller}`:pet?'Profile information only':'Catalogue preview · No seller inventory connected'}</p>{p.live&&saving>0&&!pet&&<span className="pd-price-saving">You save {currency(saving)} on the listed MRP</span>}</div>
        {p.live&&<section className="pd-offers"><h2>Available offers</h2><p>Seller offers appear here when published. No coupon is currently configured for this product.</p></section>}
        <div className="pd-specification"><h2>{pet?'Profile information':'Product information'}</h2><p>{p.description}</p>{p.live&&<dl>{Object.entries(p.specifications||{}).filter(([key])=>!['Description','Selling price (₹)'].includes(key)).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>}{pet?<span className={p.species==='Tortoise'?'pd-out-of-stock':'pd-availability'}>{p.species==='Tortoise'?'Out of stock · Purchase unavailable':p.published?'Contact the seller for current availability':'Photo collection · No live availability'}</span>:<div className="pd-quantity"><span>Quantity</span><div><button type="button" onClick={()=>setAmount(value=>Math.max(1,value-1))} disabled={amount===1} aria-label="Decrease quantity"><Minus size={17}/></button><b aria-live="polite">{amount}</b><button type="button" onClick={()=>setAmount(value=>Math.min(20,value+1))} disabled={amount===20} aria-label="Increase quantity"><Plus size={17}/></button></div></div>}</div>
        {!pet&&<div className="pd-total"><span>Item total</span><strong>{currency(payable)}</strong></div>}
        <p className="pd-preview-note">{p.live?'Stock and price are verified again before the seller receives your order.':pet?'Contact the caregiver to confirm availability.':'Catalogue preview. Purchase requires a published seller product.'}</p>
        {message&&<p className="pd-status" role="status">{message}</p>}
        <div className="pd-actions">{purchasable?<><button type="button" className="pd-cart" disabled={outOfStock} onClick={()=>{if(onAdd(amount))setAdded(true);}}><ShoppingCart size={21}/>{outOfStock?'Out of stock':added?'Add more':'Add to cart'}</button><button type="button" className="pd-buy" disabled={outOfStock} onClick={()=>onBuy(amount)}>Buy now <span>at {currency(payable)}</span></button></>:petActions||<p>{outOfStock?'Out of stock':'This catalogue preview is not available to purchase.'}</p>}</div>
        {pet&&petActions}
        {added&&<p className="pd-added" role="status"><Check size={16}/> Added to your cart. <button type="button" onClick={onViewCart}>View cart <ArrowRight size={14}/></button></p>}
      </section>
    </main>
    <section className="pd-explore" hidden={zoom}><div className="pd-explore-tabs" role="tablist" aria-label="Explore product details">{[['overview','Overview'],['facts',pet?'Profile details':'Specifications'],['gallery','Gallery']].map(([id,label])=><button key={id} id={`pd-tab-${id}`} role="tab" aria-selected={tab===id} aria-controls={`pd-panel-${id}`} tabIndex={tab===id?0:-1} onClick={()=>setTab(id)} onKeyDown={event=>{const ids=['overview','facts','gallery'];if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=ids[(ids.indexOf(id)+(event.key==='ArrowRight'?1:2))%3];setTab(next);document.getElementById(`pd-tab-${next}`)?.focus();}}}>{label}</button>)}</div><div className="pd-explore-panel" role="tabpanel" id={`pd-panel-${tab}`} aria-labelledby={`pd-tab-${tab}`} tabIndex={0}>{tab==='overview'?<><span className="pd-eyebrow">A LITTLE MORE TO KNOW</span><h2>{pet?'A little companion. A lot of love.':'Made for their everyday happiness.'}</h2><p>{p.description}</p><div className="pd-reference-facts"><span><PawPrint size={21}/>{p.species==='All'?'All pets':p.species}</span><span><Tag size={21}/>{currency(price)} {p.live?'':'· preview price'}</span><span><Check size={21}/>{outOfStock?'Out of stock':purchasable?'Available to order':'Enquiry or preview only'}</span></div></>:tab==='facts'?<><h2>{pet?'Profile at a glance':'Product at a glance'}</h2><dl><div><dt>Name</dt><dd>{p.name}</dd></div><div><dt>Pet type</dt><dd>{p.species}</dd></div>{p.breed&&<div><dt>Breed / profile</dt><dd>{p.breed}</dd></div>}<div><dt>Availability</dt><dd>{outOfStock?'Out of stock':p.live?`${p.stock} in stock`:p.published?'Confirm with caregiver':'Illustrative catalogue'}</dd></div></dl></>:<><h2>A closer look</h2><button className="pd-gallery-preview" aria-label={`Open ${p.name} gallery image`} onClick={()=>setZoom(true)}>{photo()}</button><p>Current catalogue image · Select to enlarge.</p></>}</div></section>
    {p.live&&p.businessId&&p.productId&&<div className="commerce-product-extras"><ProductReviews businessId={p.businessId} productId={p.productId}/>{related.length>0&&<section><h2>Related products</h2><div className="commerce-related">{related.map(item=><button key={item.id} type="button" onClick={()=>onSelectRelated?.(item)}>{item.image&&<img src={item.image} alt=""/>}<b>{item.name}</b><span>₹{item.price.toLocaleString('en-IN')}</span></button>)}</div></section>}</div>}
    <div className="delivery-home pm-site-chrome" hidden={zoom}><ShopFooter chrome/></div>
    {zoom&&<div className="pd-zoom" role="region" aria-label="Enlarged product image"><button type="button" autoFocus onClick={()=>setZoom(false)} aria-label="Close enlarged image"><X size={24}/></button>{photo()}</div>}
  </dialog>;
}


