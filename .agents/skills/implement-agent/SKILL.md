# Luxury Storefront + Admin System (Black & Gold)  
## Architecture + UX Flow Specification (Agent-Ready)

> **Goal:** Build a premium, cinematic storefront experience (similar to Netflix layout + luxury brand vibe like drmac.vn) with a scalable admin system for managing inventory and leads.

---

# 1. System Architecture Overview

## 1.1 High-Level Architecture

**Frontend (Storefront + Admin UI)**  
- **Framework:** Next.js 15 (App Router)
- **Rendering Strategy:** Server Components (SEO + performance)
- **Styling:** Tailwind CSS (Black & Gold theme)
- **Animation:** Framer Motion (Netflix-like motion & transitions)

**Backend (API Layer)**
- **Framework:** NestJS
- **Auth:** Passport.js + JWT
- **ORM:** TypeORM (preferred) or Prisma
- **File Upload:** Multer integration

**Database**
- PostgreSQL (structured, relational, strong filtering/searching support)

**Storage**
- AWS S3 for product images/videos + generated thumbnails

---

# 2. Core Modules & Responsibilities

## 2.1 Frontend Modules (Next.js)

### Storefront App
- Landing / Cinematic Homepage
- Category/Collection Browsing
- Search + Advanced Filtering
- Product Detail Page (Luxury deep dive)
- Lead Capture (Reserve / Consult)

### Admin App (Seller Control Center)
- Dashboard Overview
- Inventory CRUD
- Media Upload Management
- Collection Management
- Lead Inbox + Status Tracking

---

## 2.2 Backend Modules (NestJS)

### Auth Module
- Admin login
- JWT token generation
- Refresh token support (recommended)

### Inventory Module
- Product CRUD
- Category association
- Collection assignment
- Media linking

### Category Module (Hierarchical)
- Materialized Path strategy for performance

### Media Module
- Image upload endpoint
- Optimization + resizing
- Thumbnail generation
- S3 upload management

### Lead Module
- Capture inquiries from storefront
- Admin view + status workflow

---

# 3. Database Design Strategy (PostgreSQL)

## 3.1 Category Hierarchy (Materialized Path)

**Why:**  
Fast hierarchical queries like:
- "All MacBooks"
- "MacBook -> Air -> M3"
- "Everything under this category"

**Suggested Fields**
- `id`
- `name`
- `parentId`
- `path` (materialized path string like `1.5.22`)
- `level`
- `isActive`

**Indexes**
- `path` index (btree)
- `parentId` index

---

## 3.2 Product / Inventory Entity

**Key Fields**
- `id`
- `title`
- `slug`
- `description` (rich text)
- `price`
- `currency`
- `categoryId`
- `status` (in-stock, coming-soon, archived)
- `createdAt`
- `updatedAt`

---

## 3.3 Product Media Entity

**Key Fields**
- `id`
- `productId`
- `type` (image/video)
- `originalUrl`
- `thumbnailUrl`
- `displayOrder`
- `createdAt`

---

## 3.4 Collection Entity

**Purpose:**  
Collections drive Netflix-style horizontal rows on the landing page.

Example:
- "New Arrivals"
- "Exclusive Collections"
- "MacBook Gold Edition"

**Key Fields**
- `id`
- `name`
- `slug`
- `priority`
- `isFeatured`
- `createdAt`

**Join Table**
- `collection_products`
  - `collectionId`
  - `productId`
  - `displayOrder`

---

## 3.5 Lead Entity

**Key Fields**
- `id`
- `productId`
- `customerName`
- `phone`
- `note` (optional)
- `status` (NEW, CONTACTED, CLOSED)
- `createdAt`

**Indexes**
- `status`
- `productId`
- `createdAt`

---

# 4. Storefront UX Flow (Customer Journey)

## 4.1 Landing / Welcome Page (Cinematic Hook)

### Visual Design
- Full-screen **Hero Video** background
- Muted autoplay + loop
- Dark overlay with luxury gold CTA

### Layout Behavior
- Vertical scroll reveals sections
- Horizontal category rows (Netflix style)
- Snap-to-section scrolling for premium feel
- **Filtering**: State-based filtering using an activeCategory toggle.

### Product Card Features
- **Asset Area**: Light gray background, absolute-positioned badges (e.g., "POPULAR") and wishlist hearts.
- **Content Area**: Title, Star Rating, and "Pill" tags for technical specs (Chip/Storage).
- **Action Row**: "Starting at" price labels paired with a high-contrast black "Buy >" button.

### Personalization Feature
- **Recently Viewed** row (Netflix "Continue Watching" equivalent)
  - stored via cookie/localStorage/session

---

## 4.2 Search & Discovery (Fast Filter Experience)

### Search Bar Behavior
- Floating gold-bordered bar
- Expands on focus
- Always accessible while browsing

### Real-Time Search
- Quick Results dropdown
- Show thumbnail + name + price

### Advanced Filtering Panel
Slide-out sidebar (black translucent glass style):
- Price range slider (gold accent)
- Category/group selector (nested)
- Availability (in-stock / coming soon)

**Performance Requirement**
- API supports fast filtering using indexed fields + category path query.

---

## 4.3 Product Detail Page (Luxury Deep Dive)

### Layout Structure
- **60% left:** High-res gallery (carousel + zoom)
- **40% right:** Sticky product info

### Display Content
- Product title (bold)
- Price highlighted in gold
- Rich-text description
- Specs table (if applicable)
- Breadcrumb navigation (gold theme)

### Lead Conversion Hook
Instead of “Buy Now”:
- Primary CTA: **Consult an Expert**
- Secondary CTA: **Reserve Now**

