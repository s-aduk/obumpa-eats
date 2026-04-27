import { motion } from "motion/react";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-5rem)] w-full flex flex-col items-center justify-center py-20">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 -left-24 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[140px]" 
        />
        <img 
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2600&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-20 scale-105 grayscale brightness-50"
          alt="Luxury Restaurant Ambience"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/40 via-transparent to-charcoal" />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex-grow flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="mb-8 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.8em] text-gold font-bold">
            Akwaaba — Heritage Refined
          </span>
          <div className="w-12 h-px bg-gold/30" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "circOut" }}
          className="text-[10vw] md:text-9xl font-display font-light leading-[0.85] tracking-tighter mb-12"
        >
          Taste of <br/>
          <span className="text-gradient font-semibold">Ghanaian Soul</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="text-base md:text-lg text-cream/40 font-light font-serif italic leading-relaxed max-w-xl mx-auto mb-16"
        >
          Step into a sanctuary of taste where the heat of the savanna meets the cool of the coast. 
          A curated sensory journey through Ghana's rich culinary heart.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <Link 
            to="/reservations" 
            className="btn-premium group flex items-center gap-3"
          >
            Secure a Table
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          
          <Link 
            to="/menu" 
            className="btn-outline"
          >
            Explore Collection
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 1 }}
          className="grid grid-cols-3 gap-8 mt-24 max-w-2xl mx-auto"
        >
          {[
            { v: "03", l: "Elite Stars" },
            { v: "25", l: "Years Craft" },
            { v: "100%", l: "Organic" }
          ].map((item, i) => (
            <div key={i} className="text-center group cursor-default">
              <p className="text-4xl md:text-5xl font-display font-light text-gold/80 mb-1 group-hover:text-gold transition-colors">{item.v}</p>
              <p className="text-[8px] uppercase tracking-[0.4em] text-white/20 font-bold">{item.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator - now in relative flow at bottom of hero */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="relative mt-20 flex flex-col items-center gap-3 opacity-30 z-10"
      >
        <span className="text-[8px] uppercase tracking-[0.5em] font-bold">Discover</span>
        <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  );
}
