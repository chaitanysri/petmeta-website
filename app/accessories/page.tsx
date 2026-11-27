import {Suspense} from 'react';
import CategoryPage from '@/components/CategoryPage';
export const metadata={title:'Pet accessories | PetMeta',description:'Collars, harnesses, bowls, travel gear and more for life together.'};
export default function Page(){return <Suspense fallback={<div className="pet-directory-loading">Loading…</div>}><CategoryPage slug="accessories"/></Suspense>}
