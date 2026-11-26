'use client';

import {createContext, useContext, useEffect, useState, type ReactNode} from 'react';
import {usePathname, useRouter} from 'next/navigation';
import {getRedirectResult, onAuthStateChanged, signOut, type User, type UserCredential} from 'firebase/auth';
import {doc, runTransaction, serverTimestamp} from 'firebase/firestore';
import {preloadAuthAssets} from '@/lib/preload-auth';
import {auth, db} from '@/lib/firebase';

export async function recordLogin(result: UserCredential, provider: string) {
  const {uid, displayName, email, photoURL} = result.user;
  const profile = doc(db, 'users', uid);
  await runTransaction(db, async transaction => {
    const snapshot = await transaction.get(profile);
    if (snapshot.exists()) transaction.update(profile, {lastLoginAt: serverTimestamp()});
    else transaction.set(profile, {
      uid, name: displayName, email, photoURL, provider,
      createdAt: serverTimestamp(), lastLoginAt: serverTimestamp(),
    });
  });
}

const AuthSession = createContext<{
  user: User | null;
  ready: boolean;
  setInteractive: (active: boolean) => void;
  redirectError: unknown;
  setRedirectError: (error: unknown) => void;
  logout: () => Promise<void>;
} | null>(null);
let redirectResult: ReturnType<typeof getRedirectResult> | undefined;

export function useAuthSession() {
  const session = useContext(AuthSession);
  if (!session) throw new Error('Missing AuthSessionProvider');
  return session;
}

const protectedPath = /^\/(home|pets|food|grooming|vet|accessories|bookings|booking|chat|profile|transition|pet-zone)(\/|$)/;

export function AuthSessionProvider({children}: {children: ReactNode}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [known, setKnown] = useState(false);
  const [redirectChecked, setRedirectChecked] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [redirectError, setRedirectError] = useState<unknown>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const ready = known && redirectChecked;
  const authPage = pathname === '/login' || pathname === '/register';
  const protectedPage = protectedPath.test(pathname);
  const destination = !ready ? null
    : !user && protectedPage ? '/login'
    : user && (pathname === '/' || (authPage && !interactive)) ? redirected && authPage ? '/transition' : '/home'
    : null;

  useEffect(() => onAuthStateChanged(auth, account => {
    setUser(account);
    setKnown(true);
  }, () => setKnown(true)), []);

  useEffect(() => {
    let mounted = true;
    redirectResult ??= getRedirectResult(auth).then(async result => {
      if (result) await recordLogin(result, result.providerId ?? 'google.com');
      return result;
    });
    redirectResult.then(result => {
      if (mounted && result) setRedirected(true);
    }, error => {
      if (mounted) setRedirectError(error);
    }).finally(() => {
      if (mounted) setRedirectChecked(true);
    });
    return () => {mounted = false;};
  }, []);

  useEffect(() => {
    if (destination && !signingOut) router.replace(destination);
  }, [destination, router, signingOut]);
  useEffect(() => {
    if (authPage) setSigningOut(false);
    if (!authPage) {setInteractive(false); setRedirected(false);}
  }, [authPage]);

  async function logout() {
    preloadAuthAssets(router.prefetch);
    setSigningOut(true);
    try {
      await signOut(auth);
    } catch (error) {
      setSigningOut(false);
      throw error;
    }
    preloadAuthAssets(router.prefetch);
    router.replace('/login');
    setUser(null);
    setInteractive(false);
    setRedirected(false);
    setRedirectError(null);
  }

  return <AuthSession.Provider value={{user, ready, setInteractive, redirectError, setRedirectError, logout}}>
    {((pathname === '/' || protectedPage || authPage) && !ready) || destination || signingOut
      ? <main className="auth-session-skeleton" aria-busy="true"><span className="sr-only">Checking your session</span></main>
      : children}
  </AuthSession.Provider>;
}
