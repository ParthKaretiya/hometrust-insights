import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LISTINGS } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { Check, X } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { VerificationBadge } from "@/components/verification-badge";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin — HomeTrust" }] }),
  component: AdminDash,
});

function AdminDash() {
  const reported = useApp((s) => s.reportedListings);

  const fakeByCity = [
    { city: "BLR", pct: 4 },
    { city: "MUM", pct: 7 },
    { city: "DEL", pct: 9 },
    { city: "HYD", pct: 3 },
    { city: "CHN", pct: 5 },
    { city: "KOL", pct: 6 },
  ];
  const offenders = [
    { name: "Quickfix Realty", n: 12 },
    { name: "Easy Homes", n: 9 },
    { name: "Star Properties", n: 7 },
    { name: "City Brokers", n: 4 },
  ];
  const COLORS = ["oklch(0.55 0.16 245)", "oklch(0.65 0.16 150)", "oklch(0.78 0.14 75)", "oklch(0.6 0.22 25)"];

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <h1 className="mb-1 text-3xl font-semibold tracking-tight">Admin moderation</h1>
        <p className="mb-6 text-sm text-muted-foreground">Keep the marketplace safe.</p>

        <div className="mb-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total listings", v: 1248 },
            { label: "Fake reported %", v: "5.4%" },
            { label: "Active brokers", v: 187 },
          ].map((s) => (
            <Card key={s.label} className="p-5">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div className="mt-1 text-3xl font-semibold tabular-nums">{s.v}</div>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="reported" className="mb-6">
          <TabsList>
            <TabsTrigger value="reported">Reported ({reported.length || 4})</TabsTrigger>
            <TabsTrigger value="verif">Verification queue</TabsTrigger>
            <TabsTrigger value="ai">AI flagged</TabsTrigger>
          </TabsList>

          <TabsContent value="reported">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Property</th>
                      <th className="px-4 py-3 text-left font-medium">Reason</th>
                      <th className="px-4 py-3 text-left font-medium">Risk</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LISTINGS.slice(0, 4).map((l, i) => (
                      <tr key={l.id} className="border-b last:border-0">
                        <td className="px-4 py-3">
                          <div className="font-medium">{l.title}</div>
                          <div className="text-xs text-muted-foreground">{l.address}</div>
                        </td>
                        <td className="px-4 py-3">
                          {["Fake photos", "Suspicious price", "Already rented", "Broker scam"][i]}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="bg-danger/10 text-danger border-danger/30">
                            {60 + i * 8}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => toast.success("Report dismissed")}>
                              <Check className="h-3.5 w-3.5" /> Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => toast.success("Listing removed · broker striked")}
                            >
                              <X className="h-3.5 w-3.5" /> Remove
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="verif">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {LISTINGS.slice(4, 10).map((l) => (
                <Card key={l.id} className="overflow-hidden p-0">
                  <img src={l.image} alt="" className="aspect-video w-full object-cover" />
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{l.broker.name}</div>
                      <VerificationBadge level={l.verification} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Requesting Gold · {l.address}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" className="flex-1" onClick={() => toast.success("Approved")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toast.success("Rejected")}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="ai">
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Listing</th>
                      <th className="px-4 py-3 text-left font-medium">Flag</th>
                      <th className="px-4 py-3 text-left font-medium">Confidence</th>
                      <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {LISTINGS.slice(10, 16).map((l, i) => (
                      <tr key={l.id} className="border-b last:border-0">
                        <td className="px-4 py-3">{l.title}</td>
                        <td className="px-4 py-3">{["Price anomaly", "Duplicate photos"][i % 2]}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                              <div className="h-full bg-primary" style={{ width: `${70 + i * 4}%` }} />
                            </div>
                            <span className="text-xs tabular-nums">{70 + i * 4}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="outline">Dismiss</Button>
                            <Button size="sm" variant="destructive">Remove</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="mb-3 text-base font-semibold">Fake % by city</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={fakeByCity}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="pct" fill="oklch(0.6 0.22 25)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5">
            <h3 className="mb-3 text-base font-semibold">Top offending brokers</h3>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={offenders} dataKey="n" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                  {offenders.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
