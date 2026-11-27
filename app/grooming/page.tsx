import {Suspense} from 'react';
import CategoryPage from '@/components/CategoryPage';
export const metadata={title:'Pet grooming | PetMeta',description:'Grooming sessions, brushes, combs and bath care.'};
export default function Page(){return <Suspense fallback={<div className="pet-directory-loading">Loading…</div>}><CategoryPage slug="grooming"/></Suspense>}
