import {Suspense} from 'react';
import CategoryPage from '@/components/CategoryPage';
export const metadata={title:'Pet health & wellness | PetMeta',description:'Daily wellness, care essentials and grooming care.'};
export default function Page(){return <Suspense fallback={<div className="pet-directory-loading">Loading…</div>}><CategoryPage slug="health"/></Suspense>}
