import { Suspense } from 'react';
import type { Metadata } from 'next';
import ForgotPassword from '@/components/auth/ForgotPassword';
export const metadata: Metadata = { title: 'Forgot password — PetMeta', robots: { index: false } };
export default function Page() { return <Suspense fallback={null}><ForgotPassword /></Suspense>; }
