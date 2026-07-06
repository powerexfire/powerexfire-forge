import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Wind, Droplets, Zap, ChefHat, FlaskConical, CheckCircle2 } from "lucide-react";
import extinguishers from "@/assets/extinguishers.jpg";

const faqs = [
  {
    q: "Which fire extinguisher is best for an office?",
    a: "An ABC dry powder extinguisher handles the three most likely office fires — paper and furniture (Class A), flammable liquids (Class B) and live electrical equipment (Class C). Pair it with a CO2 unit near server racks and UPS rooms.",
  },
  {
    q: "Can I use a water extinguisher on an electrical fire?",
    a: "No. Water conducts electricity and can shock the operator or short live equipment. Use CO2 or a clean-agent extinguisher for anything energised.",
  },
  {
    q: "What extinguisher does a commercial kitchen need?",
    a: "A Class K wet-chemical extinguisher for cooking-oil fires, backed by a hood suppression system. ABC powder alone will not stop a deep-fat fire from re-igniting.",
  },
  {
    q: "How often should extinguishers be refilled?",
    a: "Every extinguisher needs an annual inspection and pressure test. Refill immediately after any discharge, and a full hydrostatic test is due every 3–5 years depending on the type (IS 2190).",
  },
];

const types = [
  {
    icon: Flame,
    title: "ABC Dry Powder",
    classes: "A · B · C",
    best: "Offices, homes, warehouses, vehicles, mixed-hazard sites",
    how: "Monoammonium phosphate powder breaks the chemical chain reaction of the flame and forms a smothering crust on solids.",
    pros: ["Handles three fire classes in one unit", "Low cost per kilogram", "Effective in wind and outdoors"],
    cons: ["Powder residue damages electronics", "Reduces visibility during discharge"],
  },
  {
    icon: Wind,
    title: "CO2 (Carbon Dioxide)",
    classes: "B · C",
    best: "Server rooms, switchgear, laboratories, offices with electronics",
    how: "Discharges pressurised CO2 that displaces oxygen and cools the fuel — leaves zero residue.",
    pros: ["Safe for live electrical equipment", "No cleanup or damage to electronics", "Ideal for flammable-liquid fires"],
    cons: ["Not effective on Class A deep-seated fires", "Risk of asphyxiation in small rooms", "Discharge horn can cause frostbite"],
  },
  {
    icon: Droplets,
    title: "Foam (AFFF)",
    classes: "A · B",
    best: "Fuel stores, workshops, garages, paint shops",
    how: "Aqueous film-forming foam blankets flammable liquid to seal vapours and cools the fuel to prevent re-ignition.",
    pros: ["Excellent on petrol, diesel and solvents", "Also works on Class A combustibles", "Prevents flashback"],
    cons: ["Conducts electricity — not for live circuits", "Foam residue needs cleanup"],
  },
  {
    icon: Droplets,
    title: "Water (Portable & Water Mist)",
    classes: "A",
    best: "Textile mills, warehouses, hotels, offices with paper and wood",
    how: "Cools burning solids below their ignition temperature. Water mist adds fine droplets that also displace oxygen with steam.",
    pros: ["Very effective on wood, paper and cloth", "Cheap to refill", "Water mist is safer near sensitive equipment"],
    cons: ["Never use on live electrical or flammable liquids", "Water damage risk to stored goods"],
  },
  {
    icon: ChefHat,
    title: "Wet Chemical (Class K)",
    classes: "K · A",
    best: "Commercial kitchens, restaurants, canteens, hotel pantries",
    how: "Potassium salts react with hot cooking oil to form a soapy layer (saponification) that smothers the fire and cools the oil below auto-ignition.",
    pros: ["Only agent rated for cooking-oil fires", "Meets NFPA 96 and IS 15683", "Cools oil to prevent re-ignition"],
    cons: ["Purpose-built for kitchens only", "Requires post-discharge cleanup"],
  },
  {
    icon: FlaskConical,
    title: "Clean Agent (FM-200, Novec 1230, HCFC)",
    classes: "A · B · C",
    best: "Data centres, control rooms, telecom cabinets, museums",
    how: "Discharges an electrically non-conductive gas that absorbs heat or interrupts the combustion chain — safe for occupied spaces.",
    pros: ["Zero residue, safe for electronics", "People-safe at design concentration", "Discharges in under 10 seconds"],
    cons: ["Higher upfront and refill cost", "Best in sealed enclosures"],
  },
  {
    icon: Zap,
    title: "D-Class Powder (Special Metals)",
    classes: "D",
    best: "Metal fabrication, magnesium/sodium/lithium handling, laboratories",
    how: "Specialised dry powder (graphite, sodium chloride or copper based) smothers burning combustible metals without reacting with them.",
    pros: ["Only agent safe on burning metals", "Prevents violent water-reaction", "Meets IS 11833"],
    cons: ["Single-purpose — not for other fire classes", "Higher unit cost"],
  },
];

const classes = [
  { label: "Class A", desc: "Ordinary combustibles — wood, paper, cloth, plastics.", agents: "ABC powder, water, foam, water mist" },
  { label: "Class B", desc: "Flammable liquids — petrol, diesel, oil, solvents, paint.", agents: "ABC powder, CO2, foam, clean agent" },
  { label: "Class C", desc: "Live electrical equipment — panels, servers, motors.", agents: "CO2, clean agent, ABC powder" },
  { label: "Class D", desc: "Combustible metals — magnesium, sodium, lithium, titanium.", agents: "D-class special powder only" },
  { label: "Class K", desc: "Cooking oils and fats in commercial kitchens.", agents: "Wet chemical (K-class)" },
];

