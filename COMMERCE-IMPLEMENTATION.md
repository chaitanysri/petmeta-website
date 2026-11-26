# PetMeta website source

Run locally with `npm ci` and `npm run dev -- -p 3001`, then open `http://127.0.0.1:3001/home`.

The website now reads published seller products from Firebase, uses the authenticated business service to create stock-checked orders, shows customer orders and payment status, offers saved addresses, and redirects online payments to Razorpay. Buy Now uses only the selected product and leaves the cart intact. Illustrative catalogue products remain viewable but cannot create fake orders.

The included `business-backend` source adds order image snapshots and verified-purchase reviews with photo upload and moderation. Deploy its Functions, Firestore rules and Storage rules to enable those new backend features in a live environment. Razorpay merchant credentials and webhook configuration must be present on that backend. The source archive does not include local secrets, installed dependencies, or build outputs.

Checks completed: `npm run typecheck`, `npm --prefix business-backend test` (9 passed), Node syntax checks, and a headless Chrome check of the local home page, product preview and cart. A live purchase was not performed because no seller account or payment credentials were used in this verification.

## Store checkout with Razorpay (catalogue items)
PetMeta store items (including Bomb Deals) can now be added to the cart and paid for through Razorpay.
1. Copy `.env.example` to `.env.local` and fill in `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (use `rzp_test_` keys first), then restart `npm run dev`.
2. `POST /api/razorpay/order` creates the Razorpay order on the server; `POST /api/razorpay/verify` checks the payment signature.
3. Completed store orders are kept in this browser (`pm-catalogue-orders`) and shown under My Orders. Add a Razorpay webhook and a database before going live so orders are not lost if the browser closes after payment.
4. Bomb Deal prices are decided in the browser, so the server only accepts a price between the listed price and 40% off.
