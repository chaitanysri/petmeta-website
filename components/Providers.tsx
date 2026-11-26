'use client';
import {QueryClient,QueryClientProvider} from '@tanstack/react-query';
import {AuthSessionProvider} from './auth/AuthSession';
import {useState} from 'react';
export default function Providers({children}:{children:React.ReactNode}){const [client]=useState(()=>new QueryClient({defaultOptions:{queries:{retry:1,staleTime:60000}}}));return <QueryClientProvider client={client}><AuthSessionProvider>{children}</AuthSessionProvider></QueryClientProvider>}
