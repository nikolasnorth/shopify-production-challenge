# Shopify Production Intern Challenge

## Introduction

This project is for the Fall 2022 Shopify Production Engineer Intern Challenge. It is an inventory tracking web
application capable of performing the functional requirements listed below.

## Project Layout

This application was built with the [Next.js](https://nextjs.org/) framework. Therefore, files inside the `pages/api`
folder are mapped to `/api/*` REST endpoints. For example, the HTTP handler in `pages/api/v1/items/[id].ts` maps
to `/api/v1/items/{id}`. The HTTP handler in `pages/api/v1/items/index.ts` maps to `/api/v1/items`. The code for each
HTTP handler can be seen in `pages/api`.

The application talks to an [SQLite](https://www.sqlite.org/index.html) database on the backend. The database file
is `prisma/dev.db`. HTTP handlers call functions inside of `repo/db` to perform database operations.

Similarly, on the frontend, Next.js maps React components in `pages/` to webpages, excluding files in `/pages/api`. For
example, `pages/index.tsx` maps to the root index, `/`. The component inside of `pages/items/edit/[id].tsx` maps
to `/items/edit/{id}`, where `{id}` is a valid ID for an inventory item. React components inside of `pages/` call
functions inside of `repo/api` to perform HTTP requests to the backend.

## Functional Requirements and Instructions

- [x] **Create inventory items:**
    - From the index page, click on the *Create item* link.
- [x] **Edit inventory items:**
    - From the index page, click on the *Edit* link beside an item you want to edit.
- [x] **Delete inventory items:**
    - From the index page, click on the *Edit* link beside an item you want to delete.
    - On the edit page, click on the *Delete item* button.
- [x] **View a list of inventory items:**
    - The index page displays a list of all items.
- [x] **Each inventory item should be associated with a city where the item is stored:**
    - From the index page, a list of items are shown in addition to the city the item it is assigned.
    - When editing an item, you also have the ability to change its city.
- [x] **The list of items in the inventory must include the city and a simple textual description of the current
  weather:**
    - From the index page, the list of items contain their assigned city and the current weather for that city.
- [x] **Ability to create “shipments” and assign inventory to the shipment, and adjust inventory appropriately:**
    - From the index page, click on the *Create shipment* link.
    - Click on the plus button *[ + ]* beside any of the "Available items" to add it into the "Shipping Items" cart.
    - More than one item can be added to the cart. Once at least one item is added to the "Shipping Items" cart, click
      on the *Process Shipment* button.
    - Going back to the index page, the updated quantities are shown.

## View on Replit

I have deployed the application using Replit. You can view the live application
at: [https://shopify-production-challenge.nikolasnorth.repl.co](https://shopify-production-challenge.nikolasnorth.repl.co)

The repl can be found
at: [https://replit.com/@NikolasNorth/shopify-production-challenge](https://replit.com/@NikolasNorth/shopify-production-challenge)

API routes can be accessed under `/api/v1`.

## Local Setup Instructions

```bash
# Install application dependencies
npm install

# Delete existing database file (if it exists).
# This ensures primary key's for City records start from 1 when seed script is run again.
rm prisma/dev.db

# Create database and schema
npx prisma migrate dev

# Seed database
npx prisma db seed

# Build application
npm run build

# Launch application
npm run start
```

Open [localhost:3000](http://localhost:3000) to view the application.