Triggers a modal:
- Name input
- Phone input
- Submit lead

---

## 4.4 Mobile UX Requirements

- Sticky bottom CTA bar (Inquire / Reserve)
- Fullscreen image viewer with swipe
- Simplified filtering (drawer)

---

# 5. Admin Flow (Seller Control Center)

## 5.1 Admin Dashboard Overview

### Key Metrics
- Total leads
- Leads by status (NEW/CONTACTED/CLOSED)
- Most viewed products
- Inventory availability summary

### UI Theme
- Dark mode default
- Gold accents for KPI highlights

---

## 5.2 Inventory Management (Core Module)

### Product Creation UX
Multi-step wizard:
1. General Info  
2. Media Upload  
3. Technical Specs  
4. Review & Publish

### Media Upload UX
Drag-and-drop uploader:
- Multi-image support
- Sorting support (drag reorder)
- Preview thumbnails
- Validation rules (file type, size)

### Backend Requirements
- Resize + optimize before S3 upload
- Generate thumbnails automatically
- Store both original + thumbnail URLs

---

## 5.3 Collection Management (Netflix Rows)

Admin can:
- Create collections
- Assign products to collections
- Set ordering priority
- Control which collections appear on homepage

---

## 5.4 Lead Management (Inbox)

### Inbox View
Table/grid of inquiries:
- Customer name
- Phone
- Product name
- Date
- Status

### Status Workflow
- NEW → CONTACTED → CLOSED
- Quick inline status update

---

# 6. UI/UX Enhancements (Luxury Experience Requirements)

## 6.1 Skeleton Loading (Gold Shimmer)
- Use shimmer skeleton loading for:
  - Landing page rows
  - Search results
  - Product gallery

Creates perception of speed even with heavy assets.

---

## 6.2 Breadcrumb Navigation (Gold Hierarchy)
Example:
MacBook → Air → M3

Must reflect category tree using materialized path.

---

## 6.3 Motion Design Rules (Netflix Feel)
Framer Motion behaviors:
- Smooth row scrolling
- Hover zoom on cards
- Fade-in + slide-up reveal transitions
- Section snap animation on scroll

---

## 6.4 Sticky Lead Bar (Mobile)
Always show:
- “Consult Expert” button
- “Reserve Now” button

Fixed at bottom.

---

# 7. Storage & Media Strategy (AWS S3)

## 7.1 Upload Flow
1. User uploads file (admin UI)
2. Backend receives via Multer
3. Backend generates:
   - optimized main image
   - thumbnail image
4. Backend uploads to S3
5. DB stores URLs

---

## 7.2 Recommended S3 Folder Structure
- `products/original/{productId}/{uuid}.jpg`
- `products/optimized/{productId}/{uuid}.webp`
- `products/thumbnails/{productId}/{uuid}.webp`
- `products/videos/{productId}/{uuid}.mp4`

---

## 7.3 Image Optimization Rules
- Convert to WebP for optimized delivery
- Thumbnail size standardization (example: 400px width)
- Main preview optimized (example: 1200px width)
- Keep original for future edits

---

# 8. API Requirements (Backend Contract)

## 8.1 Public Storefront Endpoints
- `GET /collections/home`
- `GET /products?search=&category=&priceMin=&priceMax=&status=`
- `GET /products/:slug`
- `POST /leads` (submit inquiry)
- `GET /categories/tree`

---

## 8.2 Admin Endpoints (Protected)
- `POST /admin/auth/login`
- `POST /admin/products`
- `PUT /admin/products/:id`
- `DELETE /admin/products/:id`
- `POST /admin/products/:id/media`
- `POST /admin/collections`
- `PUT /admin/collections/:id`
- `GET /admin/leads`
- `PATCH /admin/leads/:id/status`

---

# 9. Performance & SEO Requirements

## 9.1 SEO Strategy
- Product pages must be Server Rendered (Next.js App Router)
- Metadata:
  - title
  - description
  - OpenGraph images
- Slug-based URLs for luxury feel:
  `/products/macbook-air-m3-gold-edition`

---

## 9.2 Query Optimization
- Category filtering must use materialized path
- Index frequently queried fields:
  - `product.status`
  - `product.categoryId`
  - `product.price`
  - `category.path`

---

## 9.3 Caching Recommendations
- Cache homepage collections
- Cache category tree
- CDN (CloudFront) for S3 assets

---

# 10. Final Design Principles (Black & Gold Luxury Rules)

## Visual Style
- Primary background: pure black / charcoal
- Accent: gold (#D4AF37)
- Glass effect panels (blur + opacity)
- Minimal UI, large spacing, premium typography

## Interaction Style
- Smooth motion
- No harsh transitions
- Fast skeleton loading
- Scroll snapping for cinematic browsing

---

# 11. Key Differentiators (Luxury Brand Feel)

- Cinematic hero video landing
- Netflix horizontal browsing rows
- Recently viewed personalization
- Modal-based lead conversion
- Premium admin workflow (multi-step forms)
- Materialized path category hierarchy for fast filtering

---

# 12. Implementation Notes (Agent Checklist)

## Frontend (Next.js)
- Use Server Components for SEO pages
- Use Client Components only for:
  - animations
  - search dropdown
  - filtering drawer
  - lead modal
- Implement skeleton shimmer loading

## Backend (NestJS)
- Strong validation layer (DTO + class-validator)
- Image optimization pipeline before S3
- Clean modular architecture (Inventory, Category, Media, Lead)

## Database
- Materialized path for categories
- Index all filtering columns
- Use join table for collection ordering

---

# End of Document