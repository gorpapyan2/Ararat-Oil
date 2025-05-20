# Fuel Station Management System

A comprehensive application for managing fuel stations, tracking sales, inventory, expenses, and more.

## Features

The application has been refactored to use a feature-based architecture, with the following key features:

- **Filling Systems Management**: Track and manage fuel dispensers
- **Fuel Supplies Management**: Record and monitor fuel deliveries
- **Sales Management**: Record and track fuel sales
- **Expenses Management**: Track and categorize expenses
- **Tanks Management**: Monitor fuel levels and capacity
- **Reports**: Generate comprehensive business reports

## Feature-Based Architecture

The application has been migrated to a feature-based architecture for better code organization and maintainability:

```
src/
├── features/
│   ├── filling-systems/
│   ├── fuel-supplies/
│   ├── sales/
│   ├── tanks/
│   └── ...
├── core/
│   ├── api/
│   ├── components/
│   └── ...
└── ...
```

Each feature is isolated and contains:

- **Components**: UI components specific to the feature
- **Hooks**: Custom React hooks for data fetching and state management
- **Services**: API service functions
- **Types**: TypeScript interfaces and types
- **Utils**: Utility functions

## Recent Progress

- Migrated filling-systems and fuel-supplies to the feature-based architecture
- Created documentation for features in the `docs/features` directory
- Implemented React Query hooks for data fetching and mutations
- Added support for exporting data in CSV format

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Radix UI, React Query
- **Backend**: Supabase Edge Functions, PostgreSQL
- **Infrastructure**: Vercel, Supabase

## Documentation

See the `docs/` directory for detailed feature documentation.

## Project info

**URL**: https://lovable.dev/projects/be0de8e1-174f-4085-832e-d3ad4ee0431c

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/be0de8e1-174f-4085-832e-d3ad4ee0431c) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

---

## Business Logic & Architecture

### Overview
This application is a comprehensive management system for fuel stations (or similar businesses), handling employees, inventory, fuel supplies, tanks, sales, expenses, transactions, financials, and provider management. It uses Supabase as a backend (database and API), React (with Vite) for the frontend, and TypeScript throughout.

### Key Business Domains
- **Employees:** Manage employee records, statuses, and references in other workflows.
- **Expenses:** Track and categorize business expenses, including payment status.
- **Filling Systems:** Manage fuel dispensing systems and their associated tanks.
- **Fuel Supplies:** Record deliveries from providers to tanks, update tank levels, and trigger financial transactions.
- **Tanks:** Manage fuel tank data, update levels, and track historical changes.
- **Sales:** Record and track fuel sales, including meter readings and payment status.
- **Inventory:** Track inventory items and reconcile with tank data.
- **Transactions:** Central ledger for all financial operations, linking to sales, expenses, and supplies.
- **Financials:** Generate profit and loss summaries.
- **Petrol Providers:** Manage provider details and integrate with fuel supply records.

### Example Business Workflows
- **Fuel Supply Delivery:** Record delivery, update tank, create supply and transaction records.
- **Sale at the Pump:** Record sale, update tank and sales records, create transaction.
- **Expense Recording:** Record business expense, update expenses, create transaction if needed.
- **Reporting:** View profit/loss, inventory, sales, and transaction logs.

### Technical Architecture
- **Frontend:** React + TypeScript, modularized into pages, components, and hooks.
- **Backend:** Supabase (PostgreSQL + API).
- **Styling/UI:** Tailwind CSS, shadcn-ui.
- **API Layer:** Centralized in `src/services`, with each business domain having its own service file.

This modular architecture ensures maintainability, extensibility, and a clear separation of concerns for developers and stakeholders.

## Shift Management

The application includes a comprehensive shift management system that allows employees to:

1. Start a shift with an opening cash amount
2. Track sales during the shift
3. Close a shift with detailed payment method information
4. View shift history and sales breakdown

### Multi-Payment Method Support

When closing a shift, employees can specify:
- Different payment methods (cash, card, bank transfer, mobile payment)
- Amount for each payment method
- Reference/transaction numbers for non-cash payments
- Notes for cash payments

The system automatically calculates the total and ensures it matches the sales total for the shift. This detailed payment breakdown is stored and can be viewed in the shift history, allowing for better financial tracking and reconciliation.

### Database Migration

Before using the payment method tracking feature, the `shift_payment_methods` table needs to be created in the database. A migration script is provided in `src/migrations/shift_payment_methods.sql`.

## Development Tools

### Hook Standardization

To maintain consistent React Query hook patterns across the codebase, use these tools:

#### Verify Hook Standards

Analyzes all hooks for compliance with standardization rules defined in `docs/refactoring/hook-standardization-guide.md`.

```bash
npm run verify-hooks
```

This command:
- Scans all hooks in the `src/features/*/hooks` directories
- Checks for consistent query key formats, TypeScript generics, staleTime configuration, etc.
- Generates a report of issues found by feature and rule type
- Saves results to `hook-standards-report.json`

#### Generate Standardized Hook

Creates new hook files following the standardized patterns.

```bash
npm run generate-hook <feature-name> <hook-name>
```

Example:
```bash
npm run generate-hook filling-systems useFillingSystem
```

This creates:
- `src/features/filling-systems/hooks/useFillingSystem.ts` with the standard hook patterns
- `src/features/filling-systems/hooks/__tests__/useFillingSystem.test.ts` with tests

The generated files include:
- Proper TypeScript generics
- Consistent query key formats
- StaleTime configurations
- Combined loading/error states
- Consistent return structures

To overwrite existing files, use:
```bash
OVERWRITE=true npm run generate-hook filling-systems useFillingSystem
```