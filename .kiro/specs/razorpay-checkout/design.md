# Design — Razorpay Standard Checkout

## Payment Flow

```
Browser                     Server                      Razorpay
  |                           |                             |
  |-- POST /api/razorpay/     |                             |
  |   create-order            |                             |
  |   { amount, currency }    |-- Razorpay Orders API ----->|
  |                           |<-- { id, amount, ... } -----|
  |<-- { orderId, keyId } ----|                             |
  |                           |                             |
  | [Razorpay overlay opens]  |                             |
  |-------- User pays ------->|                             |
  |                           |                             |
  |<-- handler callback ------|                             |
  |   { payment_id,           |                             |
  |     order_id, signature } |                             |
  |                           |                             |
  |-- POST /api/razorpay/     |                             |
  |   verify                  |                             |
  |   { payment_id, order_id, |                             |
  |     signature, payload }  |                             |
  |                           |-- HMAC verify (local) ----->|
  |                           |                             |
  |                           |-- INSERT orders (DB) ------>|
  |<-- { success, order } ----|                             |
  |                           |                             |
  | [showNotification()]      |                             |
```

## New Files
- `.env` — environment variables (Key ID + Secret placeholders)
- `payment-success.html` — standalone redirect success page

## Modified Files
- `server.js` — load dotenv, add 3 new routes
- `script.js` — rewrite `checkout()`, `buyNowFromDetail()`, `buyNow()`
- `index.html` — add Razorpay script tag
- `index2.html` — add Razorpay script tag
- `index3.html` — add Razorpay script tag
- `package.json` — add razorpay + dotenv dependencies

## Server Routes Added

| Method | Path | Auth | Purpose |
|--------|------|------|---------|
| GET | /api/razorpay/config | public | Return Key ID to client |
| POST | /api/razorpay/create-order | required | Create Razorpay Order |
| POST | /api/razorpay/verify | required | Verify signature + save order |

## Amount Validation
Server re-calculates expected amount from `cart_items` (or from the buy-now product price × quantity) and rejects if the client-submitted amount deviates by more than 1 paisa — prevents price manipulation.
