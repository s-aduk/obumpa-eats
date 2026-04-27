import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "@/src/components/layout/Navbar";
import Footer from "@/src/components/layout/Footer";
import Home from "@/src/pages/Home";
import Menu from "@/src/pages/Menu";
import Reservations from "@/src/pages/Reservations";
import Admin from "@/src/pages/Admin";
import Profile from "@/src/pages/Profile";
import { AuthProvider, useAuth } from "@/src/context/AuthContext";
import { CartProvider } from "@/src/context/CartContext";
import { motion, AnimatePresence } from "motion/react";
import ErrorBoundary from "@/src/components/ErrorBoundary";
import CheckoutModal from "@/src/components/checkout/CheckoutModal";
import { useCart } from "@/src/context/CartContext";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/" />;
  return <>{children}</>;
}

function AppContent() {
  const { isCheckoutOpen, setIsCheckoutOpen, cartTotal, clearCart } = useCart();

  return (
    <div className="flex flex-col min-h-screen bg-charcoal text-cream selection:bg-gold/30 font-sans">
      <div className="atmosphere" />
      <ErrorBoundary>
        <Navbar />
      </ErrorBoundary>
      
      <main className="flex-grow pt-20">
        <ErrorBoundary>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservations" element={
                <ProtectedRoute>
                  <Reservations />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/about" element={
                <div className="pt-40 text-center font-display text-4xl h-screen font-light tracking-tighter">
                  <span className="text-gradient">Our Story</span>
                  <p className="text-sm uppercase tracking-[0.5em] text-white/20 mt-4">Coming Soon</p>
                </div>
              } />
            </Routes>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      
      <ErrorBoundary>
        <Footer />
      </ErrorBoundary>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        onSuccess={() => {
          setIsCheckoutOpen(false);
          clearCart();
        }}
        amount={cartTotal} 
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <AppContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
