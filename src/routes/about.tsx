import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Target, Eye, Users, Award } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Powerex Fire Protection System | Vasai, Mumbai" },
      { name: "description", content: "Powerex Fire Protection System has served India since 2010 — GST-verified proprietorship led by Santosh Kumar Yadav, Vasai, Mumbai." },
      { property: "og:title", content: "About Powerex Fire Protection System" },
      { property: "og:description", content: "Trusted fire safety equipment & consulting since 2010." },
      { property: "og:url", content: "https://powerexfire.lovable.app/about" },
    ],
    links: [
      { rel: "canonical", href: "https://powerexfire.lovable.app/about" },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="bg-secondary py-16 text-secondary-foreground md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">About us</p>
          <h1 className="mt-2 text-4xl font-bold md:text-5xl">Extra power to protect against fire.</h1>
          <p className="mt-4 max-w-2xl text-secondary-foreground/80">
            Powerex Fire Protection System is an independent company formed in 2010. Our role is
            to protect the things you value most — through quality equipment, expert installation,
            and reliable service across India.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <div className="prose prose-neutral max-w-none">
          <p>
            The passion behind the name Powerex — extra power to protect against fire — is our
            main focus. We install and service high-quality fire protection and security systems,
            giving every customer an excellent level of service and the best brands at reasonable prices.
          </p>
          <p>
            Our team leader, <strong>Santosh Kumar Yadav</strong>, brings deep knowledge and
            experience in fire protection and security. His drive and commitment have built a team
            of highly qualified, regularly trained technicians.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Target className="h-5 w-5" /></div>
            <h2 className="mt-3 text-xl font-bold">Our Mission</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              To spread our operations worldwide — not only helping clients conclude their safety
              measures, but also educating them on the fundamentals of firefighting equipment and
              consulting services.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Eye className="h-5 w-5" /></div>
            <h2 className="mt-3 text-xl font-bold">Our Vision</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              To deliver best-in-class firefighting equipment and consulting services. We've served
              100+ clients and we strive to provide first-class outcomes on every project.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Users className="h-5 w-5" /></div>
            <h2 className="mt-3 text-xl font-bold">Our Team</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Professionals with deep field knowledge and command of the latest tools — placing us
              in a respectable position across the industry.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"><Award className="h-5 w-5" /></div>
            <h2 className="mt-3 text-xl font-bold">Quality Assurance</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A quality-centric firm — every product is checked against industry norms and is
              valued for superior quality, durability and long service life.
            </p>
          </div>
        </div>

        {/* Verified business */}
        <div className="mt-14 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 p-6 md:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="h-10 w-10 shrink-0 text-primary" />
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Verified business</p>
                <h2 className="mt-1 text-xl font-bold">GST-registered Proprietorship</h2>
              </div>
              <dl className="grid gap-2 text-sm">
                <div><dt className="inline text-muted-foreground">Legal Name: </dt><dd className="inline font-medium">Santosh Kumar Doodhnath Yadav</dd></div>
                <div><dt className="inline text-muted-foreground">Trade Name: </dt><dd className="inline font-medium">Powerex Fire Protection System</dd></div>
                <div><dt className="inline text-muted-foreground">GSTIN: </dt><dd className="inline font-mono font-semibold">27ABKPY1137F1ZH</dd></div>
                <div><dt className="inline text-muted-foreground">Registered: </dt><dd className="inline">20 Dec 2022</dd></div>
              </dl>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}