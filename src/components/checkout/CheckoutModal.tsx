import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion, AnimatePresence } from "motion/react";
import { X, CreditCard, ShieldCheck, Loader2, CheckCircle } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/src/context/AuthContext";
import { useCart } from "@/src/context/CartContext";

const publishableKey = (import.meta as any).env.VITE_STRIPE_PUBLISHABLE_KEY;
if (!publishableKey || publishableKey.length < 5) {
  console.warn("VITE_STRIPE_PUBLISHABLE_KEY is missing. Payment functionality will be disabled.");
}
const stripePromise = loadStripe(publishableKey || "");

interface CheckoutFormProps {
  amount: number;
  onSuccess: () => void;
  onCancel: () => void;
}

function CheckoutForm({ amount, onSuccess, onCancel }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const { cart } = useCart();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    if (amount <= 0) return;
    
    // Create PaymentIntent as soon as the component loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          setError(data.error || "Failed to initialize payment. Please check your Stripe configuration.");
        }
      })
      .catch((err) => {
        console.error("Payment initialization error:", err);
        setError("Network error: Could not connect to the payment server.");
      });
  }, [amount]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement as any,
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      // Save order to Firestore
      try {
        await addDoc(collection(db, "orders"), {
          userId: user?.uid || "anonymous",
          userEmail: user?.email || "anonymous",
          items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            category: item.category
          })),
          total: amount,
          status: "received",
          paymentStatus: "paid",
          createdAt: serverTimestamp(),
        });

        setError(null);
        setProcessing(false);
        setSucceeded(true);
        setTimeout(onSuccess, 2000);
      } catch (err) {
        console.error("Error saving order:", err);
        handleFirestoreError(err, OperationType.WRITE, "orders");
        setError("Payment succeeded but failed to save order record. Please contact support.");
        setProcessing(false);
      }
    }
  };

  if (succeeded) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in">
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-gold" />
        </div>
        <h3 className="text-3xl font-display font-light mb-2">Payment Confirmed</h3>
        <p className="text-cream/40 font-serif italic">Your order has been placed successfully.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <label className="text-[10px] uppercase tracking-[0.4em] text-gold font-bold flex items-center gap-2">
          <CreditCard className="w-3 h-3" /> Card Information
        </label>
        <div className="glass p-6 border-white/10 group focus-within:border-gold transition-colors">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#F5F5F0",
                  "::placeholder": {
                    color: "rgba(245, 245, 240, 0.2)",
                  },
                },
                invalid: {
                  color: "#ef4444",
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium rounded animate-in slide-in-from-top-2">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button
          disabled={processing || !stripe || !elements}
          className="btn-premium w-full !py-5 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
        >
          {processing ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>Pay ${amount.toFixed(2)}</>
          )}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-[10px] uppercase tracking-[0.4em] text-white/20 hover:text-white transition-colors"
        >
          Go Back
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-[8px] uppercase tracking-widest text-white/10 font-bold">
        <ShieldCheck className="w-3 h-3" /> Encrypted & Secure Payment
      </div>
    </form>
  );
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: number;
}

export default function CheckoutModal({ isOpen, onClose, onSuccess, amount }: CheckoutModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/90 backdrop-blur-md z-[200] cursor-zoom-out"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 50 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg z-[201] p-6"
          >
            <div className="glass-card p-10 md:p-16 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
              
              <div className="mb-12 text-center">
                <span className="text-gold text-[10px] uppercase tracking-[0.6em] font-bold block mb-4">Checkout</span>
                <h2 className="text-4xl font-display font-light tracking-tighter leading-none mb-4">Complete your <span className="text-gradient font-semibold">Order</span></h2>
                <div className="flex items-center justify-center gap-4 text-cream/40 font-serif italic">
                   <span>Order Total</span>
                   <div className="w-8 h-px bg-white/10" />
                   <span className="text-white font-sans font-medium text-lg">${amount.toFixed(2)}</span>
                </div>
              </div>

              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  amount={amount} 
                  onSuccess={onSuccess} 
                  onCancel={onClose} 
                />
              </Elements>

              <button 
                onClick={onClose}
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
