import { Suspense } from 'react';
import type { Metadata } from 'next';
import ResetPassword from '@/components/auth/ResetPassword';
export const metadata: Metadata = { title: 'Reset password — PetMeta', robots: { index: false }, referrer: 'no-referrer' };
export default function Page() { return <Suspense fallback={null}><ResetPassword /></Suspense>; }
