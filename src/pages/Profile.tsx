import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, 
  Calendar, 
  Package, 
  History, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Mail, 
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import { cn } from "@/src/lib/utils";
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  limit,
  onSnapshot 
} from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "@/src/lib/firebase";

export default function Profile() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"reservations" | "orders">("reservations");
  const [reservations, setReservations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const reservationsQuery = query(
      collection(db, "reservations"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const ordersQuery = query(
      collection(db, "orders"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const unsubReservations = onSnapshot(reservationsQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(data);
    }, (err) => {
      console.error("Error fetching reservations:", err);
      handleFirestoreError(err, OperationType.GET, "reservations");
    });

    const unsubOrders = onSnapshot(ordersQuery, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
      setLoading(false);
    }, (err) => {
      console.error("Error fetching orders:", err);
      handleFirestoreError(err, OperationType.GET, "orders");
      setLoading(false);
    });

    return () => {
      unsubReservations();
      unsubOrders();
    };
  }, [user]);

  if (!user) {
    return (
      <div className="pt-40 text-center font-display text-4xl h-screen font-light tracking-tighter">
        <span className="text-gradient">Session Expired</span>
        <p className="text-sm uppercase tracking-[0.5em] text-white/20 mt-4">Please log in to view your profile</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="w-32 h-32 rounded-full glass p-1 border-white/10 relative overflow-hidden group">
              <img 
                src={user.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${user.displayName}`} 
                alt={user.displayName || "User"} 
                className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                <h1 className="text-5xl font-display font-light tracking-tighter">
                  {user.displayName?.split(' ')[0]} <span className="text-gradient font-semibold italic">{user.displayName?.split(' ').slice(1).join(' ')}</span>
                </h1>
                <span className="px-3 py-1 glass border-white/10 rounded-full text-[10px] uppercase tracking-widest text-gold font-bold">
                  Connoisseur
                </span>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-cream/40 font-serif italic text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-3 h-3 text-gold" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <History className="w-3 h-3 text-gold" />
                  <span>Member since {new Date(user.metadata.creationTime || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Stats/Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-8 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold block mb-2">Visits</span>
              <p className="text-4xl font-display font-light text-gold leading-none">{reservations.length}</p>
              <p className="text-xs text-cream/40 mt-2 italic font-serif">Table experiences booked</p>
            </div>
            <div className="glass-card p-8 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold block mb-2">Orders</span>
              <p className="text-4xl font-display font-light text-gold leading-none">{orders.length}</p>
              <p className="text-xs text-cream/40 mt-2 italic font-serif">Culinary delights ordered</p>
            </div>
            <div className="glass-card p-8 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.4em] text-white/20 font-bold block mb-2">Status</span>
              <p className="text-xl font-display font-light text-gradient leading-none mt-2 uppercase tracking-widest">Sapphire Member</p>
              <p className="text-xs text-cream/40 mt-2 italic font-serif">Exclusive benefits active</p>
            </div>
          </div>
        </header>

        {/* Content Navigation */}
        <div className="mb-8 flex border-b border-white/10">
          <button 
            onClick={() => setActiveTab("reservations")}
            className={cn(
              "px-8 py-4 text-xs uppercase tracking-[0.4em] font-bold transition-all relative",
              activeTab === "reservations" ? "text-gold" : "text-white/20 hover:text-white"
            )}
          >
            Reservations
            {activeTab === "reservations" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={cn(
              "px-8 py-4 text-xs uppercase tracking-[0.4em] font-bold transition-all relative",
              activeTab === "orders" ? "text-gold" : "text-white/20 hover:text-white"
            )}
          >
            Digital Orders
            {activeTab === "orders" && <motion.div layoutId="tab" className="absolute bottom-0 left-0 w-full h-0.5 bg-gold" />}
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-cream/20">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="font-serif italic">Synchronizing your history...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === "reservations" ? (
                <motion.div
                  key="reservations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  {reservations.length === 0 ? (
                    <div className="text-center py-20 glass rounded-lg border-dashed border-white/10">
                      <Calendar className="w-12 h-12 text-white/10 mx-auto mb-4" />
                      <p className="text-cream/40 font-serif italic text-lg mb-6">No reservations found for your account.</p>
                      <button className="btn-outline">Book a Table</button>
                    </div>
                  ) : (
                    reservations.map((res) => (
                      <div key={res.id} className="glass group hover:border-gold/30 transition-all p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6">
                        <div className="w-16 h-16 rounded-full glass border-white/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                          <History className="w-6 h-6" />
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-wrap items-center gap-4 mb-2">
                            <h3 className="text-2xl font-display font-light tracking-tight">{res.date}</h3>
                            <div className="h-1 w-1 rounded-full bg-white/20" />
                            <p className="font-serif italic text-cream/60">{res.time}</p>
                          </div>
                          <div className="flex flex-wrap gap-6 text-[10px] uppercase font-bold tracking-[0.2em] text-white/20">
                            <span className="flex items-center gap-2"><User className="w-3 h-3 text-gold" /> {res.guests} Guests</span>
                            <span className="flex items-center gap-2"><Clock className="w-3 h-3 text-gold" /> Confirmed</span>
                            {res.occasion && <span className="flex items-center gap-2 text-gold"><AlertCircle className="w-3 h-3" /> {res.occasion}</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "px-4 py-2 rounded-full text-[8px] uppercase tracking-widest font-black border",
                            res.status === 'confirmed' ? "bg-gold/10 text-gold border-gold/20" : "bg-white/5 text-white/30 border-white/10"
                          )}>
                            {res.status}
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/10 group-hover:translate-x-1 group-hover:text-gold transition-all" />
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {orders.length === 0 ? (
                    <div className="col-span-full text-center py-20 glass rounded-lg border-dashed border-white/10">
                      <Package className="w-12 h-12 text-white/10 mx-auto mb-4" />
                      <p className="text-cream/40 font-serif italic text-lg mb-6">You haven't placed any digital orders yet.</p>
                      <button className="btn-outline">Explore Menu</button>
                    </div>
                  ) : (
                    orders.map((order) => (
                      <div key={order.id} className="glass-card group hover:border-gold/30 transition-all p-8 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-6">
                          <div className="w-12 h-12 rounded-lg glass border-white/10 flex items-center justify-center text-gold">
                            <Package className="w-5 h-5" />
                          </div>
                          <div className="text-right">
                            <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold mb-1">Order Ref</p>
                            <p className="text-xs font-mono text-cream/40 italic">#{order.id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                        
                        <div className="flex-grow">
                          <h3 className="text-xl font-display font-light mb-4">
                            {order.items?.length || 0} Selection{(order.items?.length || 0) !== 1 ? 's' : ''}
                          </h3>
                          <div className="space-y-3 mb-6">
                            {order.items?.slice(0, 3).map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="text-cream/60 font-serif italic">{item.name}</span>
                                <span className="text-white/20 text-[10px]">${item.price}</span>
                              </div>
                            ))}
                            {(order.items?.length || 0) > 3 && (
                              <p className="text-[10px] text-gold uppercase tracking-[0.2em] pt-2 font-bold group-hover:translate-x-1 transition-transform">
                                + {(order.items?.length || 0) - 3} more items...
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-white/20 font-bold mb-1 italic">Total Paid</p>
                            <p className="text-2xl font-display font-light text-gold">${order.total?.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center gap-2 px-3 py-1 bg-gold/10 rounded-full border border-gold/20">
                            <CheckCircle className="w-3 h-3 text-gold" />
                            <span className="text-[8px] uppercase tracking-widest font-black text-gold">Completed</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </main>
  );
}
