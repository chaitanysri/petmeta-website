import { storeProducts } from '@/lib/store-catalog';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Creates a Razorpay order for catalogue items.
 * Needs RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local (see .env.example).
 * Bomb Deal prices are chosen in the browser, so each line price is only accepted
 * between the deepest possible deal price (40% off) and the listed price.
 */
export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID, keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return Response.json({ error: 'Online payment is not switched on yet. Razorpay keys have not been added.', code: 'not_configured' }, { status: 503 });
  let body: any;
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const lines = Array.isArray(body?.items) ? body.items : [];
  if (!lines.length || lines.length > 20) return Response.json({ error: 'Your cart is empty.' }, { status: 400 });
  let rupees = 0;
  for (const line of lines) {
    const product = storeProducts.find(p => p.id === line?.id);
    const quantity = Number(line?.quantity), price = Number(line?.price);
    if (!product || !Number.isInteger(quantity) || quantity < 1 || quantity > 20 || !Number.isFinite(price)) return Response.json({ error: 'One of the items is not available.' }, { status: 400 });
    if (price < Math.round(product.price * 0.6) || price > product.price) return Response.json({ error: `The price of ${product.name} has changed. Please refresh and try again.` }, { status: 409 });
    rupees += Math.round(price) * quantity;
  }
  try {
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64') },
      body: JSON.stringify({ amount: rupees * 100, currency: 'INR', receipt: `pm_${Date.now()}`, notes: { items: lines.map((l: any) => `${l.id}x${l.quantity}`).join(',').slice(0, 250) } }),
      signal: AbortSignal.timeout(15000),
    });
    const order = await response.json();
    if (!response.ok) return Response.json({ error: order?.error?.description || 'Razorpay could not create the order.' }, { status: 502 });
    return Response.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
  } catch {
    return Response.json({ error: 'Could not reach Razorpay. Please try again.' }, { status: 502 });
  }
}
