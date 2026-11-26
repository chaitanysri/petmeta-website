import Link from 'next/link';
import {AUTH_LOGO_SRC} from '@/lib/auth-logo';

export default function PetMetaLogo({home = false}: {home?: boolean}) {
  const image = <img className="petmeta-logo auth-logo" src={AUTH_LOGO_SRC} width={1000} height={803} alt="PetMeta" draggable={false} onDragOver={home?undefined:event=>event.preventDefault()} onDrop={home?undefined:event=>event.preventDefault()}/>;
  return home ? <Link href="/home" className="shop-logo" aria-label="PetMeta home">{image}</Link> : image;
}
