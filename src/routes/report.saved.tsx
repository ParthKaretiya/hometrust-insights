import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { Trash2, ArrowRight, BookmarkX } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";

export const Route = createFileRoute("/report/saved")({
  head: () => ({ meta: [{ title: "Saved Reports — HomeTrust" }] }),
  component: SavedPage,
});

function SavedPage() {
  const reports = useApp((s) => s.savedReports);
  const del = useApp((s) => s.deleteReport);

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="mb-8 flex items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Saved reports</h1>
            <p className="mt-1 text-sm text-muted-foreground">{reports.length} saved</p>
          </div>
          <Button asChild><Link to="/report/search">New report</Link></Button>
        </div>

        {reports.length === 0 ? (
          <Card className="flex flex-col items-center justify-center gap-3 p-16 text-center">
            <BookmarkX className="h-10 w-10 text-muted-foreground" />
            <div className="text-lg font-medium">No reports yet</div>
            <p className="max-w-sm text-sm text-muted-foreground">Generate your first neighborhood report — they'll appear here.</p>
            <Button asChild className="mt-2"><Link to="/report/search">Search neighborhoods</Link></Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reports.map((r) => (
              <Card key={r.locality.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 shrink-0">
                    <CircularProgressbar value={r.overall} text={`${r.overall}`} styles={buildStyles({ pathColor: "oklch(0.55 0.16 245)", textColor: "currentColor", trailColor: "hsl(var(--muted))", textSize: "30px" })} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{r.locality.name}</div>
                    <Badge variant="outline" className="mt-0.5">{r.locality.city}</Badge>
                    <div className="mt-1 text-xs text-muted-foreground">Saved {new Date(r.generatedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button asChild size="sm" className="flex-1 gap-1.5">
                    <Link to="/report/result" search={{ location: r.locality.id }}>View <ArrowRight className="h-3.5 w-3.5" /></Link>
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => del(r.locality.id)} aria-label="Delete">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
