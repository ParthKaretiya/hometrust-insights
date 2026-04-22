import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LOCALITIES, PARAMS, generateReport, scoreLabel, type ParamKey } from "@/lib/mock-data";
import { useApp } from "@/lib/store";
import { useMemo, useState } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  ArrowLeft, BookmarkPlus, ChevronDown, Download, GitCompareArrows, Share2, ThumbsDown, ThumbsUp,
} from "lucide-react";
import { toast } from "sonner";
import { MapView } from "@/components/map-view";
import { ScoreDot } from "@/components/verification-badge";
import { cn } from "@/lib/utils";

const search = z.object({
  location: fallback(z.string(), "koramangala").default("koramangala"),
});

export const Route = createFileRoute("/report/result")({
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Neighborhood Report — HomeTrust" }] }),
  component: ResultPage,
});

function ResultPage() {
  const { location } = Route.useSearch();
  const navigate = useNavigate();
  const locality = LOCALITIES.find((l) => l.id === location) ?? LOCALITIES[0];
  const report = useMemo(() => generateReport(locality), [locality.id]);
  const saveReport = useApp((s) => s.saveReport);
  const [expanded, setExpanded] = useState<ParamKey | null>(null);
  const tone = scoreLabel(report.overall);

  const compareData = PARAMS.map((p) => ({
    name: p.label.split(" ")[0],
    score: report.scores[p.key],
    city: report.cityAverage[p.key],
  }));

  const detailsForParam = (key: ParamKey) => {
    const trend = report.trend[key];
    return (
      <div className="mt-3 rounded-lg border bg-muted/30 p-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">7-day trend</div>
            <ResponsiveContainer width="100%" height={140}>
              <LineChart data={trend.map((v, i) => ({ d: `D${i + 1}`, v }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis dataKey="d" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="v" stroke="oklch(0.55 0.16 245)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="text-sm">
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Insight</div>
            {key === "aqi" && <p>PM2.5: 48 µg/m³ · PM10: 92 µg/m³ · NO₂: 21 ppb. Mornings are cleanest; evening rush degrades AQI by ~30%.</p>}
            {key === "walkability" && <p>Within 1km: 18 cafés, 12 grocers, 6 pharmacies, 4 parks. Median pedestrian distance to essentials: 380m.</p>}
            {key === "flood" && <p>Elevation: 902m. Last severe waterlogging: 2022 monsoon. Drainage upgraded in 2023.</p>}
            {key === "crime" && <p>Reported incidents (12 mo): 0.4% above city average. Strong police visibility after 9pm.</p>}
            {key === "noise" && <p>Daytime avg: 62dB. Nighttime avg: 48dB. Quietest blocks: residential interior streets.</p>}
            {key === "transit" && <p>Nearest metro: 1.1km · Bus stops: 7 within 800m · Auto availability: high.</p>}
            {key === "schools" && <p>9 schools within 2km, 3 rated 8+/10. Avg commute: 12 min.</p>}
            {key === "hospitals" && <p>2 multi-specialty hospitals within 3km · 24x7 pharmacies: 4.</p>}
            {key === "green" && <p>Green cover: 22%. Two parks &gt; 5 acres within 1.5km.</p>}
            {key === "internet" && <p>Median fiber speed: 220 Mbps · 4 ISPs available · 5G coverage: 92%.</p>}
            {key === "power" && <p>Avg outages: 1.2/month, &lt; 30 min each. Grid stability: high.</p>}
          </div>
        </div>
      </div>
    );
  };

  const overallColor = report.overall >= 65 ? "oklch(0.65 0.16 150)" : report.overall >= 45 ? "oklch(0.78 0.14 75)" : "oklch(0.6 0.22 25)";

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <Button variant="ghost" size="sm" asChild className="mb-4 gap-1.5 -ml-2">
          <Link to="/report/search"><ArrowLeft className="h-4 w-4" /> Back to search</Link>
        </Button>

        <Card className="overflow-hidden">
          <div className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
            <div className="h-32 w-32">
              <CircularProgressbar
                value={report.overall}
                text={`${report.overall}`}
                styles={buildStyles({
                  pathColor: overallColor,
                  textColor: "currentColor",
                  trailColor: "hsl(var(--muted))",
                  textSize: "28px",
                })}
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{locality.name}</h1>
                <Badge variant="outline">{locality.city}</Badge>
                <Badge className={cn(
                  tone.tone === "success" && "bg-success/15 text-success border-success/30",
                  tone.tone === "warning" && "bg-warning/15 text-warning border-warning/30",
                  tone.tone === "danger" && "bg-danger/15 text-danger border-danger/30",
                )} variant="outline">{tone.label}</Badge>
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                Report ID {report.reportId} · {new Date(report.generatedAt).toLocaleString()}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" className="gap-1.5" onClick={() => { saveReport(report); toast.success("Report saved"); }}>
                  <BookmarkPlus className="h-4 w-4" /> Save
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => toast.success("PDF downloaded (mock)")}>
                  <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => navigate({ to: "/report/compare", search: { loc1: locality.id } })}>
                  <GitCompareArrows className="h-4 w-4" /> Compare
                </Button>
                <Button size="sm" variant="ghost" className="gap-1.5" onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success("Link copied"); }}>
                  <Share2 className="h-4 w-4" /> Share
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PARAMS.map((p) => {
            const score = report.scores[p.key];
            const lbl = scoreLabel(score);
            const trend = report.trend[p.key];
            const open = expanded === p.key;
            return (
              <Card key={p.key} className="p-4">
                <button
                  className="flex w-full items-start justify-between gap-3 text-left"
                  onClick={() => setExpanded(open ? null : p.key)}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <ScoreDot score={score} />
                      {p.label}
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <div className="text-2xl font-semibold tabular-nums">{score}</div>
                      <div className="text-xs text-muted-foreground">/100 · {lbl.label}</div>
                    </div>
                  </div>
                  <div className="h-10 w-20 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trend.map((v, i) => ({ i, v }))}>
                        <Line type="monotone" dataKey="v" stroke="oklch(0.55 0.16 245)" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
                </button>
                {open && detailsForParam(p.key)}
              </Card>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="p-5">
            <h3 className="text-base font-semibold">Pros & Cons</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-success">
                  <ThumbsUp className="h-3.5 w-3.5" /> Pros
                </div>
                <ul className="space-y-1.5 text-sm">
                  {report.pros.map((p) => <li key={p} className="flex gap-2"><span className="text-success">+</span>{p}</li>)}
                </ul>
              </div>
              <div>
                <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-danger">
                  <ThumbsDown className="h-3.5 w-3.5" /> Cons
                </div>
                <ul className="space-y-1.5 text-sm">
                  {report.cons.map((p) => <li key={p} className="flex gap-2"><span className="text-danger">−</span>{p}</li>)}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-base font-semibold">vs City average</h3>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={compareData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="score" name="This area" radius={[4, 4, 0, 0]}>
                    {compareData.map((_, i) => <Cell key={i} fill="oklch(0.55 0.16 245)" />)}
                  </Bar>
                  <Bar dataKey="city" name="City avg" fill="oklch(0.78 0.02 250)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <Card className="mt-6 p-5">
          <h3 className="mb-4 text-base font-semibold">Within 1 km</h3>
          <MapView lat={locality.lat} lng={locality.lng} zoom={14} radiusMeters={1000} height={360} />
        </Card>
      </div>
    </PageShell>
  );
}
