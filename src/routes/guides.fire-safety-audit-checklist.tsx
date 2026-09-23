import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, FileText, Flame, UserCheck, Building2, ClipboardList, ArrowRight } from "lucide-react";

const faqs = [
  {
    q: "How often should a fire safety audit be done?",
    a: "A full internal check every month and a professional third-party audit at least once a year. High-occupancy buildings (factories, hotels, hospitals) should also rehearse an evacuation drill every six months, as recommended under IS 2190 and the National Building Code.",
  },
  {
    q: "Is a fire NOC mandatory in Maharashtra?",
    a: "Yes. Any premises above the height or occupancy thresholds set by the Maharashtra Fire Prevention and Life Safety Measures Act must obtain a Fire NOC from the Directorate of Fire Services — renewed every year for most commercial buildings.",
  },
  {
    q: "What documents should be ready before an inspection?",
    a: "Keep your extinguisher inspection tags and refill records, AMC contracts, alarm and hydrant commissioning certificates, evacuation plan, and staff training records in one file. Missing documentation is the most common reason an otherwise safe building fails an audit.",
  },
  {
    q: "Who can carry out the audit — can we do it ourselves?",
    a: "Staff should do monthly walk-through checks with a checklist, but the annual statutory audit and Fire NOC renewal require a licensed fire-protection agency. Powerex Fire carries out audits, rectification work and NOC-ready documentation across Mumbai and Vasai-Virar.",
  },
];

const sections = [
  {
    icon: Flame,
    title: "1. Portable extinguishers",
    items: [
      "Correct extinguisher type for each hazard area (ABC, CO2, foam, wet chemical for kitchens)",
      "One extinguisher per 600 sq. ft. of covered floor area, travel distance under 15 m",
      "Wall-mounted on brackets, handle 1 m from the floor, unobstructed access",
      "Pressure gauge needle in the green zone; safety pin and tamper seal intact",
      "Valid inspection tag — serviced within the last 12 months",
    ],
  },
  {
    icon: Building2,
    title: "2. Alarm & detection systems",
    items: [
      "Smoke/heat detectors present in every required zone, including basements and staircases",
      "Manual call points at every exit and on each floor, height 1.2 m",
      "Control panel shows no fault, supervisory or battery alerts",
      "Hooters audible in every occupied area above ambient noise",
      "System tested end-to-end with a walk test within the last quarter",
    ],
  },
  {
    icon: ClipboardList,
    title: "3. Exits & evacuation",
    items: [
      "Escape routes and staircases clear of storage, boxes and locked doors",
      "Exit doors open outward and without keys or bolts during working hours",
      "Illuminated exit signage and emergency lights working on battery backup",
      "Assembly point marked and known to all staff",
      "Evacuation plan displayed on every floor with 'You Are Here' markers",
    ],
  },
  {
    icon: ClipboardCheck,
    title: "4. Fixed systems (hydrants, sprinklers, suppression)",
    items: [
      "Hydrant hose boxes, valves and landing valves accessible and undamaged",
      "Static water tank at required capacity; pump auto-start tested weekly",
      "Sprinkler heads unobstructed — at least 500 mm clear below each head",
      "Kitchen hood suppression and clean-agent systems serviced and pressure-checked",
      "No pending faults or isolate valves left closed after maintenance",
    ],
  },
  {
    icon: FileText,
    title: "5. Documentation & compliance",
    items: [
      "Fire NOC current and displayed; renewal date in your calendar",
      "AMC contracts and service reports for extinguishers, alarms, hydrants on file",
      "Refill and hydrostatic test records traceable to each extinguisher serial number",
      "Fire safety plan and register maintained as per IS 2190",
      "Names of trained floor wardens updated with the latest joining staff",
    ],
  },
  {
    icon: UserCheck,
    title: "6. People & training",
    items: [
      "All staff trained on raising an alarm, calling emergency services and first response",
      "Mock drill conducted in the last six months, with findings recorded and corrected",
      "Fire wardens appointed per floor and per shift, including night shifts",
      "Contract housekeeping and security staff included in training",
      "Emergency contact list (fire brigade 101, AMC provider, electrician) posted at the panel",
    ],
  },
];

