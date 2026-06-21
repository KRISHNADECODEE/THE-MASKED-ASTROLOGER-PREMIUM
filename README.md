# 🌌 The Masked Astrologer

A premium, full-stack Vedic astrology platform inspired by classical museum aesthetics. The website is styled around **The Masked Astrologer** brand sculpture, incorporating a curated warm-parchment color palette and integrating 12 classical clay relief zodiac sculptures across its interactive horoscopes and charts.

---

## 🎨 Design System & Aesthetics

The platform follows a premium, editorial design system modeled directly after natural stone and antique gold elements:

*   **Page Background**: Warm Alabaster Parchment (`#FAF5ED` / `var(--color-parchment)`)
*   **Card Surfaces**: Ivory Stone (`#F4EFE6` / `var(--color-ivory)`)
*   **Main Typography**: Deep Bronze Charcoal (`#2D2926` / `var(--color-midnight)`)
*   **Primary Highlights & CTAs**: Patina Gold (`#D1A86E` / `var(--color-gold)`)
*   **Secondary Accents**: Rose Terracotta Sandstone (`#C48A69` / `var(--color-saffron)`)
*   **Borders & Dividers**: Celestial Sage Slate (`#98B2C1` / `var(--color-maroon)`)

### ✒️ Typography
*   **Display Headers**: *Fondamento* (Google Font)
*   **Body & Labels**: *Jost* (Google Font)
*   **Data & Tables**: *JetBrains Mono* (Google Font)

---

## 🌟 Core Features

### 1. Dynamic Zodiac Relief Integration
Generates personalized Vedic birth charts that dynamically display the 12 classical clay relief zodiac sculptures based on the user's Sun, Moon, and Ascendant signs.

### 2. North Indian Lagna (D1) SVG Chart
Renders responsive, vector-based Lagna charts showing planetary placements (retrogrades marked with `ᴿ`) and color-coded planet legends using standard astronomical color palettes.

### 3. Vimshottari Dasha Timeline
Displays interactive life-period timelines showing active planetary periods (Mahadashas), rashi percentages, and progress markers.

### 4. Energized Product Store
A fully styled e-commerce storefront containing catalog filters (Gemstones, Rudraksha, Yantras, Books) and a simulated checkout flow including shipping/GST calculations and secure order validation.

### 5. Street Dog Donation Transparency Log
A custom transparency dashboard where users can pledge blankets, food, or collars. Pledges are registered in a public ledger with links to delivery photo-proofs, promoting trust and community impact.

### 6. Consultation Booking Scheduler
Allows users to schedule 1:1 sessions (30m or 60m) with preferred slots, automatic Zoom link generation, and mock payment options.

### 7. Enrolled Courses Player
Syllabus overview and interactive video player containing progress checkboxes, lecture notes, and downloadable PDF worksheets.

### 8. Account Dashboard
A secure dashboard holding saved birth charts, previous orders, upcoming appointments, and course progress bars, secured by a mock OTP auth portal.

---

## 🛠️ Technology Stack

*   **Framework**: Next.js (App Router, React 19, TypeScript)
*   **Styles**: Tailwind CSS + Custom CSS Theme Tokens
*   **Icons**: Lucide React
*   **Notifications**: React Hot Toast
*   **Build Tool**: Turbopack (`next dev --turbo`)

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org) (v18.x or later)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/srdgauniyal/the_masked_masked_astrologer.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the local site.

### Build and Deploy
To create an optimized production bundle:
```bash
npm run build
```
This compile checks TypeScript, optimizes static paths, and configures static assets.
