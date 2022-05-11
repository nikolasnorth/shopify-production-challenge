# Shopify Backend Intern Challenge

## Functional Requirements

- [x] Create inventory items.
- [x] Edit inventory items.
- [x] Delete inventory items.
- [x] View a list of inventory items.
- [x] Ability to create “shipments” and assign inventory to the shipment, and adjust inventory appropriately.

## Getting Started

First, run the development server:

```bash
# Install application dependencies
npm install

# Create SQLite database
npx prisma migrate dev

# Seed database
npx prisma db seed

# Build application
npm run build

# Launch application
npm run start
```

Open [https://shopify-backend-challenge.nikolasnorth.repl.co](https://shopify-backend-challenge.nikolasnorth.repl.co) to view the application.

API routes can be accessed under `/api`.