export const Route = createFileRoute("/guides/fire-safety-audit-checklist")({
  head: () => ({
    meta: [
      { title: "Fire Safety Audit Checklist for Offices & Factories (India)" },
      { name: "description", content: "A practical 6-part fire safety audit checklist for Indian offices and factories — extinguishers, alarms, exits, hydrants, NOC documentation and staff training." },
      { property: "og:title", content: "Fire Safety Audit Checklist for Offices & Factories (India)" },
      { property: "og:description", content: "Extinguishers, alarms, exits, hydrants, NOC paperwork and training — run a complete fire safety audit before the inspector does." },
      { property: "og:url", content: "https://powerexfire.in/guides/fire-safety-audit-checklist" },
      { property: "og:image", content: "https://powerexfire.in/og-image.jpg" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://powerexfire.in/og-image.jpg" },
    ],
    links: [
      { rel: "canonical", href: "https://powerexfire.in/guides/fire-safety-audit-checklist" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "Fire Safety Audit Checklist for Offices & Factories (India)",
          description: "A practical 6-part fire safety audit checklist for Indian workplaces — extinguishers, alarms, exits, hydrants, documentation and training.",
          author: { "@type": "Organization", name: "Powerex Fire Protection System" },
          publisher: {
            "@type": "Organization",
            name: "Powerex Fire Protection System",
            logo: { "@type": "ImageObject", url: "https://powerexfire.in/og-image.jpg" },
          },
          mainEntityOfPage: "https://powerexfire.in/guides/fire-safety-audit-checklist",
          datePublished: "2026-09-23",
          dateModified: "2026-09-23",
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
  component: AuditChecklistGuide,
});

function AuditChecklistGuide() {
  return (
    <>
      <section className="bg-secondary py-14 text-secondary-foreground md:py-18">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Safety Guide</p>
          <h1 className="mt-2 text-3xl font-bold md:text-5xl">
            Fire safety audit checklist for offices &amp; factories
          </h1>
          <p className="mt-4 max-w-2xl text-secondary-foreground/85">
            Most buildings fail inspections on small, missed basics — not on major systems. Run this
            six-part checklist before the inspector does, and know exactly what to fix.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <div className="space-y-10">
          {sections.map((s) => (
            <div key={s.title} className="rounded-xl border border-border bg-card p-6">
              <h2 className="flex items-center gap-3 text-xl font-bold">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                {s.title}
              </h2>
              <ul className="mt-4 space-y-2.5">
                {s.items.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                    <ClipboardCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-6">
          <h2 className="text-lg font-bold">Scored below full marks?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Powerex Fire carries out audits, rectification and NOC-ready documentation across Mumbai,
            Vasai-Virar and Thane — from refilling a single extinguisher to full hydrant projects.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              Book a fire audit <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center rounded-md border border-input px-5 py-2.5 text-sm font-semibold transition hover:bg-muted"
            >
              Browse services
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold md:text-3xl">Frequently asked questions</h2>
          <div className="mt-6 divide-y divide-border rounded-xl border border-border bg-card">
            {faqs.map((f) => (
              <details key={f.q} className="group p-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-base font-semibold">
                  {f.q}
                  <span className="text-primary transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-xl bg-muted p-6">
          <h2 className="text-lg font-bold">Keep reading</h2>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link to="/guides/fire-extinguisher-types" className="text-primary hover:underline">
                Fire extinguisher types &amp; classes — India buyer's guide
              </Link>
            </li>
            <li>
              <Link to="/guides/fire-suppression-systems" className="text-primary hover:underline">
                Types of fire suppression systems explained
              </Link>
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
