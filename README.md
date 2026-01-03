# Checkout Page

A modern, responsive checkout page built with React, TypeScript, and Tailwind CSS.

## Technologies Used

- ⚡ Vite - Next Generation Frontend Tooling
- ⚛️ React 18 - A JavaScript library for building user interfaces
- 💅 Tailwind CSS - A utility-first CSS framework
- 📜 TypeScript - Type-safe JavaScript
- 🎨 shadcn/ui - Beautifully designed components

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repository-url>
   cd checkout-page
   2.Install dependencies
   npm install
   3.Start the development server
   npm run dev
   4.Open http://localhost:5173 to view it in your browser.

 ## 💰 Pricing Logic
Base Pricing
Ticket Cost: ₹1,000 per person
Life Jacket: ₹100 per person (mandatory)
GST: 18% on ticket cost only
Calculation Formula
Ticket Total = Number of Travelers × ₹1,000
GST = (Ticket Total × 18) / 100
Life Jacket Total = Number of Travelers × ₹100
Subtotal = Ticket Total + GST + Life Jacket Total
Final Amount = Subtotal - Discount (if any)
Example Calculation (2 travelers with no discount)
Ticket: 2 × ₹1,000 = ₹2,000
GST: (₹2,000 × 18%) = ₹360
Life Jackets: 2 × ₹100 = ₹200
Total: ₹2,000 + ₹360 + ₹200 = ₹2,560
