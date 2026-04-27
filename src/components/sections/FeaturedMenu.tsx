import { motion } from "motion/react";
import { MENU_ITEMS } from "@/src/constants";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function FeaturedMenu() {
  const featured = MENU_ITEMS.slice(0, 3);

  return (
    <section className="py-32 px-6 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 gap-8">
          <div className="space-y-4">
            <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-bold block">Curated Selection</span>
            <h2 className="text-6xl md:text-7xl font-display font-light tracking-tighter leading-none">
              Signature <br />
              <span className="text-gradient font-semibold">Masterpieces</span>
            </h2>
          </div>
          <Link to="/menu" className="btn-outline group flex items-center gap-3">
            Explore All
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featured.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="glass-card group aspect-[4/5] p-10 flex flex-col justify-end cursor-pointer"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-40 transition-all duration-1000 grayscale group-hover:grayscale-0 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
              
              <div className="absolute top-0 right-0 p-8">
                <span className="text-gold/20 text-6xl font-display font-black leading-none group-hover:text-gold/40 transition-colors">0{index + 1}</span>
              </div>

              <div className="relative z-10 space-y-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-[9px] uppercase tracking-[0.3em] text-gold font-bold">{item.category}</p>
                <h3 className="text-3xl font-display font-light tracking-tight group-hover:text-white transition-colors">{item.name}</h3>
                <div className="w-8 h-px bg-white/10 group-hover:w-full transition-all duration-700" />
                <p className="text-cream/40 text-sm font-serif italic">${item.price}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
