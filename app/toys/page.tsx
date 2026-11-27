import {Suspense} from 'react';
import CategoryPage from '@/components/CategoryPage';
export const metadata={title:'Pet toys | PetMeta',description:'Play sets for dogs and cats, plus scratch and explore picks.'};
export default function Page(){return <Suspense fallback={<div className="pet-directory-loading">Loading…</div>}><CategoryPage slug="toys"/></Suspense>}
