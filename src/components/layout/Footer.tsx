import { Link } from "react-router-dom";
import { SITE_DATA } from "@/src/constants";

export default function Footer() {
  return (
    <footer className="h-20 md:h-12 px-12 flex flex-col md:flex-row items-center justify-between border-t border-white/5 text-[10px] text-white/30 uppercase tracking-[0.3em] font-medium bg-charcoal">
      <span className="hidden md:inline text-center md:text-left">Accra &bull; Kumasi &bull; London</span>
      <span className="py-2 md:py-0 text-center">
        Copyright &copy; {new Date().getFullYear()} Obumpa Eats Luxury Group &bull; Designed by Stephen Adu Kwarteng
      </span>
      <div className="flex space-x-8">
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
        <a href="#" className="hover:text-white transition-colors">Privacy</a>
      </div>
    </footer>
  );
}
