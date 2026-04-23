import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useApp } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create account — HomeTrust" }] }),
  component: SignupPage,
});

function SignupPage() {
  const login = useApp((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [role, setRole] = useState("buyer");

  const submit = (e) => {
    e.preventDefault();
    if (!email || !pw) return toast.error("Fill all fields");
    login(email, role);
    toast.success("Account created");
    navigate({
      to:
        role === "broker"
          ? "/broker/dashboard"
          : role === "admin"
            ? "/admin/dashboard"
            : "/report/search",
    });
  };

  return (
    <PageShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <Card className="p-7">
          <h1 className="text-2xl font-semibold tracking-tight">Create account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Free forever. No credit card.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="e">Email</Label>
              <Input id="e" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="p">Password</Label>
              <Input id="p" type="password" value={pw} onChange={(e) => setPw(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label>I am a</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">Buyer / Renter</SelectItem>
                  <SelectItem value="broker">Broker</SelectItem>
                  <SelectItem value="admin">Admin (demo)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