export const Route = createFileRoute("/guides/fire-extinguisher-types")({
  head: () => ({
    meta: [
      { title: "Fire Extinguisher Types & Classes — India Buyer's Guide" },
      { name: "description", content: "Compare ABC, CO2, foam, water, wet chemical, clean agent and D-class fire extinguishers. Match Class A–K fires to the right extinguisher for your facility in India." },
      { property: "og:title", content: "Fire Extinguisher Types & Classes — India Buyer's Guide" },
      { property: "og:description", content: "Facility manager's guide to fire extinguisher types in India — ABC, CO2, foam, water, wet chemical, clean agent and D-class." },
      { property: "og:url", content: "https://powerexfire.lovable.app/guides/fire-extinguisher-types" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://powerexfire.lovable.app/guides/fire-extinguisher-types" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Fire Extinguisher Types & Classes — India Buyer's Guide",
          description: "Compare ABC, CO2, foam, water, wet chemical, clean agent and D-class fire extinguishers. Match Class A–K fires to the right unit for your facility in India.",
          author: { "@type": "Organization", name: "Powerex Fire Protection System" },
          publisher: {
            "@type": "Organization",
            name: "Powerex Fire Protection System",
            logo: { "@type": "ImageObject", url: "https://powerexfire.lovable.app/og-image.jpg" },
          },
          mainEntityOfPage: "https://powerexfire.lovable.app/guides/fire-extinguisher-types",
          datePublished: "2026-07-06",
          dateModified: "2026-07-06",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Guide,
});

function Guide() {
  return (
    <>
      <section className="relative overflow-hidden bg-secondary py-16 text-secondary-foreground md:py-24">
        <img src={extinguishers} alt="" width={1280} height={896} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/50" />
        <div className="relative mx-auto max-w-4xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Guide</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Fire Extinguisher Types &amp; Classes</h1>
          <p className="mt-4 text-secondary-foreground/85">
            A practical, facility-manager guide to choosing the right fire extinguisher for
            your hazard. Learn how Class A–K fires differ and which extinguisher — ABC powder,
            CO2, foam, water, wet chemical, clean agent or D-class — is safe and effective for each.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-16">
        <section className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold">The five fire classes</h2>
          <p className="mt-3 text-muted-foreground">
            Fires are classified by what is burning. Using the wrong extinguisher on the
            wrong class can spread the fire or electrocute the operator — matching the class
            to the agent is the single most important decision.
          </p>
        </section>

        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted text-foreground">
              <tr>
                <th className="p-3 text-left font-semibold">Class</th>
                <th className="p-3 text-left font-semibold">Fuel</th>
                <th className="p-3 text-left font-semibold">Recommended extinguisher</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {classes.map((c) => (
                <tr key={c.label}>
                  <td className="p-3 font-semibold text-foreground">{c.label}</td>
                  <td className="p-3 text-muted-foreground">{c.desc}</td>
                  <td className="p-3 text-muted-foreground">{c.agents}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="prose prose-slate mt-12 max-w-none">
          <h2 className="text-2xl font-bold">The seven extinguisher types</h2>
          <p className="mt-3 text-muted-foreground">
            Every extinguisher sold in India is certified to IS 15683 and marked with the
            fire classes it is rated for. Here's how each type works and where it belongs.
          </p>
        </section>

        <div className="mt-6 grid gap-6">
          {types.map((t) => (
            <div key={t.title} className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold">{t.title}</h3>
                </div>
                <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{t.classes}</span>
              </div>
              <p className="mt-3 text-sm"><span className="font-semibold">Best for:</span> <span className="text-muted-foreground">{t.best}</span></p>
              <p className="mt-2 text-sm"><span className="font-semibold">How it works:</span> <span className="text-muted-foreground">{t.how}</span></p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">Pros</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {t.pros.map((p) => (
                      <li key={p} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Cons</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {t.cons.map((c) => (
                      <li key={c} className="flex gap-2"><span className="mt-0.5 text-primary">›</span>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="prose prose-slate mt-12 max-w-none">
          <h2 className="text-2xl font-bold">How to choose for your facility</h2>
          <ol className="mt-3 space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">1. Walk the site.</strong> Note every hazard: paper stores, LPG cylinders, DBs, kitchens, workshops.</li>
            <li><strong className="text-foreground">2. Classify each hazard.</strong> Match it to Class A, B, C, D or K using the table above.</li>
            <li><strong className="text-foreground">3. Pick the smallest safe unit.</strong> Rating (2A, 3B, etc.) must meet or exceed the hazard's requirement per IS 2190.</li>
            <li><strong className="text-foreground">4. Place them right.</strong> Maximum travel distance is 15 m for Class A and 9 m for Class B under Indian code.</li>
            <li><strong className="text-foreground">5. Train and drill.</strong> Every extinguisher needs at least one trained user on the shift — book a mock drill annually.</li>
          </ol>

          <h2 className="mt-10 text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((f) => (
              <div key={f.q}>
                <p className="font-semibold text-foreground">{f.q}</p>
                <p className="mt-1 text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-secondary p-8 text-secondary-foreground md:p-10">
          <h2 className="text-2xl font-bold">Need help choosing extinguishers?</h2>
          <p className="mt-2 text-secondary-foreground/85">We survey your premises, classify every hazard and supply certified extinguishers with installation, signage and staff training.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Request a free survey</Link>
            <Link to="/services" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold">See all services</Link>
          </div>
        </div>
      </article>
    </>
  );
}