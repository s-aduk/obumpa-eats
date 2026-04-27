import React, { useState } from "react";
import { motion } from "motion/react";
import { Calendar, Users, Clock, MessageSquare, CheckCircle, Loader2, ChevronRight } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";
import { useAuth } from "@/src/context/AuthContext";

export default function Reservations() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    guests: "2",
    occasion: "Standard Dinner",
    request: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setIsSubmitting(true);
    const path = "reservations";
    
    try {
      await addDoc(collection(db, path), {
        userId: user.uid,
        userName: user.displayName,
        userEmail: user.email,
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests),
        occasion: formData.occasion,
        specialRequest: formData.request,
        status: "pending",
        createdAt: serverTimestamp()
      });
      setIsSubmitted(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="pt-24 pb-24 px-6 min-h-screen relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <header className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-bold block">Reservations</span>
            <div className="w-12 h-px bg-gold/30" />
          </motion.div>
          <h1 className="text-7xl md:text-8xl font-display font-light tracking-tighter mb-10 leading-none">
            Secure Your <br />
            <span className="text-gradient font-semibold">Table</span>
          </h1>
          <p className="text-cream/40 max-w-xl mx-auto font-serif italic text-base leading-relaxed">
            Please complete the request below. Our concierge will review your preferences and contact you to finalize the details of your visit.
          </p>
        </header>

        {isSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-20 text-center space-y-8"
          >
            <div className="w-24 h-24 glass rounded-full flex items-center justify-center mx-auto mb-8 border-gold/20">
              <CheckCircle className="w-10 h-10 text-gold" />
            </div>
            <h2 className="text-4xl font-display font-light">Request Received</h2>
            <p className="text-cream/50 max-w-sm mx-auto font-light leading-relaxed">
              Your invitation request has been logged. Our specialist will review your preferences and respond within 2 hours.
            </p>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="btn-outline mt-10"
            >
              Back to Requests
            </button>
          </motion.div>
        ) : (
          <motion.form 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 glass-card p-8 md:p-20"
          >
            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-gold font-bold">
                <Calendar className="w-3 h-3 text-white/20" /> Date
              </label>
              <input 
                required
                type="date" 
                className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-gold transition-all text-white font-light tracking-tight"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
              />
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-gold font-bold">
                <Clock className="w-3 h-3 text-white/20" /> Time
              </label>
              <select 
                required
                className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-gold transition-all text-white font-light tracking-tight appearance-none"
                onChange={(e) => setFormData({...formData, time: e.target.value})}
              >
                <option className="bg-charcoal" value="">Select Slot</option>
                <option className="bg-charcoal" value="17:00">17:00 HRS</option>
                <option className="bg-charcoal" value="18:30">18:30 HRS</option>
                <option className="bg-charcoal" value="20:00">20:00 HRS</option>
                <option className="bg-charcoal" value="21:30">21:30 HRS</option>
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-gold font-bold">
                <Users className="w-3 h-3 text-white/20" /> Party Size
              </label>
              <select 
                value={formData.guests}
                className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-gold transition-all text-white font-light tracking-tight appearance-none"
                onChange={(e) => setFormData({...formData, guests: e.target.value})}
              >
                {[1,2,3,4,5,6,8,10].map(n => (
                  <option key={n} className="bg-charcoal" value={n}>{n} Guests</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-gold font-bold">
                Occasion
              </label>
              <select 
                value={formData.occasion}
                className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-gold transition-all text-white font-light tracking-tight appearance-none"
                onChange={(e) => setFormData({...formData, occasion: e.target.value})}
              >
                <option className="bg-charcoal" value="Standard Dinner">Standard Dinner</option>
                <option className="bg-charcoal" value="Anniversary">Anniversary</option>
                <option className="bg-charcoal" value="Business Meeting">Business Meeting</option>
                <option className="bg-charcoal" value="Celebration">Celebration</option>
                <option className="bg-charcoal" value="Traditional Wedding">Traditional Wedding</option>
                <option className="bg-charcoal" value="Naming Ceremony">Naming Ceremony</option>
                <option className="bg-charcoal" value="Chieftaincy Event">Chieftaincy Event</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-4">
              <label className="flex items-center gap-3 text-[9px] uppercase tracking-[0.4em] text-gold font-bold">
                <MessageSquare className="w-3 h-3 text-white/20" /> Special Requests
              </label>
              <textarea 
                rows={3}
                placeholder="Dietary requirements or allergies..."
                className="w-full bg-transparent border-b border-white/10 py-5 focus:outline-none focus:border-gold transition-all text-white font-light text-sm resize-none placeholder:text-white/10"
                onChange={(e) => setFormData({...formData, request: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 pt-12">
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-premium w-full !py-6 flex items-center justify-center gap-4 transition-all active:scale-95"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Request Table
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
            
            <p className="md:col-span-2 text-center text-[8px] text-white/20 uppercase tracking-[0.3em] mt-8">
              By submitting, you agree to our seasonal cancellation protocols.
            </p>
          </motion.form>
        )}
      </div>
    </main>
  );
}
