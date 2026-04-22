import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { useApp } from "@/lib/store";
import { LOCALITIES } from "@/lib/mock-data";
import { Download, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — HomeTrust" }] }),
  component: Profile,
});

function Profile() {
  const user = useApp((s) => s.user);
  const fav = useApp((s) => s.favoriteLocalities);
  const saved = useApp((s) => s.savedReports);
  const reported = useApp((s) => s.reportedListings);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ user, fav, saved, reported }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "hometrust-data.json"; a.click();
    toast.success("Data exported");
  };

  if (!user) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-4 py-20 text-center">
          <p className="mb-4">Sign in to view your profile.</p>
          <Button asChild><Link to="/login">Sign in</Link></Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <h1 className="mb-1 text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="mb-6 text-sm text-muted-foreground">Manage your HomeTrust account.</p>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Personal info</TabsTrigger>
            <TabsTrigger value="fav">Saved locations</TabsTrigger>
            <TabsTrigger value="notif">Notifications</TabsTrigger>
            <TabsTrigger value="data">Data export</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Name</Label><Input defaultValue={user.name} className="mt-1.5" /></div>
                <div><Label>Email</Label><Input defaultValue={user.email} className="mt-1.5" /></div>
                <div><Label>Phone</Label><Input placeholder="+91 9000000000" className="mt-1.5" /></div>
                <div><Label>City</Label><Input placeholder="Bengaluru" className="mt-1.5" /></div>
              </div>
              <Button className="mt-5" onClick={() => toast.success("Profile updated")}>Save changes</Button>
            </Card>
          </TabsContent>

          <TabsContent value="fav">
            <Card className="p-6">
              {fav.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted-foreground">No favorites yet. Heart a location from the search page.</div>
              ) : (
                <ul className="divide-y">
                  {fav.map((id) => {
                    const l = LOCALITIES.find((x) => x.id === id)!;
                    return (
                      <li key={id} className="flex items-center justify-between py-3">
                        <div><div className="font-medium">{l.name}</div><div className="text-xs text-muted-foreground">{l.city}</div></div>
                        <Button asChild size="sm" variant="outline" className="gap-1.5">
                          <Link to="/report/result" search={{ location: id }}><Sparkles className="h-3.5 w-3.5" /> Generate report</Link>
                        </Button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="notif">
            <Card className="p-6 space-y-4">
              {["Email digests", "New listings in saved areas", "Broker replies", "Verification updates"].map((n) => (
                <div key={n} className="flex items-center justify-between">
                  <Label>{n}</Label>
                  <Switch defaultChecked />
                </div>
              ))}
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground">Download a JSON copy of all your data on HomeTrust.</p>
              <Button onClick={exportData} className="mt-4 gap-2"><Download className="h-4 w-4" /> Export JSON</Button>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageShell>
  );
}
