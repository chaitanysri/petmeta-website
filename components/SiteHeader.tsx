'use client';
import {useEffect,useState} from 'react';
import {usePathname,useRouter} from 'next/navigation';
import {MapPin,Heart,ShoppingBag,UserRound,ChevronDown,CalendarDays} from 'lucide-react';
import {preloadAuthAssets} from '@/lib/preload-auth';
import {useAuthSession} from './auth/AuthSession';
import PetMetaLogo from './PetMetaLogo';
import ShopMenu from './ShopMenu';
import {useDropdown} from './useDropdown';
import type {ShopMenuAction} from '@/lib/shop-menu';
import {actionHref} from '@/lib/category-pages';

export type SiteHeaderProps={
  /** Active category in the nav (home page only). */
  category?:string;
  query?:string;
  locationLabel?:string;
  locationOpen?:boolean;
  locationTrigger?:(node:HTMLButtonElement|null)=>void;
  onLocationClick?:()=>void;
  /** When these are supplied (home page) the header drives the in-page store. When omitted the header navigates to /home instead. */
  onMenuAction?:(action:ShopMenuAction)=>void;
  onHome?:()=>void;
  onAccountItem?:(item:string)=>void;
  onWishlist?:()=>void;
  onNotice?:(message:string)=>void;
  /** Called before any navigation/action (used by the product dialog to close itself first). */
  beforeNavigate?:()=>void;
};

const send=(name:string)=>window.dispatchEvent(new Event(name));

/**
 * The one PetMeta navigation bar. Used by the home page and by every other
 * customer page so the bar looks and behaves identically everywhere.
 */
export default function SiteHeader({category='all',query='',locationLabel='Choose your location',locationOpen=false,locationTrigger,onLocationClick,onMenuAction,onHome,onAccountItem,onWishlist,onNotice,beforeNavigate}:SiteHeaderProps){
  const router=useRouter();
  const pathname=usePathname();
  const onHomePage=pathname==='/home';
  const {user,logout}=useAuthSession();
  const accountMenu=useDropdown('account');
  const account=accountMenu.open;
  const standalone=!onMenuAction;
  const [cart,setCart]=useState<Record<string,number>>({}),[saved,setSaved]=useState<string[]>([]);
  useEffect(()=>{
    const load=()=>{try{setCart(JSON.parse(localStorage.getItem('pm-store-cart')||'{}'));setSaved(JSON.parse(localStorage.getItem('pm-market-saved')||'[]'))}catch{}};
    load();window.addEventListener('pm-store-change',load);window.addEventListener('storage',load);
    return()=>{window.removeEventListener('pm-store-change',load);window.removeEventListener('storage',load)};
  },[]);
  const count=Object.values(cart).reduce((a,b)=>a+(Number(b)||0),0);
  const notice=(message:string)=>onNotice?.(message);

  /* ---- standalone behaviour: on /home drive the page through events, elsewhere go to /home ---- */
  const emit=(name:string,detail?:unknown)=>window.dispatchEvent(new CustomEvent(name,{detail}));
  function standaloneAction(action:ShopMenuAction){
    beforeNavigate?.();
    if(action.type==='appointments'){if(onHomePage)send('pm-open-appointments');else router.push('/home?open=appointments');return}
    const href=actionHref(action);
    if(href){router.push(href);return}
    if(onHomePage){emit('pm-site-action',action);return}
    router.push(`/home${action.type==='section'&&action.selector.startsWith('#')?action.selector:''}`);
  }
  const menuAction=onMenuAction??standaloneAction;
  const goHome=onHome??(()=>{beforeNavigate?.();if(onHomePage)emit('pm-site-home');else router.push('/home')});
  const openLocation=onLocationClick??(()=>{beforeNavigate?.();if(onHomePage)emit('pm-site-location');else router.push('/home?open=location')});
  const openAppointments=()=>{beforeNavigate?.();if(standalone&&!onHomePage)router.push('/home?open=appointments');else send('pm-open-appointments')};
  const openWishlist=onWishlist??(()=>{beforeNavigate?.();if(onHomePage)emit('pm-site-wishlist');else router.push('/home?wishlist=1')});
  const openCart=()=>{beforeNavigate?.();send('pm-open-cart')};

  function accountItem(item:string){
    accountMenu.close();
    if(item==='My Orders'){beforeNavigate?.();send('pm-open-orders')}
    else if(item==='My Appointments')openAppointments();
    else if(onAccountItem)onAccountItem(item);
    else if(item==='My Pets'){beforeNavigate?.();router.push('/pets')}
    else openWishlist();
  }

  return <header className="shop-header" data-site-header="">
    <div className="shop-top">
      <PetMetaLogo home/>
      <button type="button" className="shop-location" ref={locationTrigger} onClick={openLocation} aria-label={`Change location: ${locationLabel}`} aria-haspopup="dialog" aria-expanded={locationOpen}><span className="shop-location-pin"><MapPin size={18}/></span><span className="shop-location-copy"><small>Your location</small><b title={locationLabel}>{locationLabel}</b></span><ChevronDown size={13}/></button>
      <button className="appointments-header" onClick={openAppointments}><CalendarDays size={17} aria-hidden="true"/>My Appointments</button>
      <button className="partner-link" onClick={()=>{beforeNavigate?.();router.push('/about')}}>About us</button>
      <button className="partner-link" onClick={()=>send('pm-partner')}>Become a partner ↗</button>
      <div className="shop-account" ref={node=>{accountMenu.root.current=node}} onKeyDown={accountMenu.onKeyDown}>
        <button ref={node=>{accountMenu.trigger.current=node}} onClick={()=>{if(!account&&user)preloadAuthAssets(router.prefetch);accountMenu.toggle()}} aria-haspopup="menu" aria-controls="shop-account-menu" aria-expanded={account} aria-label="Account options">{user?.photoURL?<img className="shop-account-avatar" src={user.photoURL} width={24} height={24} alt="" referrerPolicy="no-referrer"/>:<UserRound size={20}/>}<span>{user?.displayName || (user?'Account':'Login')}</span><ChevronDown size={13}/></button>
        {account&&<div className="account-menu" id="shop-account-menu" role="menu" aria-label="Account options" ref={node=>{accountMenu.panel.current=node}}>
          {user?.displayName&&<p className="account-display-name">{user.displayName}</p>}
          {['My Orders','My Appointments','My Pets','Wishlist'].map(t=><button role="menuitem" key={t} onClick={()=>accountItem(t)}>{t}</button>)}
          {user?<button role="menuitem" onPointerEnter={()=>preloadAuthAssets(router.prefetch)} onFocus={()=>preloadAuthAssets(router.prefetch)} onClick={()=>{void logout().catch(()=>notice('Could not sign out. Please try again.'))}}>Logout</button>:<a role="menuitem" href="/login">Sign in / Register</a>}
        </div>}
      </div>
      <button className="header-count" aria-label={`Wishlist ${saved.length} items`} onClick={openWishlist}><Heart size={22}/><i>{saved.length}</i></button>
      <button className="header-count" aria-label={`Cart ${count} items`} onClick={openCart}><ShoppingBag size={22}/><i>{count}</i></button>
    </div>
    <ShopMenu activeCategory={category==='accessories'&&query==='play'?'toys':category} onAction={action=>{menuAction(action)}} onHome={goHome}/>
  </header>;
}
