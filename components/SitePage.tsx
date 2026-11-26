'use client';
import type {ReactNode} from 'react';
import SiteHeader from './SiteHeader';
import {ShopFooter} from './ShopFront';
import Marketplace from './Marketplace';
import {DropdownProvider} from './useDropdown';

/**
 * Shared chrome for every customer page that is not the home page:
 * the exact same navigation bar and footer as the home page. The wrapper uses
 * display:contents so it only supplies the `.delivery-home` styling scope and
 * never creates a box of its own (which keeps the header sticky page-wide).
 */
export default function SitePage({children}:{children:ReactNode}){
  return <DropdownProvider>
    <div className="delivery-home pm-site-chrome"><SiteHeader/></div>
    {children}
    <div className="delivery-home pm-site-chrome"><Marketplace category="pets" query="" species="All" cartOnly/><ShopFooter chrome/></div>
  </DropdownProvider>;
}
