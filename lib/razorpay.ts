'use client';
export type RazorpayLine = { id: string; quantity: number; price: number };
export type RazorpayResult = { orderId: string; paymentId: string };
declare global { interface Window { Razorpay?: any } }

function loadScript(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise(resolve => {
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true); s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/** Creates the order on the server, opens Razorpay Checkout, verifies the payment. Rejects with a readable message. */
export async function payWithRazorpay(lines: RazorpayLine[], customer: { name?: string; email?: string; contact?: string }): Promise<RazorpayResult> {
  if (!await loadScript()) throw Error('Razorpay could not load. Check your internet connection and try again.');
  const res = await fetch('/api/razorpay/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: lines }) });
  const order = await res.json().catch(() => ({}));
  if (!res.ok) throw Error(order.error || 'Payment could not be started.');
  return new Promise<RazorpayResult>((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: order.keyId, amount: order.amount, currency: order.currency, order_id: order.orderId,
      name: 'PetMeta', description: 'Pet essentials order', theme: { color: '#ff7408' },
      prefill: { name: customer.name || '', email: customer.email || '', contact: customer.contact || '' },
      modal: { ondismiss: () => reject(Error('Payment was cancelled. Your cart is still saved.')) },
      handler: async (r: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
        try {
          const v = await fetch('/api/razorpay/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature }) });
          if (!v.ok) throw Error((await v.json().catch(() => ({}))).error || 'Payment could not be verified.');
          resolve({ orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id });
        } catch (e) { reject(e); }
      },
    });
    rzp.on('payment.failed', (e: any) => reject(Error(e?.error?.description || 'Payment failed. Please try again.')));
    rzp.open();
  });
}
