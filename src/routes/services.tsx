import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, Siren, ShieldCheck, Wrench, GraduationCap, HardHat, Droplets, Zap } from "lucide-react";
import alarm from "@/assets/alarm-system.jpg";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Fire Safety Services — Powerex Fire, Mumbai" },
      { name: "description", content: "Full range of fire protection services: ABC/CO2/foam extinguishers, fire alarm systems, hydrant & sprinkler turnkey projects, AMC, refilling and training." },
      { property: "og:title", content: "Powerex Fire — Services" },
      { property: "og:description", content: "Complete fire protection: equipment, installation, AMC, training." },
      { property: "og:url", content: "https://powerexfire.lovable.app/services" },
    ],
    links: [
      { rel: "canonical", href: "https://powerexfire.lovable.app/services" },
    ],
  }),
  component: Services,
});

const services = [
  { icon: Flame, title: "Fire Extinguishers", items: ["ABC dry powder", "CO2", "BC portable", "Foam type", "Water portable", "Modular type", "Fire extinguisher ball", "Clean agent", "Trolley mounted"] },
  { icon: Siren, title: "Fire Alarm Systems", items: ["Automatic fire alarm", "Manual fire alarm", "Smoke & heat detectors", "Hooters & strobes", "Control panels"] },
  { icon: Droplets, title: "Hydrant & Sprinkler", items: ["Sprinkler systems", "Hydrant systems", "Pre-action systems", "Flooding systems", "Turnkey hydrant projects"] },
  { icon: Wrench, title: "Refilling & AMC", items: ["Annual maintenance contracts", "Refilling all extinguisher types", "On-site inspection", "Pressure testing", "Replacement parts"] },
  { icon: HardHat, title: "Personal Protection Equipment", items: ["Safety helmets & shoes", "Boiler suits", "Hi-vis clothing", "Eye & ear protection", "Protective gloves", "Fall arrest harnesses", "Face masks & hoods"] },
  { icon: GraduationCap, title: "Training & Mock Drills", items: ["Basic fire safety training", "Advanced fire safety training", "Corporate training", "Mock drills", "Evacuation planning"] },
  { icon: ShieldCheck, title: "Safety Signage", items: ["Photoluminescent signs", "Floor markings", "Evacuation maps", "Custom signage"] },
  { icon: Zap, title: "Intruder & Access Control", items: ["Intruder alarms", "Access control systems", "CCTV integration"] },
];

function Services() {
  return (
    <>
      <section className="relative overflow-hidden bg-secondary py-16 text-secondary-foreground md:py-24">
        <img src={alarm} alt="" width={1280} height={896} loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/50" />
        <div className="relative mx-auto max-w-6xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Services</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Complete fire safety, under one roof.</h1>
          <p className="mt-4 max-w-2xl text-secondary-foreground/80">
            From a single extinguisher to a full turnkey hydrant project — we design, install,
            maintain and train your team.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article key={s.title} className="rounded-xl border border-border bg-card p-6 transition hover:border-primary hover:shadow-lg">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-lg font-bold">{s.title}</h2>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                {s.items.map((i) => (
                  <li key={i} className="flex gap-2"><span className="text-primary">›</span>{i}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-2xl bg-secondary p-8 text-secondary-foreground md:p-12">
          <h2 className="text-2xl font-bold md:text-3xl">Need a custom solution?</h2>
          <p className="mt-2 text-secondary-foreground/80">Tell us about your site — we'll design a fire safety plan that fits.</p>
          <Link to="/contact" className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Get a free consultation</Link>
        </div>
      </section>
    </>
  );
}