'use client';
import {useEffect} from 'react';

export default function SourceDeterrent() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    function editing(target: EventTarget | null) {
      return target instanceof Element && !!target.closest('input, textarea, [contenteditable]:not([contenteditable="false"])');
    }
    function contextMenu(event: MouseEvent) {
      if (!editing(event.target)) event.preventDefault();
    }
    function shortcuts(event: KeyboardEvent) {
      if (event.altKey && !event.metaKey) return;
      const key = event.code.startsWith('Key') ? event.code.slice(3).toLowerCase() : event.key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      if (key === 'f12' || (modifier && !event.shiftKey && key === 'u') ||
          (modifier && (event.shiftKey || (event.metaKey && event.altKey)) && ['i','j','c'].includes(key))) event.preventDefault();
    }
    document.addEventListener('contextmenu', contextMenu);
    document.addEventListener('keydown', shortcuts);
    return () => {
      document.removeEventListener('contextmenu', contextMenu);
      document.removeEventListener('keydown', shortcuts);
    };
  }, []);
  return null;
}
