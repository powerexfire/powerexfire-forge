import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import logo from "@/assets/logo.webp";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2" aria-label="Powerex Fire home">
          <img src={logo} alt="Powerex Fire Protection System logo" width={44} height={44} className="h-11 w-11 object-contain" />
          <span className="font-bold tracking-tight text-secondary">
            POWEREX <span className="text-primary">FIRE</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="text-sm font-medium text-foreground transition-colors hover:text-primary"
            >
              {n.label}
            </Link>
          ))}
          <a
            href="tel:+919167752444"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Phone className="h-4 w-4" aria-hidden /> Call Now
          </a>
        </nav>
        <button
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-foreground md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "bg-muted text-primary" }}
                className="rounded-md px-3 py-3 text-base font-medium text-foreground hover:bg-muted"
              >
                {n.label}
              </Link>
            ))}
            <a
              href="tel:+919167752444"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-3 text-base font-semibold text-primary-foreground"
            >
              <Phone className="h-4 w-4" /> Call +91 91677 52444
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}