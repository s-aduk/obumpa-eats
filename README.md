# Obumpa Eats — Heritage Refined

Obumpa Eats is a premium Ghanaian fine-dining web application that reimagines traditional heritage dishes through the lens of modern luxury. This platform offers a seamless digital experience for discerning food enthusiasts to explore an artisanal menu, make refined reservations, and order their favorite heritage-inspired meals.

![Obumpa Eats Hero](https://images.unsplash.com/photo-1545093149-618ce3bcf49d?q=80&w=1200&auto=format&fit=crop)

## 🌟 Features

- **Artisanal Menu**: A curated selection of Ghanaian classics elevated with premium ingredients (e.g., Jollof Royale with Wagyu, Spiced Kelewele Glacé).
- **Luxury Reservations**: A sophisticated booking system for intimate dinners or cultural celebrations (Traditional Weddings, Naming Ceremonies).
- **Secure Ordering & Checkout**: Integrated with Stripe for seamless, secure transactions.
- **Modern Minimalist UI**: Built with a "technical-luxury" aesthetic using Tailwind CSS and Framer Motion for smooth, cinematic transitions.
- **Responsive Design**: Fully optimized for a premium experience across mobile, tablet, and desktop.
- **Firebase Integration**: Real-time data management for reservations and user orders.

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS (Native `@theme` configuration)
- **Animation**: Framer Motion
- **Backend**: Express (Custom Full-Stack Setup)
- **Database/Auth**: Firebase (Firestore & Firebase Auth)
- **Payments**: Stripe SDK
- **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Stripe Account (for API keys)
- A Firebase Project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/obumpa-eats.git
   cd obumpa-eats
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your credentials (see `.env.example`):
   ```env
   # Stripe
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...

   # Firebase (Values from your firebase-applet-config.json)
   # Usually handled via firebase-applet-config.json in the AI Studio environment
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## 📂 Project Structure

- `/src/components`: Reusable UI components and page sections.
- `/src/pages`: Main application routes (Home, Menu, Reservations, Cart).
- `/src/context`: Cart and Auth state management.
- `/server.ts`: Express backend handling Stripe PaymentIntents.
- `/src/constants.ts`: Centralized menu data and site configuration.

## 📜 License

This project is licensed under the MIT License.

---

*Designed and Developed by **Stephen Adu Kwarteng***.  
*Crafted with passion by the Obumpa Eats Luxury Group.*
