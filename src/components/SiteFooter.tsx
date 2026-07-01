import { Link } from "@tanstack/react-router";
import { Facebook, Twitter, MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

export function SiteFooter() {
  return (
    <footer className="mt-20 bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src={logo} alt="Powerex Fire Protection System" width={48} height={48} className="h-12 w-12 object-contain" />
            <h3 className="text-lg font-bold">
              POWEREX <span className="text-primary">FIRE</span>
            </h3>
          </div>
          <p className="mt-3 text-sm text-secondary-foreground/70">
            Protecting lives with reliable fire safety solutions since 2010.
          </p>
          <div className="mt-4 flex gap-3">
            <a aria-label="Facebook" href="https://www.facebook.com/711610248976755" target="_blank" rel="noopener noreferrer" className="rounded-md bg-white/10 p-2 hover:bg-primary"><Facebook className="h-4 w-4" /></a>
            <a aria-label="Twitter" href="https://twitter.com/powerexfire" target="_blank" rel="noopener noreferrer" className="rounded-md bg-white/10 p-2 hover:bg-primary"><Twitter className="h-4 w-4" /></a>
            <a aria-label="WhatsApp" href="https://wa.me/919167752444" target="_blank" rel="noopener noreferrer" className="rounded-md bg-white/10 p-2 hover:bg-primary"><MessageCircle className="h-4 w-4" /></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Navigate</h4>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/80">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary">About</Link></li>
            <li><Link to="/services" className="hover:text-primary">Services</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link to="/guides/fire-suppression-systems" className="hover:text-primary">Suppression Systems Guide</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-secondary-foreground/80">
            <li className="flex items-start gap-2"><Phone className="mt-0.5 h-4 w-4 text-primary" /><a href="tel:+919167752444" className="hover:text-primary">+91 91677 52444</a></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /><a href="mailto:info@powerexfire.com" className="hover:text-primary">info@powerexfire.com</a></li>
            <li className="flex items-start gap-2"><Mail className="mt-0.5 h-4 w-4 text-primary" /><a href="mailto:sales@powerexfire.com" className="hover:text-primary">sales@powerexfire.com</a></li>
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 text-primary" /><span>Vasai East, Mumbai, Maharashtra 401208</span></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider">Verified Business</h4>
          <div className="mt-3 rounded-md border border-white/10 bg-white/5 p-3 text-xs text-secondary-foreground/80">
            <p><span className="text-secondary-foreground/60">GSTIN:</span> 27ABKPY1137F1ZH</p>
            <p className="mt-1"><span className="text-secondary-foreground/60">Proprietor:</span> Santosh Kumar Doodhnath Yadav</p>
            <p className="mt-1"><span className="text-secondary-foreground/60">Since:</span> 2010</p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-secondary-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} Powerex Fire Protection System. All rights reserved.</p>
          <p>Built for safety. Trusted across India.</p>
        </div>
      </div>
    </footer>
  );
}