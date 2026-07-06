import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Droplets, Wind, Shield, CheckCircle2 } from "lucide-react";
import alarm from "@/assets/alarm-system.jpg";

const faqs = [
  {
    q: "Is a fire suppression system the same as a sprinkler?",
    a: "Sprinklers are one type of suppression system. \"Fire suppression\" also covers gas, foam and dry chemical systems designed for hazards where water isn't the best agent.",
  },
  {
    q: "Which system is best for a server room?",
    a: "A clean agent system (FM-200 or Novec 1230) is standard for occupied server rooms — it extinguishes fire in seconds, leaves no residue and is safe for people.",
  },
  {
    q: "How often should a suppression system be serviced?",
    a: "At least once a year, plus a full agent and cylinder inspection every five years. An annual maintenance contract (AMC) keeps you compliant with IS and NFPA requirements.",
  },
];

export const Route = createFileRoute("/guides/fire-suppression-systems")({
  head: () => ({
    meta: [
      { title: "Types of Fire Suppression Systems for Businesses" },
      { name: "description", content: "Guide to fire suppression systems — CO2, clean agent, foam, water mist, dry chemical and kitchen hood systems. Compare uses, pros and cons for your business." },
      { property: "og:title", content: "Types of Fire Suppression Systems for Businesses" },
      { property: "og:description", content: "Compare CO2, clean agent, foam, water mist and dry chemical fire suppression systems and pick the right one for your site." },
      { property: "og:url", content: "https://powerexfire.lovable.app/guides/fire-suppression-systems" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://powerexfire.lovable.app/guides/fire-suppression-systems" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Types of Fire Suppression Systems for Businesses",
          description: "A practical guide to CO2, clean agent, foam, water mist, dry chemical and kitchen hood fire suppression systems.",
          author: { "@type": "Organization", name: "Powerex Fire Protection System" },
          publisher: {
            "@type": "Organization",
            name: "Powerex Fire Protection System",
            logo: { "@type": "ImageObject", url: "https://powerexfire.lovable.app/og-image.jpg" },
          },
          mainEntityOfPage: "https://powerexfire.lovable.app/guides/fire-suppression-systems",
          datePublished: "2026-07-01",
          dateModified: "2026-07-01",
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

const systems = [
  {
    icon: Wind,
    title: "CO2 (Carbon Dioxide) Systems",
    best: "Server rooms, switchgear, generator rooms, flammable liquid stores",
    how: "Floods the protected space with CO2, displacing oxygen below the level that supports combustion. Leaves no residue.",
    pros: ["No residue — safe for electronics", "Extinguishes Class B and electrical (Class C) fires fast", "Cost-effective for unoccupied hazards"],
    cons: ["Life-safety risk in occupied spaces (asphyxiation)", "Requires pre-discharge alarms and evacuation delay", "Not suitable for Class A deep-seated fires alone"],
  },
  {
    icon: Shield,
    title: "Clean Agent Systems (FM-200, Novec 1230, Inergen)",
    best: "Data centres, control rooms, museums, archives, telecom rooms",
    how: "Discharges an electrically non-conductive gas that suppresses fire by absorbing heat or interrupting the combustion chain — safe for people at design concentrations.",
    pros: ["Zero residue — no downtime cleaning", "Safe for occupied areas at design concentration", "Discharges in under 10 seconds"],
    cons: ["Higher upfront cost than CO2 or dry chemical", "Requires a sealed enclosure (room integrity test)", "Agent refill cost after discharge"],
  },
  {
    icon: Droplets,
    title: "Foam Systems (AFFF, AR-AFFF)",
    best: "Fuel depots, aircraft hangars, chemical plants, transformer yards",
    how: "Blankets the fuel surface with an aqueous film that seals vapours and cools the fuel, cutting off oxygen supply.",
    pros: ["Excellent for Class B flammable-liquid fires", "Prevents re-ignition of hot fuel", "Works with fixed systems, monitors and portables"],
    cons: ["Water and foam residue requires cleanup", "Environmental concerns with some agents", "Not for live electrical equipment"],
  },
  {
    icon: Droplets,
    title: "Water Sprinkler & Water Mist",
    best: "Offices, warehouses, hotels, residential towers, machinery spaces",
    how: "Sprinklers open individually when heat activates a glass bulb; water mist uses fine droplets that cool the flame and displace oxygen with steam.",
    pros: ["Proven, code-mandated in most buildings", "Water mist uses far less water — good for heritage sites", "Automatic, 24/7 protection"],
    cons: ["Water damage risk to sensitive contents", "Sprinklers need regular flow and pressure testing", "Not first choice for live electrical panels"],
  },
  {
    icon: Flame,
    title: "Dry Chemical Systems (ABC / BC Powder)",
    best: "Paint booths, vehicles, small industrial hazards, LPG storage",
    how: "Discharges monoammonium phosphate or sodium bicarbonate powder that chemically interrupts the flame chain reaction.",
    pros: ["Very fast knockdown of Class A, B and C fires", "Low cost per kilogram of agent", "Effective outdoors and in windy areas"],
    cons: ["Powder residue damages electronics and machinery", "Reduces visibility during discharge", "Requires thorough post-fire cleanup"],
  },
  {
    icon: Flame,
    title: "Wet Chemical Kitchen Hood Systems",
    best: "Commercial kitchens, restaurants, hotels, canteens",
    how: "Discharges a potassium-based liquid onto cooking appliances, saponifying hot oils into a soapy layer that smothers Class K fires.",
    pros: ["Only agent rated for cooking-oil (Class K) fires", "Cools oils below auto-ignition temperature", "Meets NFPA 96 kitchen requirements"],
    cons: ["Cleanup required after discharge", "Annual servicing mandatory", "Only for kitchen hood hazards"],
  },
];

function Guide() {
  return (
    <>
      <section className="relative overflow-hidden bg-secondary py-16 text-secondary-foreground md:py-24">
        <img src={alarm} alt="" width={1280} height={896} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/50" />
        <div className="relative mx-auto max-w-4xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Guide</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Types of Fire Suppression Systems for Businesses</h1>
          <p className="mt-4 text-secondary-foreground/80">
            Choosing the right fire suppression system protects lives, keeps operations
            running and meets local fire code. This guide compares the six systems most
            commonly specified for Indian businesses — how each works, where it fits, and
            the trade-offs to weigh before you install.
          </p>
        </div>
      </section>

      <article className="mx-auto max-w-4xl px-4 py-16">
        <section className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold">What is a fire suppression system?</h2>
          <p className="mt-3 text-muted-foreground">
            A fire suppression system is a fixed installation that detects fire and
            automatically discharges an extinguishing agent — gas, foam, water or dry
            chemical — into the protected area. Unlike portable extinguishers, suppression
            systems act within seconds, without waiting for a person to intervene, and are
            engineered around the specific hazard: electronics, cooking oil, flammable
            liquid, or ordinary combustibles.
          </p>

          <h2 className="mt-10 text-2xl font-bold">The six main types</h2>
        </section>

        <div className="mt-6 grid gap-6">
          {systems.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold">{s.title}</h3>
              </div>
              <p className="mt-3 text-sm"><span className="font-semibold">Best for:</span> <span className="text-muted-foreground">{s.best}</span></p>
              <p className="mt-2 text-sm"><span className="font-semibold">How it works:</span> <span className="text-muted-foreground">{s.how}</span></p>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">Pros</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {s.pros.map((p) => (
                      <li key={p} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Cons</p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {s.cons.map((c) => (
                      <li key={c} className="flex gap-2"><span className="mt-0.5 text-primary">›</span>{c}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <section className="prose prose-slate mt-12 max-w-none">
          <h2 className="text-2xl font-bold">How to choose the right system</h2>
          <ol className="mt-3 space-y-2 text-muted-foreground">
            <li><strong className="text-foreground">1. Classify the hazard.</strong> Class A (ordinary), B (flammable liquids), C (electrical), or K (cooking oil) — each demands a different agent.</li>
            <li><strong className="text-foreground">2. Consider occupancy.</strong> CO2 is unsafe for occupied rooms; clean agents and water mist are people-safe at design levels.</li>
            <li><strong className="text-foreground">3. Weigh downtime cost.</strong> Data centres and museums justify clean agent's premium because residue-free discharge means zero cleanup.</li>
            <li><strong className="text-foreground">4. Check the local code.</strong> Indian standards (IS 2189, IS 15105, NBC 2016) and NFPA references dictate what's acceptable for your building type.</li>
            <li><strong className="text-foreground">5. Plan for maintenance.</strong> Every system needs annual service, pressure testing and agent recharge — budget for AMC from day one.</li>
          </ol>

          <h2 className="mt-10 text-2xl font-bold">Frequently asked questions</h2>
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-semibold text-foreground">Is a fire suppression system the same as a sprinkler?</p>
              <p className="mt-1 text-muted-foreground">Sprinklers are one type of suppression system. "Fire suppression" also covers gas, foam and dry chemical systems designed for hazards where water isn't the best agent.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">Which system is best for a server room?</p>
              <p className="mt-1 text-muted-foreground">A clean agent system (FM-200 or Novec 1230) is standard for occupied server rooms — it extinguishes fire in seconds, leaves no residue and is safe for people.</p>
            </div>
            <div>
              <p className="font-semibold text-foreground">How often should a suppression system be serviced?</p>
              <p className="mt-1 text-muted-foreground">At least once a year, plus a full agent and cylinder inspection every five years. An annual maintenance contract (AMC) keeps you compliant with IS and NFPA requirements.</p>
            </div>
          </div>
        </section>

        <div className="mt-12 rounded-2xl bg-secondary p-8 text-secondary-foreground md:p-10">
          <h2 className="text-2xl font-bold">Not sure which system fits your site?</h2>
          <p className="mt-2 text-secondary-foreground/80">Our engineers survey your premises, classify the hazard and design a suppression solution that meets code and budget.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Request a site survey</Link>
            <Link to="/services" className="inline-flex items-center gap-2 rounded-md border border-white/20 px-5 py-3 text-sm font-semibold">See all services</Link>
          </div>
        </div>
      </article>
    </>
  );
}