import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/layout";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — HomeTrust" }] }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  return (
    <PageShell>
      <div className="mx-auto flex max-w-md flex-col px-4 py-16">
        <Card className="p-7">
          <h1 className="text-2xl font-semibold tracking-tight">Reset password</h1>
          <p className="mt-1 text-sm text-muted-foreground">We'll send a link to your email.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Reset link sent (mock)");
            }}
            className="mt-6 space-y-4"
          >
            <div>
              <Label htmlFor="e">Email</Label>
              <Input
                id="e"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5"
              />
            </div>
            <Button type="submit" className="w-full">Send reset link</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
