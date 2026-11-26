import Link from 'next/link';

export const metadata = {title:'Cookie policy | PetMeta'};
export default function CookiePolicy() {
  return <main className="cookie-policy">
    <Link href="/">PetMeta</Link>
    <h1>Cookie policy</h1>
    <p>PetMeta stores your cookie choices in a first-party cookie named <code>petmeta_consent</code> for 12 months.</p>
    <h2>Necessary</h2><p>Necessary storage supports features such as signing in and saving your cookie settings.</p>
    <h2>Analytics and marketing</h2><p>Analytics can help us understand site usage. Marketing can help tailor promotions. PetMeta currently has no analytics or marketing scripts configured.</p>
    <h2>Changing your choices</h2><p>Choose Cookie settings in the shop footer or clear the consent cookie in your browser.</p>
  </main>;
}
