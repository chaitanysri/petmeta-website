'use client';
import {createContext, useContext, useEffect, useRef, useState, type Dispatch, type KeyboardEvent, type ReactNode, type SetStateAction} from 'react';
import {usePathname} from 'next/navigation';

type Active = string | null;
const DropdownContext = createContext<[Active, Dispatch<SetStateAction<Active>>] | null>(null);
const focusable = 'button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),[tabindex="0"]';

export function DropdownProvider({children}: {children: ReactNode}) {
  const path = usePathname();
  const state = useState<Active>(null);
  const [,setOpen] = state;
  useEffect(()=>setOpen(null), [path,setOpen]);
  return <DropdownContext.Provider value={state}>{children}</DropdownContext.Provider>;
}

export function useDropdown(id: string) {
  const context = useContext(DropdownContext);
  if (!context) throw new Error('Missing DropdownProvider');
  const [active,setActive] = context;
  const open = active === id;
  const root = useRef<HTMLElement | null>(null);
  const panel = useRef<HTMLElement | null>(null);
  const trigger = useRef<HTMLElement | null>(null);
  function close() {setActive(current=>current===id ? null : current);}
  function show() {setActive(id);}
  function toggle() {setActive(current=>current===id ? null : id);}
  function contains(target: Node | null) {
    return !!target && Boolean(root.current?.contains(target) || panel.current?.contains(target) || trigger.current?.contains(target));
  }
  useEffect(()=>{
    if (!open) return;
    function pointer(event: PointerEvent) {if (!contains(event.target as Node)) close();}
    function focus(event: FocusEvent) {if (!contains(event.target as Node)) close();}
    function cancel(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      event.preventDefault();
      close();
      trigger.current?.focus();
    }
    document.addEventListener('pointerdown',pointer);
    document.addEventListener('focusin',focus);
    document.addEventListener('keydown',cancel);
    return ()=>{
      document.removeEventListener('pointerdown',pointer);
      document.removeEventListener('focusin',focus);
      document.removeEventListener('keydown',cancel);
    };
  },[open,id,setActive]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) return;
    event.preventDefault();
    const step = event.key === 'ArrowDown' ? 1 : -1;
    if (!open) show();
    requestAnimationFrame(()=>{
      const controls = Array.from(panel.current?.querySelectorAll<HTMLElement>(focusable) ?? []);
      const current = controls.indexOf(document.activeElement as HTMLElement);
      const next = current === -1 ? step === 1 ? 0 : controls.length - 1 : (current + step + controls.length) % controls.length;
      controls[next]?.focus();
    });
  }
  return {open,root,panel,trigger,show,toggle,close,onKeyDown};
}
