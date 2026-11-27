import {Suspense} from 'react';
import CategoryPage from '@/components/CategoryPage';
export const metadata={title:'Latest offers | PetMeta',description:'Bomb deals, deals of the day and current picks from PetMeta.'};
export default function Page(){return <Suspense fallback={<div className="pet-directory-loading">Loading…</div>}><CategoryPage slug="offers"/></Suspense>}
