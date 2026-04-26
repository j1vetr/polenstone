# Polen Stone E-Commerce Platform

## Overview
Polen Stone (Polen Stone Doğal Taş & Mermer) is a full-stack e-commerce platform for natural stone and marble products in the Turkish market. Customers browse marble, granite, travertine, and onyx categories, request samples, and place orders; administrators manage products, categories, and orders. The brand identity centers on Turkish stone craftsmanship, with a warm cream/stone palette and a terracotta-orange accent.

## User Preferences
Preferred communication style: Simple, everyday language.

## Brand & Theme
- **Brand**: Polen Stone Doğal Taş & Mermer
- **Domain**: polenstone.com.tr · **Email**: info@polenstone.com.tr · **Instagram**: @polenstone
- **Logo**: Text wordmark "POLEN STONE" (orange "STONE"). User will upload a custom logo asset later.
- **Color tokens** (in `client/src/index.css`):
  - `--polen-orange` — terracotta accent
  - `--polen-stone` — deep stone gray
  - `--polen-cream` — warm off-white background
- **Typography**: Existing display font kept; orange accent reserved for stroke headlines and brand wordmark.

## System Architecture

### Core Technologies
- **Frontend**: React 18 + TypeScript, Wouter routing, TanStack React Query, Tailwind CSS with shadcn/ui (New York style), Framer Motion, Vite.
- **Backend**: Node.js + Express, TypeScript, JWT auth (HttpOnly cookies + refresh token rotation), bcrypt, esbuild.
- **Database**: PostgreSQL with Drizzle ORM and Drizzle Kit.
- **UI/UX**: Component-based, reusable UI elements. Admin panel at `/toov-admin`.

### Navigation
- Header navigation reads from the `menu_items` table (`/api/menu`). Default seeded items: Mermer (linked to the Mermer category), Granit, Traverten, Oniks (URL-based until categories are populated).
- A hardcoded fallback nav (Mermer / Granit / Traverten) renders only when `menu_items` is empty.
- Categories table contains a primary "Mermer" category (display_order 0). Legacy fitness categories are retained at `display_order` 100+ for safe rollback but are not surfaced in the UI.

### Key Features
- **Authentication**: JWT-based for customers and admins, with refresh token rotation and HttpOnly cookies.
- **Multi-Category Product Support**: Products can be assigned to multiple categories.
- **Stock Management**: Automatic stock reduction on orders, adjustments, and restoration on cancellation.
- **AI Product Description Generation**: OpenAI GPT-4o for stone-context product copy with HTML formatting.
- **Payment System**: PayTR integration for credit card payments with success/failure callbacks.
- **Invoice Integration**: Automatic invoice generation and submission to BizimHesap after successful payments.
- **Coupon System**: Percentage/fixed discounts, usage limits, validity periods.
- **Shipping**: Domestic and international shipping with server-side validation. Sample request flow surfaced on the homepage.
- **Email Notifications**: Database-configurable SMTP using Polen Stone-branded templates.
- **B2B Dealer & Quote System**: Dealer companies and quote workflow with stock deduction on acceptance.
- **Meta Pixel + CAPI Integration**: Server- and client-side e-commerce event tracking for Facebook advertising.
- **Google Merchant Center Feed**: Automated XML product feed.
- **AI Chatbot (Polen Stone Asistanı)**: Conversational AI tuned to the natural-stone domain (mermer/granit/traverten/oniks, sıcak/soğuk tonlar, damarlı/düz desenler) using product embeddings for semantic search.

## External Dependencies

### Database
- **PostgreSQL**: Main data store.

### Third-Party Services & APIs
- **OpenAI**: AI product descriptions and chatbot.
- **PayTR**: Payment gateway.
- **BizimHesap**: Invoice integration.
- **Facebook (Meta Pixel/CAPI)**: Advertising and event tracking.
- **Google Merchant Center**: Product feed submission.

### Libraries & Frameworks
- **shadcn/ui + Radix UI**: UI primitives.
- **TanStack React Query**: Data fetching and caching.
- **Framer Motion**: Animations.
- **Lucide React**: Icons.
- **Sharp**: Image optimization.

## Future Work
- Trendyol → Site product sync (deferred to a later phase).
- Replace text wordmark with user-supplied logo asset.
- Seed Granit / Traverten / Oniks categories with imagery and content once available.
