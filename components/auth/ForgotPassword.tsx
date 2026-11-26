'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import PetMetaLogo from '@/components/PetMetaLogo';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, LoaderCircle, Mail, MailCheck } from 'lucide-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authErrorMessage } from '@/lib/auth-errors';

const COOLDOWN = 60;
const validate = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function ForgotPassword() {
  const params = useSearchParams();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [fieldError, setFieldError] = useState('');
  const [serviceError, setServiceError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState('');
  const [wait, setWait] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => () => clearInterval(timer.current), []);

  function startCooldown() {
    clearInterval(timer.current);
    setWait(COOLDOWN);
    timer.current = setInterval(() => setWait(n => { if (n <= 1) { clearInterval(timer.current); return 0; } return n - 1; }), 1000);
  }

  async function send(target: string) {
    if (!auth) { setServiceError('Account recovery is not connected yet. Please try again later.'); return false; }
    setBusy(true); setServiceError('');
    try {
      try {
        await sendPasswordResetEmail(auth, target, { url: `${window.location.origin}/login`, handleCodeInApp: false });
      } catch (error) {
        // If this site's domain isn't in Firebase "Authorized domains" yet, send without a continue link.
        if ((error as { code?: string })?.code === 'auth/unauthorized-continue-uri' || (error as { code?: string })?.code === 'auth/invalid-continue-uri') await sendPasswordResetEmail(auth, target);
        else throw error;
      }
      return true;
    } catch (error) {
      const code = (error as { code?: string })?.code;
      // Never reveal whether an account exists for this address.
      if (code === 'auth/user-not-found' || code === 'auth/user-disabled') return true;
      setServiceError(code === 'auth/invalid-email' ? 'Enter a valid email address.' : authErrorMessage(error).replace('Sign-in could not finish.', 'We couldn’t send the email.'));
      return false;
    } finally { setBusy(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    if (!validate(email)) { setFieldError('Enter the email address you signed up with.'); return; }
    setFieldError('');
    const target = email.trim();
    if (await send(target)) { setSentTo(target); startCooldown(); }
  }

  async function resend() {
    if (wait > 0 || busy) return;
    if (await send(sentTo)) startCooldown();
  }

  return <div className="animated-auth is-signin recovery-page">
    <header className="animated-auth-header auth-brand-bar"><PetMetaLogo/></header>
    <main className="recovery-center">
      <section className="auth-card reactive-auth-card recovery-card" aria-labelledby="recovery-title">
        {sentTo ? <>
          <div className="recovery-icon is-sent"><MailCheck size={26} /></div>
          <h2 id="recovery-title">Check your inbox</h2>
          <p className="recovery-lead">If this email is registered, a reset link has been sent.</p>
          <ul className="recovery-tips">
            <li>Look in spam or promotions if you don’t see it.</li>
            <li>Make sure you’re using the email you registered with.</li>
          </ul>
          <p role="status" className="reset-message" aria-live="polite">{wait > 0 ? `You can request another email in ${wait}s.` : ' '}</p>
          {serviceError && <p className="error" role="alert">{serviceError}</p>}
          <button type="button" className="button auth-submit" disabled={wait > 0 || busy} onClick={resend}>{busy ? <LoaderCircle className="spin" size={19} /> : 'Send it again'}</button>
          <button type="button" className="recovery-text-btn" onClick={() => { setSentTo(''); setServiceError(''); }}>Use a different email</button>
        </> : <>
          <div className="recovery-icon"><Mail size={26} /></div>
          <h2 id="recovery-title">Forgot your password?</h2>
          <p className="recovery-lead">Enter your email and we’ll send you a link to choose a new one.</p>
          <form onSubmit={submit} noValidate>
            <label htmlFor="recovery-email">Email Address
              <div className={`input-wrap ${fieldError ? 'invalid' : validate(email) ? 'valid' : ''}`}><Mail size={18} />
                <input id="recovery-email" type="email" autoComplete="email" autoFocus placeholder="usman@company.com" value={email} disabled={busy}
                  onChange={e => { setEmail(e.target.value); setFieldError(''); setServiceError(''); }} aria-invalid={!!fieldError} aria-describedby={fieldError ? 'recovery-email-error' : undefined} />
              </div>
              {fieldError && <span className="field-error" id="recovery-email-error" role="alert">{fieldError}</span>}
            </label>
            {serviceError && <p className="error" role="alert">{serviceError}</p>}
            <button className="button auth-submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={19} /> : <>Send reset link<ArrowRight size={18} /></>}</button>
          </form>
        </>}
        <Link href="/login" className="recovery-back"><ArrowLeft size={15} /> Back to sign in</Link>
      </section>
    </main>
  </div>;
}
