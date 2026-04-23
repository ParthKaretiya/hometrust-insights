import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/layout";
import { MapView } from "@/components/map-view";
import { LOCALITIES, generateReport } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { Heart, Locate, MapPin, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/report/search")({
  head: () => ({ meta: [{ title: "Search Neighborhood Reports — HomeTrust" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(LOCALITIES[0]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = useApp((s) => s.user);
  const favorites = useApp((s) => s.favoriteLocalities);
  const toggleFavorite = useApp((s) => s.toggleFavorite);
  const saveReport = useApp((s) => s.saveReport);

  const matches = q
    ? LOCALITIES.filter((l) => `${l.name} ${l.city}`.toLowerCase().includes(q.toLowerCase()))
    : LOCALITIES.slice(0, 6);

  const generate = () => {
    setLoading(true);
    setTimeout(() => {
      const report = generateReport(selected);
      saveReport(report);
      setLoading(false);
      navigate({ to: "/report/result", search: { location: selected.id } });
    }, 700);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocation unavailable");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const nearest = [...LOCALITIES].sort((a, b) => {
          const da = (a.lat - pos.coords.latitude) ** 2 + (a.lng - pos.coords.longitude) ** 2;
          const db = (b.lat - pos.coords.latitude) ** 2 + (b.lng - pos.coords.longitude) ** 2;
          return da - db;
        })[0];
        setSelected(nearest);
        toast.success(`Nearest: ${nearest.name}`);
      },
      () => toast.error("Could not get location"),
    );
  };

  const isFav = favorites.includes(selected.id);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
        <div className="mb-8 max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Search a neighborhood</h1>
          <p className="mt-2 text-muted-foreground">Find any locality in India and generate a free livability report.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <Card className="p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Try Koramangala, Powai, Hauz Khas…"
                className="pl-9"
              />
            </div>

            <div className="mt-4 space-y-1">
              <div className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">Suggestions</div>
              <div className="max-h-72 overflow-y-auto">
                {matches.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted",
                      selected.id === l.id && "bg-muted",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{l.name}</span>
                      <span className="text-muted-foreground">· {l.city}</span>
                    </span>
                    {favorites.includes(l.id) && <Heart className="h-3.5 w-3.5 fill-destructive text-destructive" />}
                  </button>
                ))}
                {matches.length === 0 && (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">No matches.</div>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={useMyLocation} className="gap-2">
                <Locate className="h-3.5 w-3.5" /> Use my location
              </Button>
              {user && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    toggleFavorite(selected.id);
                    toast.success(isFav ? "Removed from favorites" : "Saved to favorites");
                  }}
                >
                  <Heart className={cn("h-3.5 w-3.5", isFav && "fill-destructive text-destructive")} />
                  {isFav ? "Favorited" : "Save to favorites"}
                </Button>
              )}
              <Button asChild variant="ghost" size="sm">
                <Link to="/report/saved">View saved reports</Link>
              </Button>
            </div>

            <Button onClick={generate} disabled={loading} size="lg" className="mt-6 w-full gap-2">
              <Sparkles className="h-4 w-4" />
              {loading ? "Generating report…" : `Generate free report for ${selected.name}`}
            </Button>
          </Card>

          <div className="space-y-3">
            <MapView lat={selected.lat} lng={selected.lng} zoom={13} radiusMeters={1000} height={420} />
            <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 text-sm">
              <div>
                <div className="font-medium">{selected.name}</div>
                <div className="text-xs text-muted-foreground">
                  {selected.city} · {selected.lat.toFixed(3)}, {selected.lng.toFixed(3)}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">1km radius shown</div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
