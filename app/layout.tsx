import './globals.css';
import './cookies.css';
import './animations.css';
import './home.css';
import './header-footer-fixes.css';
import './dog-chat.css';
import './pet-hero.css';
import './discovery.css';
import './pet-directory.css';
import './pet-reference.css';
import './training.css';
import './product-details.css';
import './auth-recovery.css';
import './shop-layout.css';
import '@fontsource-variable/montserrat';
import './welcome-transition.css';
import './theme-sunny.css';
import './petmeta-unified.css';
import './petmeta-navigation-footer.css';
import './site-chrome.css';
import './amazon-product.css';
import './footer-v2.css';
import './about.css';
import './category-pages.css';
import './category-listing.css';
import './ui-polish.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import CookieConsent from '@/components/CookieConsent';
import SourceDeterrent from '@/components/SourceDeterrent';
export const metadata: Metadata = {title:'PetMeta',description:'Your pet’s happy place. Explore pet essentials, book care, and keep every little detail together.',icons:{icon:'/favicon.svg'}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><head><link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/><link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet"/></head><body><SourceDeterrent/><Providers>{children}<CookieConsent/></Providers></body></html>}


