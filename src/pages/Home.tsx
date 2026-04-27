import Hero from "@/src/components/sections/Hero";
import FeaturedMenu from "@/src/components/sections/FeaturedMenu";
import { motion } from "motion/react";
import { TESTIMONIALS } from "@/src/constants";
import { Quote } from "lucide-react";

export default function Home() {
  return (
    <main>
      <Hero />
      
      {/* Introduction */}
      <section className="py-24 px-6 border-b border-white/5">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            className="h-px bg-gold flex-1 mx-auto w-24"
          />
          <h2 className="text-4xl md:text-6xl font-serif italic">"Where every plate tells a story of <span className="text-gold">uncompromising excellence</span>."</h2>
          <p className="text-cream/60 leading-relaxed text-lg">
            Obumpa Eats was founded on a simple principle: to redefine luxury dining through 
            the lens of artistic expression and culinary innovation. Our master chefs source 
            only the rarest seasonal ingredients to bring you a menu that is as evocative as it is delicious.
          </p>
        </div>
      </section>

      <FeaturedMenu />

      {/* Testimonials */}
      <section className="py-24 px-6 bg-surface relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-gold text-xs tracking-[0.4em] uppercase mb-4 block font-semibold italic">Recognition</span>
            <h2 className="text-5xl font-serif font-black">Gastronomic <span className="text-gold italic">Praise</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {TESTIMONIALS.map((t, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="glass p-12 relative"
              >
                <Quote className="absolute top-8 left-8 w-12 h-12 text-gold/10" />
                <p className="text-xl italic font-serif leading-relaxed mb-8 relative z-10">"{t.content}"</p>
                <div>
                  <h4 className="font-display text-gold tracking-widest text-sm uppercase">{t.name}</h4>
                  <p className="text-cream/40 text-xs uppercase tracking-tighter mt-1">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
