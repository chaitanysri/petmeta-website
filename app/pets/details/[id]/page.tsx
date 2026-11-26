import {notFound} from 'next/navigation';
import PetDetailView from '@/components/PetDetailView';
import {petProfiles} from '@/lib/pet-catalog';
export function generateMetadata({params}:{params:{id:string}}){const pet=petProfiles.find(item=>item.id===params.id);return {title:pet?`${pet.name} | PetMeta Pet Collection`:'Pet not found | PetMeta'};}
export default function Page({params}:{params:{id:string}}){const pet=petProfiles.find(item=>item.id===params.id);if(!pet)notFound();return <PetDetailView pet={pet}/>;}
