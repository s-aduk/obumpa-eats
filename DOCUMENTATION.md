# Obumpa Eats - Technical Documentation

## 1. Project Overview
**Obumpa Eats** is a high-end, premium restaurant web application designed to provide a luxury digital experience for a global clientele. The application follows a modern full-stack architecture, utilizing a React frontend and an Express/Node.js backend, designed with microservices scalability in mind.

---

## 2. Technical Stack
- **Frontend Framework**: React 19 (Vite 6)
- **Styling**: Tailwind CSS v4 (Standard for premium performance and artistic control)
- **Animations**: Framer Motion (for high-end micro-interactions and scroll triggers)
- **Icons**: Lucide React
- **Backend Runtime**: Node.js v22+
- **Server Framework**: Express.js
- **Routing**: React Router v7
- **Language**: TypeScript

---

## 3. Architecture Design
The project is structured to transition easily into a **Microservices Architecture**.

### Current Monolithic-to-Modular Pattern:
- **Client Side (SPA)**: Handles all UI/UX logic, state management, and routing.
- **Server Side (Gateway)**: An Express server acting as a gateway and static asset provider.
- **Service Modules (Planned)**:
  - **Menu Service**: Manages dish data, dietary info, and pricing.
  - **Reservation Service**: Handles table availability logic and booking confirmations.
  - **User/Auth Service**: Manages customer profiles and loyalty programs.
  - **Payment Service**: Integration with Stripe for secure transactions.

---

## 4. Design System (Obumpa Prestige)
The UI follows "Recipe 12: Luxury / Prestige" and "Recipe 4: Dark Luxury" principles:
- **Typography**: 
  - *Playfair Display*: For elegant, high-contrast headings.
  - *Inter*: For precision and readability in body text.
  - *Cinzel*: For branding accents.
- **Color Palette**:
  - `Charcoal (#121212)`: Deep base for luxury feel.
  - `Gold (#d4a517)`: Primary accent evoking wealth and quality.
  - `Cream (#f5f2ed)`: Soft contrast for text.
- **Key Visual Elements**:
  - Glassmorphism effects for floating containers.
  - Gold gradients for interactive triggers.
  - Desaturated/Grayscale imagery with hover reveals to maintain a sophisticated mood.

---

## 5. Feature Breakdown
1. **Premium Hero Section**: immersive visuals with scroll-triggered CTA.
2. **Digital Degustation (Menu)**: Categorized menu with filtering, search, and detailed item cards.
3. **Invitation System (Reservations)**: Multi-step request form with specific occasion handling.
4. **Interactive Cart**: Shopping bag for takeaway or pre-ordering.
5. **Mobile-First Luxury**: Fully responsive design that maintains its elegant aesthetic on small screens.

---

## 6. Development & Deployment
### Installation:
```bash
npm install
```

### Running Locally:
```bash
npm run dev
```

### Build for Production:
```bash
npm run build
```

---

## 7. Future Roadmap
- **Phase 2**: Real-time table availability using WebSockets.
- **Phase 3**: AI-Powered Sommelier (Interactive wine/pairings recommender using Gemini).
- **Phase 4**: Customer loyalty dashboard with persistent accounts.

---

*Documentation compiled by Obumpa Tech Solutions.*
