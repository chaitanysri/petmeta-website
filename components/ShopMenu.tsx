'use client';

import {useEffect, useRef, useState} from 'react';
import PointImage from './PointImage';
import {ArrowRight, BriefcaseMedical, Bone, ChevronDown, CirclePlus, House, Leaf, Menu, PawPrint, Scissors, Ticket, Utensils, X} from 'lucide-react';
import {shopMenus, type ShopMenuAction, type ShopMenuConfig} from '@/lib/shop-menu';
import {useDropdown} from './useDropdown';

const navIcons: Record<string, typeof PawPrint> = {pets: PawPrint, food: Utensils, accessories: BriefcaseMedical, grooming: Scissors, vet: CirclePlus, toys: Bone, health: Leaf, offers: Ticket};

function MenuDetails({menu, onAction}: {menu: ShopMenuConfig; onAction: (action: ShopMenuAction)=>void}) {
  return <>
    <div className="shop-mega-intro">
      <span className="shop-mega-eyebrow">{menu.label}</span>
      <h2>{menu.heading}</h2>
      <p>{menu.description}</p>
      <button type="button" className="shop-mega-cta" onClick={()=>onAction(menu.action)}>{menu.cta}<ArrowRight size={17}/></button>
      {menu.id==='pets'&&<img className="shop-mega-pair" src="/home/menu-pair.webp" width={297} height={184} loading="lazy" alt=""/>}
    </div>
    {menu.groups.map((group,index)=><div key={group.title} className="shop-mega-group">
      <span className="shop-mega-media">
        {menu.id==='pets'
          ?<img className="shop-mega-visual" src={'/home/menu-pets-'+index+'.webp'} width={256} height={141} loading="lazy" alt=""/>
          :<PointImage className="shop-mega-visual" name={menu.id+'-'+index} width={320} height={200}/>}
        <i className="shop-mega-badge" aria-hidden="true">{/care|vet|health/i.test(group.title)?<CirclePlus size={18}/>:<PawPrint size={18}/>}</i>
      </span>
      {menu.id==='pets' && ['Dogs','Cats','Other Pets'].includes(group.title) ? <button type="button" className="shop-mega-group-title-link" onClick={()=>onAction({type:'pet',pet:group.title==='Dogs'?'dog':group.title==='Cats'?'cat':'all'})}>{group.title}<ArrowRight size={15}/></button> : <h3>{group.title}</h3>}
      {group.links.map(item=><button type="button" key={item.label} onClick={()=>onAction(item.action)}>{item.label}<ArrowRight size={13}/></button>)}
    </div>)}
  </>;
}

export default function ShopMenu({activeCategory,onAction,onHome}: {activeCategory: string; onAction: (action: ShopMenuAction)=>void; onHome?: ()=>void}) {
  const desktop = useDropdown('desktop-navigation');
  const mobile = useDropdown('mobile-navigation');
  const drawer = useRef<HTMLDialogElement | null>(null);
  const [selected,setSelected] = useState<string|null>(null);
  const [accordion,setAccordion] = useState<string|null>(null);
  const open = desktop.open ? selected : null;

  useEffect(()=>{
    const node = drawer.current;
    if (mobile.open && !node?.open) {setAccordion(null);node?.showModal();}
    if (!mobile.open && node?.open) node.close();
  },[mobile.open]);

  useEffect(()=>{
    const query=window.matchMedia('(min-width:900px)');
    const resize=()=>{desktop.close();mobile.close();};
    query.addEventListener('change',resize);
    return ()=>query.removeEventListener('change',resize);
  },[]);

  function run(action: ShopMenuAction) {
    desktop.close();mobile.close();onAction(action);
  }

  return <nav className="shop-nav shop-menu" aria-label="Shop categories">
    <button type="button" className="shop-mobile-menu-trigger" aria-haspopup="dialog" aria-expanded={mobile.open}
      aria-controls="shop-category-drawer" ref={el=>{mobile.trigger.current=el}} onClick={mobile.toggle}>
      <Menu size={19}/> Browse categories
    </button>
    <div className="shop-nav-list shop-nav-desktop" ref={el=>{desktop.root.current=el}} onKeyDown={desktop.onKeyDown}
      onMouseLeave={()=>{if(!desktop.panel.current?.contains(document.activeElement)) desktop.close()}}>
      <div className={'shop-nav-item shop-nav-home'+(activeCategory==='all'?' is-active':'')} onMouseEnter={()=>desktop.close()}>
        <button type="button" aria-current={activeCategory==='all'?'page':undefined} onClick={()=>{desktop.close();onHome?.()}}><House size={16}/>Home</button>
      </div>
      {shopMenus.map(menu=><div className={'shop-nav-item'+(activeCategory===menu.id?' is-active':'')} key={menu.id}
        onMouseEnter={event=>{
          if(window.matchMedia('(hover: hover)').matches){
            desktop.trigger.current=event.currentTarget.querySelector('button');setSelected(menu.id);desktop.show();
          }
        }}>
        <button type="button" aria-haspopup="true" aria-expanded={open===menu.id} aria-controls={'shop-mega-'+menu.id}
          onKeyDown={event=>{
            if(event.key==='ArrowDown'||event.key==='ArrowUp'){
              desktop.trigger.current=event.currentTarget;setSelected(menu.id);desktop.show();
            }
          }}
          onClick={event=>{
            desktop.trigger.current=event.currentTarget;
            if(open===menu.id && event.detail===0) desktop.close();
            else {setSelected(menu.id);desktop.show();}
          }}>
          {(()=>{const Icon=navIcons[menu.id];return Icon?<Icon className="shop-nav-icon" size={17} aria-hidden="true"/>:null})()}{menu.label}<ChevronDown size={13}/>
        </button>
        {open===menu.id && <div className={'mega-menu shop-mega-menu groups-'+menu.groups.length} id={'shop-mega-'+menu.id}
          ref={el=>{desktop.panel.current=el}} role="group" aria-label={menu.label}>
          <MenuDetails menu={menu} onAction={run}/>
        </div>}
      </div>)}
    </div>
    <dialog className="shop-drawer" id="shop-category-drawer" aria-labelledby="shop-drawer-title"
      ref={el=>{drawer.current=el;mobile.panel.current=el}} onClose={mobile.close}
      onClick={event=>{if(event.target===event.currentTarget)mobile.close()}}>
      <div className="shop-drawer-inner">
        <header><h2 id="shop-drawer-title">Shop categories</h2>
          <button className="shop-drawer-close" type="button" aria-label="Close categories" autoFocus onClick={mobile.close}><X size={21}/></button>
        </header>
        {shopMenus.map(menu=><div key={menu.id} className="shop-drawer-entry">
          <button type="button" aria-expanded={accordion===menu.id} aria-controls={'shop-accordion-'+menu.id}
            onClick={()=>setAccordion(current=>current===menu.id?null:menu.id)}>{menu.label}<ChevronDown size={16}/></button>
          {accordion===menu.id && <div id={'shop-accordion-'+menu.id} className="shop-drawer-details">
            <MenuDetails menu={menu} onAction={run}/>
          </div>}
        </div>)}
      </div>
    </dialog>
  </nav>;
}
