## Frontend
/src
  /app                      # App Router
    /(auth)                 # Auth group (Login/Register)
    /(storefront)           # Public facing pages
      /layout.tsx           # Netflix-style Nav & Footer
      /page.tsx             # Landing/Welcome Page
      /search/page.tsx      # Search Results
      /item/[id]/page.tsx   # Asset Detail Page
    /(admin)                # Protected Seller Dashboard
      /layout.tsx           # Sidebar Layout
      /dashboard/page.tsx   # Stats & Overview
      /inventory/page.tsx   # CRUD Management
      /leads/page.tsx       # User Inquiry Inbox
  /components
    /ui                     # Atomic components (Gold buttons, inputs)
    /netflix                # Row scroll, Hero video, Card hover
    /shared                 # Navbar, Footer, Lead Form Modal
  /lib
    /api                    # Axios/Fetch wrapper for NestJS
    /utils.ts               # Tailwind merge, formatting
  /styles
    /globals.css            # Gold & Black Theme Variables


## Backend
/src
  /modules
    /auth                   # JWT, Passport, Logic
    /products               # Asset Management (CRUD)
      /dto                  # Create/Update validation
      /entities             # Product & Group entities
      /products.service.ts
      /products.controller.ts
    /leads                  # Inquiry/Contact Logic
      /leads.service.ts
      /leads.controller.ts
    /upload                 # S3/Local Multer logic
  /common
    /decorators             # Custom decorators
    /interceptors           # Response transform
    /filters                # Global Error Handling
  /config                   # Database, AWS, JWT configs
  /main.ts                  # Bootstrap with Swagger
