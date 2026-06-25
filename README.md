# 🛍️ Merchora.shop — Premium Dual-Sided E-Commerce Marketplace

[![React](https://img.shields.io/badge/React-18.x-blue.svg?logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-fast.svg?logo=vite)](https://vitejs.dev/)
[![CSS](https://img.shields.io/badge/CSS-Vanilla%20HSL-purple.svg?logo=css3)](https://www.w3.org/TR/css-color-4/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

**Merchora.shop** is a production-ready, highly aesthetic, theme-adaptive React application architected as a **dual-sided marketplace**. It enforces complete separation of user roles (Buyers vs. Sellers) and capabilities, integrating dynamic multi-currency conversions, a secure escrow checkout system, and an interactive AI Shopping Assistant.

---

## 🚀 Key System Features

### 🔐 1. Multi-Role Authentication & Inactivity Protection
*   **Dual Portal Access:** Distinct registration schemes for Buyers (shipping address, checkout preferences) and Sellers (business name, Contact Phone, EIN, bank routing targets).
*   **Inactivity Watchdog:** Active mouse/keyboard listeners automatically trigger a secure logout after **10 minutes** of idle inactivity to protect shared terminals.
*   **Sandbox Quick Login:** Includes quick-bypass controls in development for instant testing of both roles.

### 🛒 2. Dynamic Real-Time Cart Reconciliation
*   **Deleted Items Check:** Automatically purges items from active buyer carts if a merchant deletes a product or sets it to 'draft'.
*   **Price Shift Watcher:** Monitors pricing adjustments; if a seller edits a product's price, the cart is dynamically recalculated, and the buyer is warned.
*   **Inventory Caps:** Validates stock levels in real time at checkout, capping the purchase quantity and preventing checkout if items are sold out.

### 📊 3. Seller Console & Financial Ledger
*   **Interactive SVG Charts:** Features a custom, lightweight, pure SVG line graph displaying monthly performance trends ($ / INR) without external dependency bloat.
*   **Inventory Health Monitor:** Triggers warning highlights for variants with stock levels $\le 5$ units.
*   **Order Manifest Tracker:** Enables updating sales fulfillment stages (Pending → Processing → Shipped → Completed) with carrier tracking codes.
*   **Escrow Payouts:** Calculates payout balances minus a flat **10% marketplace commission**. Permits instant payout requests to linked banking targets with real-time ledger updates.

### 🤖 4. Conversational AI Shopping Agent
*   **Catalog Query Parsing:** Searches the 100-item local database in real time to recommend products based on user prompts (e.g. *"show me shoes under $50"*).
*   **Interactive Product Cards:** Renders clickable deep-link product preview cards inside the chat bubble for instant navigation to product detail pages.
*   **E-Commerce QA:** Answers platform policy questions regarding escrow, refunds, commission fees, and shipping.

### 🌐 5. Global Policy Modals & Toast Alerts
*   **Cookie Consent Banner:** Elegant glassmorphic banner offering persistent cart consent options on first-visit.
*   **Global Modal Dispatcher:** Intercepts custom window events to serve accessible modal overlays for *Privacy Policy*, *Terms of Sale*, and *Contact Support tickets*.
*   **Toast Stack:** Custom context-driven, non-overlapping floating notifications replacing browser native alerts.

---

## 🔑 Sandbox Credentials

To explore both interfaces immediately without completing registration, use these pre-filled credentials:

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Buyer Profile** | `buyer@merchora.shop` | `password123` |
| **Seller Dashboard** | `seller@merchora.shop` | `password123` |

---

## 🛠️ Tech Stack & Architecture

*   **Framework**: React 18 with Vite.
*   **Styling**: 100% custom Vanilla CSS utilizing HSL color tokens for dark/light themes.
*   **Design Tokens**: Custom typeface scales (Outfit for display, Inter for body text) with responsive viewport break-points.
*   **Global Contexts**: Decoupled state management handled via 6 React Providers:
    1.  `AuthContext` — Authentication, session state, inactivity watchdog.
    2.  `CartContext` — Stock checking, coupon validation, price reconciliations.
    3.  `ProductContext` — Listing database updates, category queries.
    4.  `OrderContext` — Escrow holds, fulfillment status, payout requests.
    5.  `CurrencyContext` — Country-region mappings, dynamic exchange conversions.
    6.  `ToastContext` — Floating notification queue management.
*   **Mock Database Sync**: `mockDb.js` enforces persistence in browser `localStorage`. Includes an automatic seeder generating **100 products** across **10 departments** with high-resolution Unsplash visuals.

---

## 📁 File Structure

```text
Merchora/
├── public/                 # Static assets (custom logo.svg, icon.svg, favicon.svg)
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Header.jsx  # Adaptive search bar, multi-currency dropdown, cart badge
│   │       └── Footer.jsx  # Structured links and policy modal triggers
│   ├── contexts/
│   │   ├── AuthContext.jsx # Auth session and watchdog timers
│   │   ├── CartContext.jsx # Cart edits and stock constraints
│   │   ├── CurrencyContext.jsx # Conversions and region controls
│   │   ├── OrderContext.jsx# Escrow holds and analytics
│   │   ├── ProductContext.jsx# Listing operations
│   │   └── ToastContext.jsx# Toast notification stack
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx   # Form validation and sandbox bypass
│   │   │   └── RegisterPage.jsx# File upload validations and role tabs
│   │   ├── buyer/
│   │   │   ├── HomePage.jsx    # Promo hero carousels and category sliders
│   │   │   ├── CatalogPage.jsx # Multi-filter sidebar, paginated items
│   │   │   ├── ProductDetailPage.jsx # Image zoom, variants selector, review submissions
│   │   │   ├── CartPage.jsx    # Item summaries and coupon codes
│   │   │   ├── CheckoutPage.jsx# Escrow validation details
│   │   │   └── OrderHistoryPage.jsx # Fulfilled order logs and reorder buttons
│   │   └── seller/
│   │       ├── SellerDashboard.jsx  # Sidebar navigation and desktop layouts
│   │       ├── DashboardOverview.jsx# SVG line graphs and best-sellers
│   │       ├── ProductManager.jsx   # CRUD forms and SKU variant fields
│   │       ├── OrderManager.jsx     # Order manifests and tracking code inputs
│   │       ├── Financials.jsx       # Payout history ledgers and platform splits
│   │       └── ProfileSettings.jsx  # Business documents and verification uploads
│   ├── services/
│   │   └── mockDb.js       # Persistent browser database and analytics compiler
│   ├── index.css           # Global HSL system, variables, resets, and utility classes
│   ├── App.jsx             # Main routes definition and floating AI chat layout
│   └── main.jsx            # React root mount script
├── index.html              # Core HTML wrapper with SEO tags
├── package.json            # Scripts and dependencies
└── vite.config.js          # Vite config
```

---

## ⚙️ Development Installation

To run this application locally, ensure you have **Node.js (v18+)** installed:

### 1. Install dependencies
```bash
npm install
```

### 2. Launch Vite development server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
To bundle static, optimized production assets under the `dist/` directory, run:
```bash
npm run build
```

---

## 🛡️ Business Safeguards & Escrow Rules

1.  **Platform Split:** A flat 10.0% commission fee is applied on completed sales transactions to fund server infrastructure, secure escrow storage, and customer dispute resolution.
2.  **Payment Lock:** Customer checkouts are held securely in a pending escrow ledger. Payouts are only transferred to the merchant's net balance after they supply valid package shipping tracking information.
3.  **Automatic Inactivity Guard:** The system terminates active user sessions if there is no user input (clicks, keystrokes, movements) detected for 10 minutes to protect shared merchant workspaces.
