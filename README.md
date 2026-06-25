# Merchora.shop 🛍️

Merchora.shop is a production-ready, highly aesthetic React e-commerce application architected as a **dual-sided marketplace**. It enforces complete separation of user roles (Buyers vs. Sellers) and capabilities, integrating persistent client-side state matching REST API integration specs.

## 🚀 Key Features

### 🔐 Multi-Role Authentication System
- **Inactivity Logouts:** Automatic watchdog logouts users after 10 minutes of idle inactivity using mouse/keyboard listeners.
- **Verification Timers:** Mock-verifies accounts upon signup with email notification popups.
- **JWT Refresh Simulation:** Secures session caches using secure browser spaces.
- **Double Registration Schemes:** Collects distinct buyer information (name, address, cards) and seller information (business name, Contact Phone, EIN, Routing targets).

### 🛒 Real-Time Cart Reconciliation
- **Deleted Items Check:** Automatically purges items from active buyer carts if the corresponding product is deleted or set to 'draft' by a merchant.
- **Price Shift Watcher:** Dynamically updates cart prices if the seller changes the item price, warning the user.
- **Inventory Caps:** Automatically checks stock, adjusting/capping the quantity and preventing checkout if items are sold out.

### 📊 Seller Console & Live Analytics
- **Interactive SVG Charts:** A pure responsive SVG line graph mapping month-on-month revenues, eliminating external package bloat.
- **Stock Warnings:** Visual warning highlights for products with inventory $\le 5$ units.
- **Order Manifest Tracker:** Enables managing customer order status (Pending → Processing → Shipped → Completed) and attaching carrier tracking numbers.
- **Payout Gateways:** Request net payouts (excludes 10% fee) straight to bank accounts with instantaneous approval logs.

---

## 🔑 Sandbox Credentials

To explore the dual interfaces immediately without completing registration, use these pre-filled credentials:

| Role | Username / Email | Password |
| :--- | :--- | :--- |
| **Buyer Profile** | `buyer@merchora.shop` | `password123` |
| **Seller Dashboard** | `seller@merchora.shop` | `password123` |

---

## 🛠️ File Structure

The project directory is structured as follows:

```text
Merchora/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   └── common/
│   │       ├── Header.jsx  # Autocomplete search, theme toggle, and menu dropdown
│   │       └── Footer.jsx  # Structured links and newsletter signups
│   ├── contexts/
│   │   ├── AuthContext.jsx # Registration, login, and inactivity session watchdogs
│   │   ├── CartContext.jsx # Cart modification and late-stage checkout caps
│   │   ├── OrderContext.jsx# Checkout actions, splits, and analytics fetches
│   │   └── ProductContext.jsx# Catalog querying and seller CRUDS
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx   # Auth form validations and sandbox bypass
│   │   │   └── RegisterPage.jsx# Role tabs, file uploads, and confirm dialogs
│   │   ├── buyer/
│   │   │   ├── HomePage.jsx    # Category grid sliders and promo banners
│   │   │   ├── CatalogPage.jsx # Filtering sidebar, sorting, and pagination
│   │   │   ├── ProductDetailPage.jsx # Thumb galleries, variants, reviews
│   │   │   ├── CartPage.jsx    # Cart manifests and promo vouchers
│   │   │   ├── CheckoutPage.jsx# Multi-step checkout with late stock guards
│   │   │   └── OrderHistoryPage.jsx # Order trackings and reorder button
│   │   └── seller/
│   │       ├── SellerDashboard.jsx  # Console layout, guards, and side navs
│   │       ├── DashboardOverview.jsx# SVG line graphs, alerts, best-sellers
│   │       ├── ProductManager.jsx   # Grid inventory tables and variant forms
│   │       ├── OrderManager.jsx     # Fulfill action forms and tracking tags
│   │       ├── Financials.jsx       # Balances sheets and ledger tables
│   │       └── ProfileSettings.jsx  # EIN, bank target targets, verification
│   ├── services/
│   │   └── mockDb.js       # Persistent local storage CRUD and analytics compiler
│   ├── styles/
│   │   └── variables.css   # Theme configurations (Resides in index.css)
│   ├── App.css             # Suppressed overrides
│   ├── index.css           # Premium global design system
│   ├── App.jsx             # Route guards and router paths
│   └── main.jsx            # DOM renderer hook
├── index.html              # SEO meta tags and link anchors
├── package.json            # Scripts and dependencies
└── vite.config.js          # Vite config
```

---

## ⚙️ Development Installation

To run this application locally, ensure you have **Node.js (v18+)** installed:

### 1. Extract and install dependencies
```bash
npm install
```

### 2. Launch the Vite hot-reloading dev server
```bash
npm run dev
```

The terminal will print out the local network address (typically `http://localhost:5173`). Open it in any browser.

### 3. Build for Production
To build static production files under the `dist/` directory, run:
```bash
npm run build
```

---

## 🛡️ Escrow & Security Specifications

1. **Escrow Guarantee:** Funds submitted by buyers are held securely. They are only marked as earnings for the seller once the shipping tracking status is verified.
2. **Auto-logout Safety:** Sensitive authorization tokens (simulating HttpOnly tokens in memory) are wiped on tab closes or after inactivity timeouts to protect shared workspace machines.
3. **Optimistic States:** All product additions and reviews update the local view instantly, falling back gracefully if underlying database requests fail.
