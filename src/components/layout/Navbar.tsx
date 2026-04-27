import { motion, AnimatePresence } from "motion/react";
import { Link, NavLink } from "react-router-dom";
import { ShoppingBag, Menu as MenuIcon, X, User as UserIcon, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/src/lib/utils";
import { useAuth } from "@/src/context/AuthContext";
import { signInWithGoogle, auth } from "@/src/lib/firebase";
import { useCart } from "@/src/context/CartContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { cart, setIsCheckoutOpen } = useCart();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Menu", path: "/menu" },
    { name: "Reservations", path: "/reservations" },
    { name: "About", path: "/about" },
    { name: "Profile", path: "/profile" },
  ];
  
  if (isAdmin) {
    navLinks.push({ name: "Admin", path: "/admin" });
  }

  return (
    <nav className="fixed top-0 left-0 w-full z-50 glass border-b border-white/5 h-20 flex items-center">
      <div className="max-w-7xl mx-auto w-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-16">
          <Link to="/" className="text-2xl font-display font-light tracking-tighter flex items-center gap-3 group">
            <span className="text-white group-hover:text-gold transition-colors">OBUMPA</span>
            <span className="text-gold font-bold">EATS</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    "text-[10px] uppercase tracking-[0.4em] font-bold transition-all hover:text-gold relative py-2 group/nav",
                    isActive ? "text-gold" : "text-white/30"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {link.name}
                    <motion.div 
                      className="absolute bottom-0 left-0 h-px bg-gold"
                      initial={false}
                      animate={{ 
                        width: isActive ? "100%" : "0%",
                        opacity: isActive ? 1 : 0
                      }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute bottom-0 left-0 w-0 h-px bg-gold group-hover/nav:w-full transition-all duration-300 opacity-50" />
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div 
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-6 text-white/20 relative group/cart cursor-pointer"
          >
             <ShoppingBag className="w-4 h-4 group-hover/cart:text-gold transition-colors" />
             {cart.length > 0 && (
               <span className="absolute -top-2 -right-2 w-4 h-4 bg-gold text-charcoal text-[9px] font-black rounded-full flex items-center justify-center animate-in zoom-in">
                 {cart.length}
               </span>
             )}
             <div className="hidden lg:block w-px h-4 bg-white/10" />
          </div>
          
          <div className="flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-3 group/user">
                  <img 
                    src={user.photoURL || ""} 
                    alt={user.displayName || ""} 
                    className="w-8 h-8 rounded-full border border-gold/40 p-0.5 group-hover/user:border-gold transition-colors"
                  />
                  <div className="hidden md:block">
                    <p className="text-[8px] uppercase tracking-widest text-white/40 font-bold block leading-none">Connoisseur</p>
                    <p className="text-[10px] text-white group-hover/user:text-gold transition-colors font-medium">{user.displayName?.split(' ')[0]}</p>
                  </div>
                </Link>
                <button 
                  onClick={() => auth.signOut()}
                  className="text-white/20 hover:text-red-400 transition-colors ml-2"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={signInWithGoogle}
                className="text-[10px] uppercase tracking-[0.4em] text-gold font-black hover:text-white transition-all flex items-center gap-2"
              >
                <UserIcon className="w-3 h-3" /> Login
              </button>
            )}
          </div>
          
          <Link 
            to="/reservations"
            className="hidden md:block btn-premium !px-6 !py-2.5"
          >
            Reservations
          </Link>
          
          <button 
            className="md:hidden p-2 text-white/40"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-charcoal border-b border-white/5 overflow-hidden"
          >
            <div className="p-6 space-y-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="block text-lg font-serif tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
