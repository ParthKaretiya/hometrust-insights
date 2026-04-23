import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LISTINGS } from "@/lib/mock-data";
import { Edit, Plus, QrCode, Trash2 } from "lucide-react";
import { VerificationBadge } from "@/components/verification-badge";
import { QRCodeSVG } from "qrcode.react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/broker/dashboard")({
  head: () => ({ meta: [{ title: "Broker Dashboard — HomeTrust" }] }),
  component: BrokerDash,
});

function BrokerDash() {
  const myListings = LISTINGS.slice(0, 8);
  const stats = [
    { label: "Total Listings", v: myListings.length },
    { label: "Active", v: 6, tone: "success" },
    { label: "Pending", v: 2, tone: "warning" },
    { label: "Reported", v: 1, tone: "danger" },
    { label: "Views (24h)", v: 412 },
    { label: "Contacts", v: 38 },
    { label: "Strikes", v: "0/3", tone: "success" },
  ];

  const views = Array.from({ length: 7 }, (_, i) => ({ d: `D${i + 1}`, v: 60 + ((i * 19) % 80) }));
  const funnel = [
    { stage: "Views", n: 412 },
    { stage: "Saves", n: 89 },
    { stage: "Contacts", n: 38 },
    { stage: "Visits", n: 12 },
  ];

  const [step, setStep] = useState(1);
  const [qrFor, setQrFor] = useState(null);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Broker Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your verified listings.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> Add new listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>New listing — Step {step} of 6</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                {step === 1 && (
                  <>
                    <Label>Address</Label>
                    <Input placeholder="123, Indiranagar, Bengaluru" />
                  </>
                )}
                {step === 2 && (
                  <>
                    <Label>BHK / Rent / Area</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="2" />
                      <Input placeholder="₹35000" />
                      <Input placeholder="900 sqft" />
                    </div>
                  </>
                )}
                {step === 3 && (
                  <>
                    <Label>KYC document</Label>
                    <Input type="file" />
                  </>
                )}
                {step === 4 && (
                  <>
                    <Label>Ownership proof</Label>
                    <Input type="file" />
                  </>
                )}
                {step === 5 && (
                  <>
                    <Label>Live photos</Label>
                    <Input type="file" multiple />
                  </>
                )}
                {step === 6 && (
                  <>
                    <Label>Video walkthrough</Label>
                    <Input type="file" accept="video/*" />
                  </>
                )}
                <div className="flex h-1 overflow-hidden rounded-full bg-muted">
                  <div className="bg-primary transition-all" style={{ width: `${(step / 6) * 100}%` }} />
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-between">
                <Button variant="outline" disabled={step === 1} onClick={() => setStep(step - 1)}>
                  Back
                </Button>
                {step < 6 ? (
                  <Button onClick={() => setStep(step + 1)}>Next</Button>
                ) : (
                  <Button
                    onClick={() => {
                      toast.success("Listing submitted for verification");
                      setStep(1);
                    }}
                  >
                    Submit
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6 grid gap-3 grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
          {stats.map((s) => (
            <Card key={s.label} className="p-4">
              <div className="text-xs text-muted-foreground">{s.label}</div>
              <div
                className={cn(
                  "mt-1 text-2xl font-semibold tabular-nums",
                  s.tone === "success" && "text-success",
                  s.tone === "warning" && "text-warning",
                  s.tone === "danger" && "text-danger",
                )}
              >
                {s.v}
              </div>
            </Card>
          ))}
        </div>

        <Card className="mb-6 overflow-hidden">
          <div className="border-b p-4 font-semibold">My listings</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Address</th>
                  <th className="px-4 py-3 text-left font-medium">Verification</th>
                  <th className="px-4 py-3 text-left font-medium">Trust</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {myListings.map((l) => (
                  <tr key={l.id} className="border-b last:border-0">
                    <td className="px-4 py-3">
                      <div className="font-medium">{l.title}</div>
                      <div className="text-xs text-muted-foreground">{l.address}</div>
                    </td>
                    <td className="px-4 py-3">
                      <VerificationBadge level={l.verification} />
                    </td>
                    <td className="px-4 py-3 tabular-nums">{l.trustScore}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline">Active</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" onClick={() => setQrFor(l.id)} aria-label="QR">
                          <QrCode className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Delete" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Dialog open={!!qrFor} onOpenChange={(v) => !v && setQrFor(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Property QR</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-3 py-2">
              {qrFor && <QRCodeSVG value={`hometrust:listing:${qrFor}`} size={180} />}
              <div className="text-xs text-muted-foreground">Print and display at the property entrance.</div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="text-base font-semibold">Views (last 7 days)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={views}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="d" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="oklch(0.55 0.16 245)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
          <Card className="p-5">
            <h3 className="text-base font-semibold">Contact funnel</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={funnel}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="stage" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="n" fill="oklch(0.55 0.16 245)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}
