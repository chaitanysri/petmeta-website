import {Suspense} from 'react';
import CategoryPage from '@/components/CategoryPage';
export const metadata={title:'Veterinary care | PetMeta',description:'Find nearby clinics, book consultations and pick care essentials.'};
export default function Page(){return <Suspense fallback={<div className="pet-directory-loading">Loading…</div>}><CategoryPage slug="vet"/></Suspense>}
