# Royal Prince Fashion Feature List

This document lists the main features currently implemented in the project.

## Storefront

- Mobile-first fashion storefront UI
- Desktop shell with sticky header and responsive content area
- Category quick hub on the home page
- Category browsing pages for dresses, two-pieces, shoes, Accessories, and Casuals
- All-products browsing page with filters and sorting
- Product detail pages with image gallery and share actions
- Product reviews page for each product
- Daily promo carousel
- Color-of-the-day shopping section
- Wishlist support
- Shopping bag / cart indicator and floating cart shortcut

## Product Catalog

- Seeded catalog data for preview products
- 70-preview-product catalog coverage per category
- Jewelry category support with its own category icon and seeded products
- Product cards with price, compare-at price, rating, and discount display
- Product tags such as New Arrival, Best Seller, Trending, and Gift Ready
- Variant support for sizes and colors
- Product gallery image normalization for consistent previews

## Search

- Text search across product names, categories, tags, and related text
- Search results page with query-based ranking
- Filterable search results with category, size, color, price, and sort options
- Image upload search entry point
- Hybrid image search ranking pipeline
- CLIP-based vector-search scaffold for Firestore
- Gemini-backed image search fallback and ranking refinement
- Local visual fallback search for when model ranking is unavailable

## Cart and Checkout

- Add-to-cart flow from product pages
- Cart quantity updates and item removal
- Voucher application in the cart
- Checkout page with bag preview
- Payment processing screen
- Payment success screen
- Guest checkout support
- Shared bag / encoded cart flow for compact checkout payloads

## Authentication

- Sign-in page
- Registration page
- PIN verification page
- Forgot password page
- Protected routes for signed-in users

## Account Area

- Profile page
- Edit profile page
- Order history page
- Order tracking page
- Wishlist page
- Write review flow after purchases
- Review completion confirmation page
- Activity page

## Settings

- General settings page
- Shipping address management
- Shipping address editor
- Size preferences page
- Currency preferences page
- Language preferences page
- Country preferences page
- Vouchers page
- Rewards page
- About page

## Support

- Chat support page
- WhatsApp floating action button

## Admin Panel

- Local admin password gate
- Admin catalog panel
- Overview tab
- Analytics tab
- Products tab
- Categories tab
- Vouchers tab
- New arrivals curation tab
- Reviews moderation tab
- Firestore-backed admin data synchronization
- Product create/edit/archive flows
- Category create/edit/archive flows
- Voucher create/edit/archive flows
- Color schedule editing
- Review deletion
- Category image uploads from device storage
- Product image uploads from device storage

## Data and Firebase

- Firebase Authentication
- Firestore-backed user profile and app data
- Firestore-backed cart, wishlist, orders, shipping addresses, reviews, vouchers, categories, products, and color schedule
- Firebase Storage-backed catalog media uploads
- Firestore security rules for authenticated admin writes
- Firestore vector index scaffold for embedding search
- Cloud Functions scaffold for CLIP image embedding search

## Sharing and Preview

- Shareable product URLs
- Server-rendered Open Graph metadata for shared product links
- WhatsApp, iMessage, and X preview support

## App Shell and Navigation

- Bottom navigation on primary store pages
- Desktop navigation bar
- Sticky mobile headers
- Back button patterns across inner pages
- Automatic wildcard redirect back to the home page

## Developer and Deployment Tooling

- Vite-based frontend build
- TypeScript project setup
- Firebase deploy configuration
- Render preview server configuration
- Admin claim utility script
- One-time catalog embedding script for vector search backfill
