import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LISTINGS } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { Filter, Flag, Map, Search, ShieldCheck, Star, Grid2x2 } from "lucide-react";
import { VerificationBadge } from "@/components/verification-badge";
import { MapView } from "@/components/map-view";
import { toast } from "sonner";

export const Route = createFileRoute("/listings/browse")({
  head: () => ({ meta: [{ title: "Verified Rentals — HomeTrust" }] }),
  component: BrowsePage,
});

function BrowsePage() {
  const reportListing = useApp((s) => s.reportListing);
  const [q, setQ] = useState("");
  const [view, setView] = useState("grid");
  const [trustedOnly, setTrustedOnly] = useState(false);
  const [bhk, setBhk] = useState([]);
  const [verifs, setVerifs] = useState([]);
  const [price, setPrice] = useState([10000, 100000]);
  const [minTrust, setMinTrust] = useState(0);
  const [sort, setSort] = useState("trust");

  const results = useMemo(() => {
    let r = LISTINGS.filter(
      (l) =>
        (q ? `${l.title} ${l.address}`.toLowerCase().includes(q.toLowerCase()) : true) &&
        (bhk.length ? bhk.includes(l.bhk) : true) &&
        (verifs.length ? verifs.includes(l.verification) : true) &&
        l.price >= price[0] &&
        l.price <= price[1] &&
        l.trustScore >= minTrust &&
        (!trustedOnly || ["Gold", "Platinum", "Silver"].includes(l.verification)),
    );
    if (sort === "trust") r = [...r].sort((a, b) => b.trustScore - a.trustScore);
    if (sort === "price") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "new") r = [...r].sort((a, b) => +new Date(b.postedAt) - +new Date(a.postedAt));
    return r;
  }, [q, bhk, verifs, price, minTrust, trustedOnly, sort]);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Verified rentals</h1>
            <p className="mt-1 text-sm text-muted-foreground">Every listing is checked. Filter by verification & trust score.</p>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="trusted" checked={trustedOnly} onCheckedChange={setTrustedOnly} />
            <Label htmlFor="trusted" className="flex items-center gap-1.5 text-sm">
              <ShieldCheck className="h-3.5 w-3.5" /> Trusted only
            </Label>
          </div>
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search address or area" className="pl-9" />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <Label className="text-sm">Price range (₹/mo)</Label>
                  <div className="mt-3">
                    <Slider
                      min={5000}
                      max={150000}
                      step={1000}
                      value={price}
                      onValueChange={(v) => setPrice([v[0], v[1]])}
                    />
                  </div>
                  <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                    <span>₹{price[0].toLocaleString()}</span>
                    <span>₹{price[1].toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm">BHK</Label>
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((n) => (
                      <label key={n} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                        <Checkbox
                          checked={bhk.includes(n)}
                          onCheckedChange={(c) => setBhk(c ? [...bhk, n] : bhk.filter((x) => x !== n))}
                        />
                        {n} BHK
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Verification</Label>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {["Bronze", "Silver", "Gold", "Platinum"].map((v) => (
                      <label key={v} className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm">
                        <Checkbox
                          checked={verifs.includes(v)}
                          onCheckedChange={(c) =>
                            setVerifs(c ? [...verifs, v] : verifs.filter((x) => x !== v))
                          }
                        />
                        {v}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Min trust score: {minTrust}</Label>
                  <div className="mt-3">
                    <Slider min={0} max={100} step={5} value={[minTrust]} onValueChange={(v) => setMinTrust(v[0])} />
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trust">Reliability</SelectItem>
              <SelectItem value="price">Price: low to high</SelectItem>
              <SelectItem value="new">Newest</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex rounded-md border p-0.5">
            <Button
              size="sm"
              variant={view === "grid" ? "secondary" : "ghost"}
              onClick={() => setView("grid")}
              className="h-8 gap-1.5"
            >
              <Grid2x2 className="h-3.5 w-3.5" />
              Grid
            </Button>
            <Button
              size="sm"
              variant={view === "map" ? "secondary" : "ghost"}
              onClick={() => setView("map")}
              className="h-8 gap-1.5"
            >
              <Map className="h-3.5 w-3.5" />
              Map
            </Button>
          </div>
        </div>

        <div className="mb-3 text-sm text-muted-foreground">{results.length} listings</div>

        {view === "grid" ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => (
              <Card key={l.id} className="group overflow-hidden p-0 transition-shadow hover:shadow-md">
                <Link to="/listings/$id" params={{ id: l.id }} className="block">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={l.image}
                      alt={l.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3">
                      <VerificationBadge level={l.verification} />
                    </div>
                    <div className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-background/90 text-xs font-semibold shadow">
                      {l.trustScore}
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-lg font-semibold">
                        ₹{l.price.toLocaleString()}
                        <span className="text-xs font-normal text-muted-foreground">/mo</span>
                      </div>
                      <div className="truncate text-sm">{l.title}</div>
                      <div className="truncate text-xs text-muted-foreground">{l.address}</div>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        reportListing(l.id, "Suspicious", "");
                        toast.success("Reported to moderation");
                      }}
                      aria-label="Report fake"
                    >
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{l.broker.name}</span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      {l.broker.rating}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden p-0">
            <MapView
              lat={results[0]?.lat ?? 12.97}
              lng={results[0]?.lng ?? 77.59}
              zoom={11}
              height={560}
              markers={results.map((r) => ({ id: r.id, lat: r.lat, lng: r.lng, label: r.title }))}
            />
          </Card>
        )}

        {results.length === 0 && (
          <div className="rounded-xl border border-dashed py-16 text-center text-sm text-muted-foreground">
            No listings match.{" "}
            <button
              className="text-primary underline"
              onClick={() => {
                setBhk([]);
                setVerifs([]);
                setMinTrust(0);
                setPrice([10000, 100000]);
              }}
            >
              Reset filters
            </button>
            .
          </div>
        )}
      </div>
    </PageShell>
  );
}
