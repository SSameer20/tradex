## 📌 Objective

Build a **Crypto Portfolio Tracker** with mock trading functionality.  
Supported assets: **BTC, ETH, USDT, USDC, XMR, SOL**

---

## ✅ Deliverables

1. **Live Demo**

   - Deploy on **Vercel (free tier)**
   - Must be fully functional

2. **GitHub Repository**
   - Public repository with **clear commit history**
   - Include **README.md** with:
     - Setup instructions
     - Demo link
     - Architecture explanation

---

## 🚀 Core Features (Required)

### 1. Homepage

- Display **live crypto prices** (BTC, ETH, USDT, USDC, XMR, SOL)
- Prices fetched from **CoinGecko API** via server
- **Auto-refresh every 30 seconds**
- Show **24h price change**

### 2. Authentication & Navigation

- Use **NextAuth.js** for login/register
- Use **App Router** (Next.js latest)
- Navigation menu must include:
  - Home
  - Dashboard
  - Trade
  - Login/Register
- Protect `/dashboard` and `/trade` routes with authentication middleware

### 3. Portfolio Dashboard

- Each user starts with **$10,000 mock USD**
- Display:
  - Holdings
  - Total portfolio value
  - Profit/loss

### 4. Trading Page

- Enable **Buy/Sell** functionality
- Use **real-time price conversion**
- Update holdings after trade
- Show **last 10 trades per user**

### 5. Design

- **Dark/Light theme toggle** (using `next-themes`)
- **Mobile responsive** layout
- Professional UI (Tailwind + shadcn/ui recommended)
  -- Color recomendation not pure black for dark theme

---

## 🛠 Tech Requirements

- **Framework:** Next.js (latest, App Router)
- **Language:** TypeScript (preferred)
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS + next-themes
- **APIs:** CoinGecko (free API)
- **Deployment:** Vercel

---

## 🏗 Architecture

- Server fetches coin prices from CoinGecko every 30s
- Server provides cached data to client (avoid direct client -> API calls)
- Redis can be added later for caching (not needed in MVP)

---

## 🌟 Bonus Features (Choose 2–3)

- Real-time price updates (WebSockets)
- Order book visualization
- Price alerts
- Export trades to CSV
- 2FA simulation
- PWA functionality
- Test coverage

---

## 📤 Submission

Send an email within 72 hours with:

- Vercel deployment URL
- GitHub repository link
- Demo credentials (if applicable)
- Brief note on bonus features implemented

---

## 🧮 Evaluation Criteria

- **40%** – Code quality & architecture
- **20%** – UI/UX design
- **20%** – Feature completeness
- **20%** – Documentation & deployment

---

## ⚠️ Notes

- Use AI tools (Copilot, Cursor, v0.dev) if helpful
- Keep code **clean and working** over complex/unfinished features
- Commit progress regularly
- Test on **mobile devices** before submission

---

## 📋 Implementation Steps (for Guidance)

1. **Setup**

   - `npx create-next-app@latest --ts --app`
   - Add Tailwind + next-themes

2. **Authentication**

   - Configure NextAuth with credentials provider
   - Protect `/dashboard` and `/trade`

3. **Data Fetching**

   - Create server endpoint to fetch from CoinGecko every 30s
   - Return cached values to client

4. **UI**

   - Build navigation (Home, Dashboard, Trade, Login/Register)
   - Add dark/light toggle
   - Make mobile responsive

5. **Portfolio**

   - Initialize user with $10,000 USD
   - Show holdings, total value, P/L

6. **Trading**

   - Implement buy/sell logic
   - Update user holdings
   - Show last 10 trades

7. **Deployment**
   - Deploy to Vercel
   - Add env vars for NextAuth + API

---

## ❓ Questions

You may email for clarifications, but reasonable assumptions and decision-making are part of the assessment.
