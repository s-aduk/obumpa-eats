import { useState, useEffect, MouseEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MENU_ITEMS as FALLBACK_MENU, MENU_CATEGORIES } from "@/src/constants";
import { Plus, Search, Loader2, ChevronRight, ShoppingCart } from "lucide-react";
import { cn } from "@/src/lib/utils";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/src/lib/firebase";
import CheckoutModal from "@/src/components/checkout/CheckoutModal";

import { useCart } from "@/src/context/CartContext";

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [addingId, setAddingId] = useState<string | number | null>(null);
  
  const { cart, addToCart, cartTotal, isCheckoutOpen, setIsCheckoutOpen } = useCart();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "menuItems"));
        const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (items.length > 0) {
          setMenuItems(items);
        } else {
          setMenuItems(FALLBACK_MENU);
        }
      } catch (error) {
        setMenuItems(FALLBACK_MENU);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const handleAddToCart = (e: MouseEvent, item: any) => {
    e.stopPropagation();
    setAddingId(item.id);
    addToCart(item);
    setTimeout(() => {
      setAddingId(null);
    }, 2000);
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
    const matchesSearch = (item.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) || 
                          (item.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen pb-24 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <header className="pt-24 pb-16 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center gap-4 mb-8"
          >
            <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-bold block">The Collection</span>
            <div className="w-12 h-px bg-gold/30" />
          </motion.div>
          <h1 className="text-7xl md:text-8xl font-display font-light tracking-tighter mb-10 leading-none">
            Culinary <span className="text-gradient font-semibold italic">Gallery</span>
          </h1>
          
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 mt-8 items-center">
            <div className="flex-grow relative group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-hover:text-gold transition-colors" />
              <input 
                type="text" 
                placeholder="Search flavors..."
                className="w-full glass bg-white/5 border-white/10 rounded-none py-4 pl-12 pr-4 focus:border-gold outline-none text-sm font-light transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2 p-1 glass bg-white/5 overflow-x-auto no-scrollbar max-w-full">
              {MENU_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "px-6 py-2 text-[9px] uppercase tracking-[0.3em] font-bold transition-all whitespace-nowrap",
                    activeCategory === cat ? "bg-white text-charcoal" : "text-white/30 hover:text-white"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {cart.length > 0 && (
              <motion.button 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setIsCheckoutOpen(true)}
                className="btn-premium flex items-center gap-3 whitespace-nowrap"
              >
                <ShoppingCart className="w-4 h-4" />
                Checkout (${cartTotal.toFixed(2)})
              </motion.button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="w-12 h-12 text-gold animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-10">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  onClick={() => setSelectedItem(item)}
                  className="glass-card group aspect-[4/5] p-10 flex flex-col justify-end cursor-pointer"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
                  
                  <div className="absolute top-0 right-0 p-8 flex flex-col items-end gap-4">
                    <span className="text-gold/30 text-[8px] uppercase tracking-[0.5em] font-bold group-hover:text-gold transition-colors italic font-serif">Original</span>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => handleAddToCart(e, item)}
                      className="w-10 h-10 rounded-full glass flex items-center justify-center text-gold hover:bg-gold hover:text-charcoal transition-all relative"
                    >
                      <AnimatePresence mode="wait">
                        {addingId === item.id ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            <Plus className="w-4 h-4 rotate-45" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="plus"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                          >
                            <Plus className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>

                  <div className="relative z-10 space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.4em] text-white/30 mb-2 font-bold group-hover:text-gold transition-colors">{item.category}</p>
                      <h3 className="text-3xl font-display font-light tracking-tight transition-colors group-hover:text-white leading-tight">{item.name}</h3>
                    </div>
                    <p className="text-cream/30 text-[11px] line-clamp-2 font-serif italic font-light group-hover:text-cream/50 transition-colors leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-500">{item.description}</p>
                    <div className="flex items-center justify-between pt-2">
                       <p className="text-gold font-display text-xl">${item.price}</p>
                       <div className="w-12 h-px bg-white/10 group-hover:w-full transition-all duration-700 ml-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-24">
            <p className="text-cream/40 italic font-serif text-xl border-t border-white/5 pt-12">No culinary matches found for your current selection.</p>
          </div>
        )}
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-charcoal/90 backdrop-blur-sm z-[100] cursor-zoom-out"
            />
            <motion.div 
              layoutId={selectedItem.id}
              initial={{ opacity: 0, scale: 0.9, y: 100 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className="fixed inset-x-6 bottom-6 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] bg-charcoal border border-white/10 z-[101] overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 h-full min-h-[500px]">
                <div className="relative h-64 md:h-full">
                  <img src={selectedItem.image} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-charcoal via-transparent to-transparent" />
                </div>
                <div className="p-10 flex flex-col justify-center gap-6">
                  <div className="space-y-2">
                    <p className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold">{selectedItem.category}</p>
                    <h2 className="text-5xl font-display font-light tracking-tighter leading-none">{selectedItem.name}</h2>
                  </div>
                  <p className="text-cream/40 font-serif italic text-lg leading-relaxed">{selectedItem.description}</p>
                  <div className="flex items-center justify-between border-t border-white/10 pt-8 mt-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-white/20 font-bold mb-1">Standard Cut</p>
                      <p className="text-3xl font-display text-gold">${selectedItem.price}</p>
                    </div>
                    <button 
                      onClick={(e) => handleAddToCart(e, selectedItem)}
                      className="btn-premium flex items-center gap-4"
                    >
                      Add Selection {addingId === selectedItem.id && <Loader2 className="w-4 h-4 animate-spin" />}
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-6 right-6 w-10 h-10 glass rounded-full flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </main>
  );
}
