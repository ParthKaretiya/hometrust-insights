import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LOCALITIES, PARAMS, generateReport, type Locality } from "@/lib/mock-data";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useMemo, useState } from "react";
import { Download, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const search = z.object({
  loc1: fallback(z.string().optional(), undefined),
  loc2: fallback(z.string().optional(), undefined),
  loc3: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/report/compare")({
  validateSearch: zodValidator(search),
  head: () => ({ meta: [{ title: "Compare Localities — HomeTrust" }] }),
  component: ComparePage,
});

function ComparePage() {
  const sp = Route.useSearch();
  const initial = [sp.loc1, sp.loc2, sp.loc3].filter(Boolean) as string[];
  const [ids, setIds] = useState<string[]>(initial.length ? initial : ["koramangala", "indiranagar"]);

  const reports = useMemo(
    () => ids.map((id) => generateReport(LOCALITIES.find((l) => l.id === id) as Locality)),
    [ids],
  );

  const setAt = (i: number, id: string) => setIds(ids.map((x, k) => (k === i ? id : x)));
  const removeAt = (i: number) => setIds(ids.filter((_, k) => k !== i));
  const add = () => {
    const next = LOCALITIES.find((l) => !ids.includes(l.id));
    if (next) setIds([...ids, next.id]);
  };

  const csv = () => {
    const header = ["Parameter", ...reports.map((r) => r.locality.name)];
    const rows = PARAMS.map((p) => [p.label, ...reports.map((r) => String(r.scores[p.key]))]);
    const blob = new Blob([[header, ...rows].map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "comparison.csv";
    a.click();
    toast.success("CSV downloaded");
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Compare localities</h1>
            <p className="mt-1 text-sm text-muted-foreground">Side-by-side scoring · up to 3 areas</p>
          </div>
          <Button variant="outline" onClick={csv} className="gap-2"><Download className="h-4 w-4" /> Export CSV</Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          {reports.map((r, i) => (
            <Card key={i} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <Select value={r.locality.id} onValueChange={(v) => setAt(i, v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LOCALITIES.map((l) => <SelectItem key={l.id} value={l.id}>{l.name} · {l.city}</SelectItem>)}
                  </SelectContent>
                </Select>
                {ids.length > 1 && (
                  <Button size="icon" variant="ghost" onClick={() => removeAt(i)} aria-label="Remove">
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-20 w-20">
                  <CircularProgressbar value={r.overall} text={`${r.overall}`} styles={buildStyles({ pathColor: "oklch(0.55 0.16 245)", textColor: "currentColor", trailColor: "hsl(var(--muted))", textSize: "28px" })} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Overall livability</div>
                  <div className="text-xs text-muted-foreground">Report ID {r.reportId}</div>
                </div>
              </div>
            </Card>
          ))}
          {ids.length < 3 && (
            <Card className="flex items-center justify-center p-5">
              <Button variant="outline" onClick={add} className="gap-2"><Plus className="h-4 w-4" /> Add locality</Button>
            </Card>
          )}
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Parameter</th>
                  {reports.map((r) => <th key={r.locality.id} className="px-4 py-3 text-left font-medium">{r.locality.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {PARAMS.map((p) => {
                  const vals = reports.map((r) => r.scores[p.key]);
                  const best = Math.max(...vals);
                  const worst = Math.min(...vals);
                  return (
                    <tr key={p.key} className="border-b last:border-0">
                      <td className="px-4 py-3">{p.label}</td>
                      {vals.map((v, i) => (
                        <td key={i} className="px-4 py-3">
                          <span className={cn(
                            "inline-flex h-7 min-w-[2.5rem] items-center justify-center rounded-md px-2 text-xs font-semibold",
                            v === best && "bg-success/15 text-success",
                            v === worst && v !== best && "bg-danger/15 text-danger",
                            v !== best && v !== worst && "bg-muted text-foreground",
                          )}>{v}</span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
