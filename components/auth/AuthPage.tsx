'use client';

import {useRouter} from 'next/navigation';
import AnimatedAuth from './AnimatedAuth';

export default function AuthPage({register = false}: {register?: boolean}) {
  const router = useRouter();
  return <AnimatedAuth register={register} onSuccess={()=>router.replace('/transition')}/>;
}
