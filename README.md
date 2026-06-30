# Royal Prince Fashion

Royal Prince Fashion is a fashion storefront prototype built with React, Vite, TypeScript, Tailwind CSS, and Firebase.

## What is wired up

- Firebase Auth for sign-in and registration
- Firestore-backed user profile, settings, cart, wishlist, orders, shipping addresses, and reviews
- Guest checkout that can complete the demo flow without sign-in
- Firebase Storage-backed catalog image uploads from the admin panel
- Responsive storefront UI with mobile-first navigation
- Demo checkout flow that records an order locally in Firestore-backed user data

## Run locally

1. Install dependencies:
   `npm install`
2. Start the app:
   `npm run dev`
3. Open `http://localhost:3000`

## Environment

The app uses Firebase directly in `src/lib/firebase.ts`.

If you want to swap in your own Firebase project, update the config in that file and make sure Firestore is enabled.

## Build

Create a production build with:

`npm run build`

## Share preview server

To serve product URLs with server-rendered Open Graph tags for WhatsApp, iMessage, and X:

1. Build the app:
   `npm run build`
2. Start the preview server:
   `npm run server`
3. Share product links in the form `https://your-domain.com/product/<product-id>?share=1`

The server injects product-specific `og:image`, `og:title`, and `twitter:image` tags for `/product/:id?share=1`.

## Live deploy path

The repo includes [`render.yaml`](C:/Users/HP/Desktop/edge/Fab%20-%20Copy/render.yaml) for deploying the share-preview server on Render.

Set `APP_URL` in Render to the public base URL of the service, then the shared product links will resolve with the correct metadata.

## Firebase deploy

The repo now includes a minimal `firebase.json` so the standard Firebase CLI picks up Firestore and Storage rules together:

`firebase deploy --only firestore,storage`

If you also want hosting:

`firebase deploy --only hosting,firestore,storage`

## Vector image search

The repo now includes a Cloud Functions scaffold for CLIP-based catalog search plus a Firestore vector index:

1. Install dependencies inside the functions workspace:
   `npm install --prefix functions`
2. Backfill embeddings for existing products:
   `npm run embed:catalog`
3. Deploy functions and the Firestore vector index:
   `firebase deploy --only functions,firestore:indexes`

The callable function lives in [`functions/src/index.ts`](C:/Users/HP/Desktop/edge/Fab%20-%20Copy/functions/src/index.ts) and the one-time backfill script lives in [`functions/scripts/embed-catalog-products.ts`](C:/Users/HP/Desktop/edge/Fab%20-%20Copy/functions/scripts/embed-catalog-products.ts).

## Admin claims

To grant the Firestore admin claim required by the catalog panel:

1. Set `FIREBASE_SERVICE_ACCOUNT_JSON` or `GOOGLE_APPLICATION_CREDENTIALS` in your environment.
2. Run:

   `npm run grant-admin -- --email admin@example.com`

   or:

   `npm run grant-admin -- --uid FIREBASE_UID`

Use `--revoke` with the same command to remove the claim.

## Notes

- Checkout is a polished demo flow right now, not a live Paystack integration.
- Product data is still seeded from local catalog data for the prototype.
- Firestore security rules allow catalog reads and restrict writes to authenticated admins with the `admin` custom claim.
- Storage rules allow public reads of catalog assets and restrict writes to authenticated admins with the `admin` custom claim.
