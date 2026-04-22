import { Badge } from "@/components/ui/badge";
import type { Verification } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function VerificationBadge({ level, className }: { level: Verification; className?: string }) {
  const map: Record<Verification, string> = {
    Bronze: "bg-bronze/15 text-bronze border-bronze/30",
    Silver: "bg-silver/20 text-foreground border-silver/40",
    Gold: "bg-gold/20 text-gold border-gold/40",
    Platinum: "bg-platinum/20 text-platinum border-platinum/40",
  };
  return (
    <Badge variant="outline" className={cn("font-medium", map[level], className)}>
      {level}
    </Badge>
  );
}

export function ScoreDot({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-success" : score >= 65 ? "bg-success/80" : score >= 45 ? "bg-warning" : "bg-danger";
  return <span className={cn("inline-block h-2 w-2 rounded-full", color)} />;
}
