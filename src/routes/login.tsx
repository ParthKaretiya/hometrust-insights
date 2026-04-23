import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — HomeTrust" }] }),
  component: LoginPage,
});

function LoginPage() {
  const login = useApp((s) => s.login);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const submit = (e) => {
    e.preventDefault();
    if (!email || !pw) return toast.error("Enter email & password");
    login(email, "buyer");
    toast.success("Welcome back");
    navigate({ to: "/report/search" });
  };

  return (
    <PageShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <Card className="p-7">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          <p className="mt-1 text-sm text-muted-foreground">Demo: any email & password works.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="e">Email</Label>
              <Input
                id="e"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="p">Password</Label>
              <Input
                id="p"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full">Sign in</Button>
          </form>
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={() => {
              login("google.user@gmail.com", "buyer");
              navigate({ to: "/report/search" });
            }}
          >
            Continue with Google
          </Button>
          <div className="mt-4 flex justify-between text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
            <Link to="/signup" className="text-primary hover:underline">Create account</Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
