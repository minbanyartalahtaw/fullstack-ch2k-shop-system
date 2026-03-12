# ch2k Shop Management System

A comprehensive jewelry shop management system built with Next.js 15 for ch2k Shop, streamlining invoicing, order management, product catalog, and staff operations.

## Features

- **Invoice Management** — Create, view, and manage customer invoices with product details
- **Order Tracking** — Track order statuses (Pending / Completed / Not Order)
- **Product Catalog** — Manage product types and detailed specs (purity, weight, hand width, length)
- **Staff Management** — Role-based access for Staff and Manager roles
- **Analytics Dashboard** — Revenue and sales charts for managers
- **AI Chatbot** — Google Gemini-powered assistant for querying invoices, products, and revenue

## Tech Stack

- **Framework**: Next.js 15 (App Router, React 19, TypeScript)
- **Database**: PostgreSQL via Prisma 6 ORM
- **UI**: Radix UI + Tailwind CSS 4 + Shadcn UI
- **AI**: Vercel AI SDK 6 with Google Gemini (streaming)
- **Auth**: JWT (jose) in httpOnly cookie

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm
- PostgreSQL database

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ch2k-office
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL connection string and other required variables.

4. Apply database migrations:

```bash
npx prisma migrate dev
```

5. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

```bash
npm run dev        # Start dev server with Turbopack
npm run build      # Production build (runs prisma generate first)
npm run build_dev  # Dev build with Turbopack
npm start          # Start production server
npm run lint       # Run ESLint
```

## Database

```bash
npx prisma migrate dev   # Apply schema changes
npx prisma studio        # Open Prisma GUI
npx prisma generate      # Regenerate Prisma client
```

## Role-Based Access

| Role    | Access                                           |
| ------- | ------------------------------------------------ |
| STAFF   | Invoice creation, order management               |
| MANAGER | Full access: dashboard, staff, products, chatbot |

## Project Structure

```
src/app/
├── page.tsx              # Login page
├── action.ts             # Auth server actions
├── welcome/              # First-run admin creation
└── office/
    ├── manager/
    │   ├── dashboard/    # Analytics
    │   ├── manage-staff/ # Staff CRUD
    │   ├── productType/  # Product management
    │   └── chatbot/      # AI chat
    └── staff/
        └── invoice/
            ├── new/      # Create invoice
            ├── history/  # Invoice list with search
            ├── [invoiceId]/  # Invoice detail/edit
            └── order/    # Order status management
```
