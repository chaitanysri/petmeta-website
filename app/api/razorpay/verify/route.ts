import { createHmac, timingSafeEqual } from 'node:crypto';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Confirms the signature Razorpay returns after a successful payment. */
export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return Response.json({ error: 'Online payment is not switched on yet.', code: 'not_configured' }, { status: 503 });
  let b: any;
  try { b = await req.json(); } catch { return Response.json({ error: 'Invalid request.' }, { status: 400 }); }
  const { orderId, paymentId, signature } = b || {};
  if (![orderId, paymentId, signature].every(v => typeof v === 'string' && v.length > 5 && v.length < 200)) return Response.json({ error: 'Invalid payment details.' }, { status: 400 });
  const expected = createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex');
  const a = Buffer.from(expected), c = Buffer.from(signature);
  if (a.length !== c.length || !timingSafeEqual(a, c)) return Response.json({ error: 'Payment could not be verified.' }, { status: 400 });
  return Response.json({ ok: true });
}
