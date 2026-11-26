'use client';

import { FormEvent, useEffect, useState } from 'react';
import PetMetaLogo from '@/components/PetMetaLogo';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check, Eye, EyeOff, LoaderCircle, LockKeyhole, ShieldCheck, TriangleAlert } from 'lucide-react';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { authErrorMessage } from '@/lib/auth-errors';

type Phase = 'checking' | 'ready' | 'invalid' | 'done';

export default function ResetPassword() {
  const router = useRouter();
  const params = useSearchParams();
  const code = params.get('oobCode') ?? '';
  const mode = params.get('mode');
  const [phase, setPhase] = useState<Phase>('checking');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [serviceError, setServiceError] = useState('');
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState('');

  const strong = password.length >= 8 && /[a-zA-Z]/.test(password) && /[^a-zA-Z]/.test(password);

  useEffect(() => {
    let live = true;
    if (!code || (mode && mode !== 'resetPassword')) { setProblem('This link is missing information. Request a new reset email to continue.'); setPhase('invalid'); return; }
    if (!auth) { setProblem('Account recovery is not connected yet. Please try again later.'); setPhase('invalid'); return; }
    verifyPasswordResetCode(auth, code)
      .then(email => { if (live) { setAccount(email); setPhase('ready'); } })
      .catch(error => { if (live) { setProblem(authErrorMessage(error)); setPhase('invalid'); } });
    return () => { live = false; };
  }, [code, mode]);

  useEffect(() => {
    if (phase !== 'done') return;
    const t = setTimeout(() => router.push('/login'), 4000);
    return () => clearTimeout(t);
  }, [phase, router]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || !auth) return;
    const next: typeof errors = {};
    if (!strong) next.password = 'Use 8+ characters with a letter and a number or symbol.';
    if (confirm !== password) next.confirm = 'The two passwords don’t match.';
    setErrors(next); setServiceError('');
    if (Object.keys(next).length) return;
    setBusy(true);
    try { await confirmPasswordReset(auth, code, password); setPassword(''); setConfirm(''); setPhase('done'); }
    catch (error) {
      const c = (error as { code?: string })?.code;
      if (c === 'auth/expired-action-code' || c === 'auth/invalid-action-code') { setProblem(authErrorMessage(error)); setPhase('invalid'); }
      else setServiceError(c === 'auth/weak-password' ? 'That password is too weak. Try a longer one.' : authErrorMessage(error).replace('Sign-in could not finish.', 'We couldn’t update your password.'));
    } finally { setBusy(false); }
  }

  return <div className="animated-auth is-signin recovery-page">
    <header className="animated-auth-header auth-brand-bar"><PetMetaLogo/></header>
    <main className="recovery-center">
      <section className="auth-card reactive-auth-card recovery-card" aria-labelledby="reset-title" aria-busy={phase === 'checking'}>
        {phase === 'checking' && <>
          <div className="recovery-icon"><LoaderCircle className="spin" size={26} /></div>
          <h2 id="reset-title">Checking your link…</h2>
          <p className="recovery-lead">One moment while we make sure it’s still valid.</p>
        </>}
        {phase === 'invalid' && <>
          <div className="recovery-icon is-warn"><TriangleAlert size={26} /></div>
          <h2 id="reset-title">This link can’t be used</h2>
          <p className="recovery-lead" role="alert">{problem}</p>
          <Link href="/forgot-password" className="button auth-submit recovery-link-btn">Request a new link<ArrowRight size={18} /></Link>
        </>}
        {phase === 'ready' && <>
          <div className="recovery-icon"><LockKeyhole size={26} /></div>
          <h2 id="reset-title">Choose a new password</h2>
          <p className="recovery-lead">for <strong>{account}</strong></p>
          <form onSubmit={submit} noValidate>
            <label htmlFor="reset-password">New password
              <div className={`input-wrap ${errors.password ? 'invalid' : strong ? 'valid' : ''}`}><LockKeyhole size={18} />
                <input id="reset-password" type={show ? 'text' : 'password'} autoComplete="new-password" autoFocus placeholder="Create a strong password" value={password} disabled={busy}
                  onChange={e => { setPassword(e.target.value); setErrors(o => ({ ...o, password: undefined })); setServiceError(''); }} aria-invalid={!!errors.password} aria-describedby={errors.password ? 'reset-password-error' : 'reset-password-help'} />
                <button type="button" aria-label={show ? 'Hide passwords' : 'Show passwords'} aria-pressed={show} onPointerDown={e => e.preventDefault()} onClick={() => setShow(v => !v)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {errors.password ? <span className="field-error" id="reset-password-error" role="alert">{errors.password}</span> : <span id="reset-password-help" className={`password-help ${strong ? 'is-strong' : ''}`}>{strong ? '✓ Strong password. Your secret is safe.' : '8+ characters, including a letter and a number or symbol.'}</span>}
            </label>
            <label htmlFor="reset-confirm">Confirm new password
              <div className={`input-wrap ${errors.confirm ? 'invalid' : confirm && confirm === password ? 'valid' : ''}`}><LockKeyhole size={18} />
                <input id="reset-confirm" type={show ? 'text' : 'password'} autoComplete="new-password" placeholder="Type it once more" value={confirm} disabled={busy}
                  onChange={e => { setConfirm(e.target.value); setErrors(o => ({ ...o, confirm: undefined })); }} aria-invalid={!!errors.confirm} aria-describedby={errors.confirm ? 'reset-confirm-error' : undefined} />
                {confirm && confirm === password && <Check size={17} />}
              </div>
              {errors.confirm && <span className="field-error" id="reset-confirm-error" role="alert">{errors.confirm}</span>}
            </label>
            {serviceError && <p className="error" role="alert">{serviceError}</p>}
            <button className="button auth-submit" disabled={busy}>{busy ? <LoaderCircle className="spin" size={19} /> : <>Update password<ArrowRight size={18} /></>}</button>
          </form>
        </>}
        {phase === 'done' && <>
          <div className="recovery-icon is-sent"><ShieldCheck size={26} /></div>
          <h2 id="reset-title">Password updated</h2>
          <p className="recovery-lead" role="status">You can now sign in with your new password. Taking you there in a moment…</p>
          <Link href="/login" className="button auth-submit recovery-link-btn">Go to sign in<ArrowRight size={18} /></Link>
        </>}
        {phase !== 'done' && <Link href="/login" className="recovery-back"><ArrowLeft size={15} /> Back to sign in</Link>}
      </section>
    </main>
  </div>;
}
