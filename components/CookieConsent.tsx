'use client';
import {useEffect, useRef, useState} from 'react';
import Link from 'next/link';
import {updateConsentScripts, type Consent} from '@/lib/cookie-consent';

const COOKIE = 'petmeta_consent';
const essential = {analytics: false, marketing: false};

function readConsent(): Consent | null {
  const token = document.cookie.split('; ').find(cookie => cookie.startsWith(COOKIE + '='));
  if (!token) return null;
  try {
    const value = JSON.parse(decodeURIComponent(token.slice(COOKIE.length + 1)));
    return typeof value?.analytics === 'boolean' && typeof value?.marketing === 'boolean' ? value : null;
  } catch {return null;}
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [draft, setDraft] = useState<Consent>(essential);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const choice = useRef<Consent | null>(null);

  function manage() {
    trigger.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setDraft(choice.current ?? essential);
    dialog.current?.showModal();
  }

  useEffect(() => {
    choice.current = readConsent();
    setVisible(choice.current === null);
    if (choice.current) updateConsentScripts(null, choice.current);
    window.addEventListener('petmeta-cookie-settings', manage);
    return () => window.removeEventListener('petmeta-cookie-settings', manage);
  }, []);

  function save(next: Consent) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = COOKIE + '=' + encodeURIComponent(JSON.stringify(next)) +
      '; Path=/; Expires=' + expires.toUTCString() + '; SameSite=Lax' +
      (location.protocol === 'https:' ? '; Secure' : '');
    const previous = choice.current;
    choice.current = next;
    dialog.current?.close();
    setVisible(false);
    updateConsentScripts(previous, next);
  }

  return <>
    {visible && <section className="cookie-banner" role="dialog" aria-labelledby="cookie-title">
      <div><h2 id="cookie-title">Cookie choices</h2><p>Choose which optional cookies PetMeta can use. <Link href="/cookie-policy">Cookie policy</Link></p></div>
      <div className="cookie-actions">
        <button type="button" onClick={()=>save({analytics:true,marketing:true})}>Accept all</button>
        <button type="button" onClick={()=>save(essential)}>Reject non-essential</button>
        <button type="button" onClick={manage}>Manage preferences</button>
      </div>
    </section>}
    <dialog className="cookie-dialog" ref={dialog} aria-labelledby="cookie-preferences-title"
      onClose={()=>trigger.current?.isConnected && trigger.current.focus()}>
      <h2 id="cookie-preferences-title">Cookie preferences</h2>
      <p>Necessary cookies are always on. You can change optional choices anytime.</p>
      <div className="cookie-toggles">
        <label><input type="checkbox" checked disabled/> Necessary</label>
        <label><input type="checkbox" checked={draft.analytics} onChange={e=>setDraft({...draft,analytics:e.target.checked})}/> Analytics</label>
        <label><input type="checkbox" checked={draft.marketing} onChange={e=>setDraft({...draft,marketing:e.target.checked})}/> Marketing</label>
      </div>
      <div className="cookie-actions">
        <button type="button" onClick={()=>save(draft)}>Save preferences</button>
        <button type="button" onClick={()=>dialog.current?.close()}>Cancel</button>
      </div>
    </dialog>
  </>;
}
