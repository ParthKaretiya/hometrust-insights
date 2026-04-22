import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { LISTINGS, generateReport, LOCALITIES, verificationProgress } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useMemo, useState } from "react";
import { ArrowLeft, Ban, CalendarClock, Flag, MessageSquare, ShieldCheck, Star } from "lucide-react";
import { VerificationBadge } from "@/components/verification-badge";
import {
  Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious,
} from "@/components/ui/carousel";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";

export const Route = createFileRoute("/listings/$id")({
  head: () => ({ meta: [{ title: "Listing — HomeTrust" }] }),
  component: ListingDetail,
  notFoundComponent: () => (
    <PageShell><div className="px-6 py-20 text-center">Listing not found</div></PageShell>
  ),
});

function ListingDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const listing = LISTINGS.find((l) => l.id === id);
  const blocked = useApp((s) => s.blockedBrokers);
  const toggleBlock = useApp((s) => s.toggleBlockBroker);
  const reportListing = useApp((s) => s.reportListing);
  const [reason, setReason] = useState("Suspicious price");
  const [note, setNote] = useState("");
  const [visitDate, setVisitDate] = useState("");

  if (!listing) {
    return <PageShell><div className="px-6 py-20 text-center">Not found.</div></PageShell>;
  }

  const loc = LOCALITIES.find((l) => l.id === listing.localityId)!;
  const report = useMemo(() => generateReport(loc), [loc.id]);
  const isBlocked = blocked.includes(listing.broker.id);
  const rentHistory = Array.from({ length: 6 }, (_, i) => ({
    m: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"][i],
    rent: listing.price + (i * 600 - 1500),
  }));

  const images = [listing.image, ...LISTINGS.slice(0, 4).filter((x) => x.id !== listing.id).map((x) => x.image)];

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
        <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/listings/browse" })} className="mb-4 gap-1.5 -ml-2">
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </Button>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <Carousel className="overflow-hidden rounded-xl border">
              <CarouselContent>
                {images.map((src, i) => (
                  <CarouselItem key={i}>
                    <div className="aspect-[16/10] bg-muted">
                      <img src={src} alt="" className="h-full w-full object-cover" />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-3" />
              <CarouselNext className="right-3" />
            </Carousel>

            <Card className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight">{listing.title}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{listing.address}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold">₹{listing.price.toLocaleString()}<span className="text-xs font-normal text-muted-foreground">/mo</span></div>
                  <VerificationBadge level={listing.verification} className="mt-1" />
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs">
                  <span className="font-medium">Verification progress</span>
                  <span className="text-muted-foreground">{listing.verification} · {listing.trustScore}/100 trust</span>
                </div>
                <Progress value={verificationProgress(listing.verification)} />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-y-3 text-sm sm:grid-cols-4">
                {[
                  ["BHK", `${listing.bhk}`],
                  ["Area", `${listing.area} sqft`],
                  ["Furnishing", listing.furnishing],
                  ["Posted", new Date(listing.postedAt).toLocaleDateString()],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-muted-foreground">{k}</div>
                    <div className="font-medium">{v}</div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-base font-semibold">Rent history</h3>
              <div className="mt-3">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={rentHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="m" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="rent" stroke="oklch(0.55 0.16 245)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-base font-semibold">Neighborhood at a glance</h3>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Walk Score", v: report.scores.walkability },
                  { label: "Transit Score", v: report.scores.transit },
                  { label: "Safety", v: report.scores.crime },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border p-3">
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                    <div className="mt-0.5 text-2xl font-semibold tabular-nums">{s.v}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {["Cafés nearby", "Pet-friendly", "Quiet", "Near metro", "Green"].map((t) => (
                  <Badge key={t} variant="outline">{t}</Badge>
                ))}
              </div>
              <Link to="/report/result" search={{ location: loc.id }} className="mt-4 inline-block text-sm text-primary hover:underline">
                View full neighborhood report →
              </Link>
            </Card>
          </div>

          <div className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            <Card className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {listing.broker.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div className="font-medium">{listing.broker.name}</div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{listing.broker.rating}</span>
                    <span>· {listing.broker.years}y</span>
                    <span>· {listing.broker.responseRate}% reply</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-2">
                <Button className="gap-2" onClick={() => toast.success("Message sent (mock)")}>
                  <MessageSquare className="h-4 w-4" /> Contact broker
                </Button>
                <Button variant="outline" className="gap-2" onClick={() => { toggleBlock(listing.broker.id); toast.success(isBlocked ? "Unblocked" : "Broker blocked"); }}>
                  <Ban className="h-4 w-4" /> {isBlocked ? "Unblock" : "Block broker"}
                </Button>
              </div>
            </Card>

            <Card className="p-5">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full gap-2"><CalendarClock className="h-4 w-4" /> Request visit</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Request a visit</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <Label>Date & time</Label>
                    <Input type="datetime-local" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
                    {visitDate && (
                      <div className="rounded-lg border p-4 text-center">
                        <div className="mb-2 text-xs text-muted-foreground">Show this QR at the property</div>
                        <div className="flex justify-center">
                          <QRCodeSVG value={`hometrust:visit:${listing.id}:${visitDate}`} size={140} />
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button onClick={() => toast.success("Visit confirmed")}>Confirm</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="mt-2 w-full gap-2 text-destructive hover:text-destructive">
                    <Flag className="h-4 w-4" /> Report fake listing
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Report this listing</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <Label>Reason</Label>
                      <Select value={reason} onValueChange={setReason}>
                        <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Suspicious price">Suspicious price</SelectItem>
                          <SelectItem value="Fake photos">Fake photos</SelectItem>
                          <SelectItem value="Already rented">Already rented</SelectItem>
                          <SelectItem value="Broker scam">Broker scam</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div><Label>Notes</Label><Textarea value={note} onChange={(e) => setNote(e.target.value)} className="mt-1.5" /></div>
                  </div>
                  <DialogFooter>
                    <Button onClick={() => { reportListing(listing.id, reason, note); toast.success("Sent to moderators"); }}>Submit</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>

            <Card className="p-5">
              <div className="flex items-center gap-2 text-sm font-medium"><ShieldCheck className="h-4 w-4 text-success" /> Why we trust this listing</div>
              <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                <li>• KYC-verified broker</li>
                <li>• Live photos uploaded</li>
                <li>• Ownership document verified</li>
                <li>• No duplicate-photo flags</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
