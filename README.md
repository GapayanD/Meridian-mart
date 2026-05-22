# Meridian Mart

> A mobile-first e-commerce marketplace built with React 19, TypeScript, Supabase, and Tailwind CSS 4. Features a full storefront with order tracking, admin panel, and server-side order validation via Supabase Edge Functions.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Edge Function Deployment](#edge-function-deployment)
- [Admin Setup](#admin-setup)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Storefront
- **Animated hero banner** with auto-rotating slides
- **Category grid** with icon-based navigation
- **Flash Sale section** with live countdown timer
- **Product cards** with hover animations (Framer Motion & Motion)
- **Full product detail page** with image gallery, variant selector, and quantity picker
- **Advanced search** across product names and descriptions
- **Category filtering** with skeleton loading states
- **Wishlist page** with context-based state management
- **Guest profile page** with order history
- **Image optimization** with fallback support
- **Offline banner** for offline mode awareness
- **SEO-optimized pages** with dynamic title and meta tags

### Cart & Checkout
- **Persistent cart** via `localStorage` (with Safari private mode fallback)
- **Multi-variant item support** — same product with different options stored separately
- **Three delivery options** — Standard, Express, Free Shipping
- **Client-side form validation** (name, email, phone, address)
- **XSS-safe input sanitization** before submission
- **Cash on Delivery (COD)** order flow
- **Order submission** via Supabase Edge Function with **server-side price recalculation** — clients cannot spoof totals
- **Toast notifications** for user feedback (success, error, warning, info)

### Order Management
- **Order history tracking** — view all past orders with status
- **Order detail pages** — full breakdown of items, pricing, and delivery info
- **Order status updates** — track shipment progress in real-time
- **Local order persistence** — orders stored in localStorage for offline access

### Admin Panel
- **Supabase Auth–protected login** (admin role verified against `admin_users` table)
- **Orders dashboard** — search, filter by status, update order status inline
- **Order detail modal** — full customer and item breakdown
- **Products dashboard** — add, edit, hide/show, delete products
- **Variant builder** for product options
- **Image URL preview** during product creation

### Error Handling & UX
- **Error boundaries** — catch React errors and display recovery UI
- **Graceful fallbacks** for failed image loads
- **Skeleton loading states** for better perceived performance
- **Animated transitions** between pages and modals
- **Smooth fade-in effects** for content loading

### Security
- **Prices ignored from client payload** — Edge Function fetches them from the database
- **All user inputs sanitized** (HTML tag stripping) before insertion
- **Row Level Security (RLS)** on all Supabase tables
- **Admin access double-checked** server-side on every session

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS 4 (Vite plugin) |
| Animation | Motion + Framer Motion |
| Routing | React Router DOM v7 |
| Backend | Supabase (Postgres, Auth, Edge Functions) |
| State Management | React Context (Cart, Order, Wishlist, Toast) |
| Icons | Lucide React |
| Utilities | clsx, tailwind-merge |
| SEO | React Helmet Async |

---

## Prerequisites

- **Node.js** v20 or higher
- **npm** v9 or higher
- A **Supabase** project (free tier works fine)
- Supabase CLI (only needed for Edge Function deployment)

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/GapayanD/meridian-mart.git
cd meridian-mart
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in your Supabase credentials (see [Environment Variables](#environment-variables)).

### 4. Set up the database

Run the migration SQL in your Supabase project (see [Database Setup](#database-setup)).

### 5. Start the dev server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env.local` file in the project root. **Never commit this file — it is gitignored.**

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | Supabase Dashboard → Project Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Dashboard → Project Settings → API → `anon` `public` key |

> **Without these variables the app runs in demo mode** using local mock data. The cart, search, and navigation all work, but orders cannot be saved and the admin panel is non-functional.

---

## Database Setup

1. Open your Supabase project dashboard.
2. Go to **SQL Editor → New Query**.
3. Paste the entire contents of `supabase/migrations/001_schema.sql` and click **Run**.

This creates:

- `products` — authoritative product catalogue with pricing
- `orders` — customer orders written by the Edge Function
- `admin_users` — allow-list that maps Supabase Auth UIDs to admin access
- Row Level Security policies on all three tables
- `is_admin()` helper function used by RLS policies
- Auto-updating `updated_at` triggers

---

## Edge Function Deployment

The order validation logic runs as a Supabase Edge Function so that prices are always fetched from the database — the client payload is never trusted for totals.

```bash
# Install the Supabase CLI if you haven't already
npm install -g supabase

# Log in
supabase login

# Link to your project (find the project ref in your dashboard URL)
supabase link --project-ref your-project-ref

# Deploy the function
supabase functions deploy validate-order
```

The function source lives at `supabase/functions/validate-order/index.ts`.

---

## Admin Setup

After running the schema migration:

1. In the Supabase Dashboard go to **Authentication → Users → Add User** and create a user with an email and password.
2. Copy the UUID shown for that user.
3. In **SQL Editor** run:

```sql
INSERT INTO public.admin_users (id, email)
VALUES ('paste-uuid-here', 'admin@yourdomain.com');
```

4. Visit `/admin/login` in the app and sign in with those credentials.

---

## Project Structure

```
meridian-mart/
├── public/
├── src/
│   ├── components/
│   │   ├── Banner.tsx              # Auto-rotating hero slider
│   │   ├── CategoryGrid.tsx        # Icon category navigation
│   │   ├── ErrorBoundary.tsx       # React error boundary with recovery UI
│   │   ├── FadeIn.tsx              # Fade-in animation wrapper
│   │   ├── Header.tsx              # Sticky nav with search
│   │   ├── ImageWithFallback.tsx   # Image component with fallback support
│   │   ├── Layout.tsx              # Page wrapper + footer
│   │   ├── MobileNav.tsx           # Bottom tab bar (mobile)
│   │   ├── OfflineBanner.tsx       # Offline mode indicator
│   │   ├── ProductCard.tsx         # Card with add-to-cart
│   │   ├── SEO.tsx                 # Dynamic title and meta tags
│   │   └── SkeletonCard.tsx        # Loading skeleton for products
│   ├── context/
│   │   ├── CartContext.tsx         # Cart state + localStorage persistence
│   │   ├── OrderContext.tsx        # Order history management
│   │   ├── ToastContext.tsx        # Toast notifications (success, error, warning, info)
│   │   └── WishlistContext.tsx     # Wishlist state management
│   ├── data/
│   │   └── mock.ts                 # Fallback data used when Supabase is not configured
│   ├── hooks/
│   │   └── useProducts.ts          # Supabase product fetching hooks
│   ├── lib/
│   │   ├── supabase.ts             # Supabase client initialisation
│   │   └── utils.ts                # cn(), formatCurrency(), validators, sanitizeInput()
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AdminLayout.tsx     # Auth guard + sidebar layout
│   │   │   ├── AdminLogin.tsx      # Email/password login form
│   │   │   ├── AdminOrders.tsx     # Orders table + status management
│   │   │   └── AdminProducts.tsx   # Product CRUD
│   │   ├── Cart.tsx                # Cart review + checkout form
│   │   ├── CategoryDetail.tsx      # Filtered product grid + sidebar filters
│   │   ├── Home.tsx                # Landing page
│   │   ├── OrderDetail.tsx         # Single order detail view
│   │   ├── OrderHistory.tsx        # Past orders list
│   │   ├── ProductDetail.tsx       # Image gallery + variant picker
│   │   ├── Profile.tsx             # Guest profile with order history
│   │   └── Wishlist.tsx            # Wishlist page
│   ├── types/
│   │   └── index.ts                # Shared TypeScript interfaces (Product, CartItem, Order)
│   ├── App.tsx                     # Router + provider setup
│   ├── index.css                   # Tailwind imports + CSS custom properties
│   └── main.tsx                    # React DOM entry point
├── supabase/
│   ├── functions/
│   │   └── validate-order/
│   │       └── index.ts            # Deno Edge Function — server-side order validation
│   └── migrations/
│       └── 001_schema.sql          # Full database schema + RLS policies
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Remove the `dist/` directory |

---

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## License

Licensed under the **Apache License 2.0**. See [LICENSE](./LICENSE) for full terms.

© 2026 GapayanD
