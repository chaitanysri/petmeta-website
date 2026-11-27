import {Suspense} from 'react';
import CategoryPage from '@/components/CategoryPage';
export const metadata={title:'Pet food & treats | PetMeta',description:'Everyday meals and little rewards for dogs and cats.'};
export default function Page(){return <Suspense fallback={<div className="pet-directory-loading">Loading…</div>}><CategoryPage slug="food"/></Suspense>}
