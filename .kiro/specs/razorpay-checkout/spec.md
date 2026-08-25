# Razorpay Standard Checkout — NutritionXP

## Overview
Integrate Razorpay Standard Checkout into the existing NutritionXP Express server so that both the cart checkout and the "Buy Now" flow collect real payment before an order is recorded in the database.

## Requirements

### R1 — Environment & Configuration
- A `.env` file stores `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (scaffolded with placeholder values).
- `dotenv` is loaded at the very top of `server.js` so all process.env reads are covered.
- The Razorpay Key ID is exposed to the frontend only via a dedicated endpoint (`GET /api/razorpay/config`) — never hardcoded in client HTML/JS.

### R2 — Backend: Create Razorpay Order
- `POST /api/razorpay/create-order` (requires login):
  - Accepts `{ amount, currency?, notes? }` in the request body.
  - Amount is in **paise** (INR × 100), minimum 100.
  - Creates a Razorpay Order via the Razorpay Orders API.
  - Returns `{ orderId, amount, currency, keyId }` to the client.

### R3 — Backend: Verify Payment Signature
- `POST /api/razorpay/verify` (requires login):
  - Accepts `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, orderPayload }`.
  - Verifies the HMAC-SHA256 signature using the Key Secret.
  - If valid: saves the order to the DB (delegates to existing `/api/checkout` or `/api/buy-now` logic), marks it paid, returns `{ success: true, order }`.
  - If invalid: returns HTTP 400 `{ success: false, message: 'Payment verification failed.' }`.

### R4 — Frontend: Checkout Flow Update
- The existing `checkout()` function in `script.js` is updated to:
  1. Call `POST /api/razorpay/create-order` with the cart total (in paise).
  2. Open the Razorpay Standard Checkout overlay using the returned `orderId` and `keyId`.
  3. On `handler` callback: POST to `/api/razorpay/verify` with the payment result + cart snapshot.
  4. On successful verification: clear cart locally, call `sendOrderEmail`, call `showNotification`.
  5. On failure: show a toast with the error message.
- The existing `buyNowFromDetail()` and `buyNow()` functions follow the same pattern (single-item amount).

### R5 — Frontend: Razorpay Script
- The Razorpay checkout script (`https://checkout.razorpay.com/v1/checkout.js`) is added to `index.html`, `index2.html`, and `index3.html`.

### R6 — Success Page
- A standalone `payment-success.html` page is created for redirect-based payment confirmation (used when `redirect: true` fallback is needed on mobile).
- It reads `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature` from the URL query string, POSTs to `/api/razorpay/verify`, and shows the order confirmation.

### R7 — Security
- Key Secret never leaves the server.
- All create-order and verify endpoints require an active session (`requireLogin`).
- Signature verification uses `crypto.createHmac` — no third-party HMAC library.
- Amount is re-validated server-side against the actual cart total to prevent tampering.
