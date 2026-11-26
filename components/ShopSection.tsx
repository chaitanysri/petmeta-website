import type {ReactNode} from 'react';
export default function ShopSection({children, className, id}: {children: ReactNode; className: string; id?: string}) {
  return <section className={'shop-page-section ' + className} id={id}>{children}</section>;
}
