import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/layout";
import {
  ArrowRight, BarChart3, MapPin, ShieldCheck, Sparkles, Star, TrendingUp, Wind,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HomeTrust — Know Your Neighborhood, Rent with Confidence" },
      { name: "description", content: "Free, institutional-grade neighborhood reports and a scam-free verified rental marketplace. No subscriptions. Ever." },
      { property: "og:title", content: "HomeTrust — Free Neighborhood Reports & Verified Rentals" },
      { property: "og:description", content: "Air quality, walkability, flood risk, crime, schools — all in one livability score. Plus a marketplace where every broker is verified." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <PageShell>
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(60%_50%_at_50%_0%,black,transparent)]">
          <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-5 gap-1.5 border-primary/30 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3" /> 100% free · No subscriptions
            </Badge>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Know your neighborhood.<br />
              <span className="bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent">
                Rent with confidence.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
              Institutional-grade livability reports for any address in India, plus a verified rental marketplace where every broker is checked.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link to="/report/search">
                  <BarChart3 className="h-4 w-4" /> Search reports <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link to="/listings/browse">
                  <ShieldCheck className="h-4 w-4" /> Find verified rentals
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> KYC-verified brokers</div>
              <div className="flex items-center gap-1.5"><Wind className="h-3.5 w-3.5" /> Live AQI & climate data</div>
              <div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> 1km amenity radius</div>
              <div className="flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5" /> 7-day trends</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: BarChart3, title: "11 livability signals", body: "Air quality, walkability, flood risk, safety, transit, schools, hospitals, green cover, internet, power & noise." },
            { icon: ShieldCheck, title: "Verified brokers only", body: "Bronze · Silver · Gold · Platinum verification with KYC, ownership proof and live photos." },
            { icon: TrendingUp, title: "Compare any 3 areas", body: "Side-by-side scoring across every parameter with city-average benchmarks." },
          ].map((f, i) => (
            <Card key={i} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-16 md:px-6">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight">Trusted by renters across India</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "Ananya, Bengaluru", text: "Avoided a fake listing thanks to the trust score. Found a verified Gold broker in 2 days." },
              { name: "Rohan, Mumbai", text: "The flood-risk data alone saved me from a bad lease in Powai monsoon season." },
              { name: "Meera, Delhi", text: "Side-by-side comparison made choosing between Hauz Khas and CP a five-minute decision." },
            ].map((t, i) => (
              <Card key={i} className="p-6">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-3 text-sm">{t.text}</p>
                <p className="mt-4 text-xs font-medium text-muted-foreground">{t.name}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6">
        <Card className="overflow-hidden bg-gradient-to-br from-primary to-primary/80 p-10 text-primary-foreground md:p-14">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">Generate your first report</h2>
              <p className="mt-2 max-w-xl text-primary-foreground/80">No signup required. Pick a neighborhood and get a full livability dashboard in seconds.</p>
            </div>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link to="/report/search">Start now <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
