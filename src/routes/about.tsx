import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About HomeTrust" },
      { name: "description", content: "Why HomeTrust is free, who builds it, and how data is sourced." },
    ],
  }),
  component: () => (
    <PageShell>
      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <h1 className="text-4xl font-semibold tracking-tight">About HomeTrust</h1>
        <p className="mt-4 text-muted-foreground">
          We believe livability data should be a public good, and rentals should be safe by default.
          HomeTrust combines open environmental data with strict broker verification to make better housing decisions free for everyone.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <Card className="p-6"><h3 className="font-semibold">Always free</h3><p className="mt-2 text-sm text-muted-foreground">No premium tiers. No paywalls. No subscriptions.</p></Card>
          <Card className="p-6"><h3 className="font-semibold">Open methodology</h3><p className="mt-2 text-sm text-muted-foreground">Every score traces back to public sources or verified field data.</p></Card>
          <Card className="p-6"><h3 className="font-semibold">Verified brokers</h3><p className="mt-2 text-sm text-muted-foreground">Bronze→Platinum verification with KYC, ownership and live photos.</p></Card>
          <Card className="p-6"><h3 className="font-semibold">Built by renters</h3><p className="mt-2 text-sm text-muted-foreground">A small team that's tired of fake listings.</p></Card>
        </div>
      </div>
    </PageShell>
  ),
});
