import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Operator Sign In — Software Vala Affiliate Manager" },
      {
        name: "description",
        content:
          "Sign in to the Software Vala Boss Panel to manage affiliates, campaigns, commissions and payouts.",
      },
      { property: "og:title", content: "Operator Sign In — Software Vala Affiliate Manager" },
      {
        property: "og:description",
        content: "Secure operator access to the Software Vala affiliate control center.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active && data.session) navigate({ to: "/affiliate-manager", replace: true });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "INITIAL_SESSION")) {
        navigate({ to: "/affiliate-manager", replace: true });
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          setSent(true);
          toast.success("Check your email to confirm your account");
        }
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  async function onReset() {
    if (!email) {
      toast.error("Enter your email first");
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) toast.error(error.message);
    else toast.success("Password reset link sent");
  }

  return (
    <div className="grid min-h-dvh bg-background text-foreground lg:grid-cols-2">
      <div className="hidden flex-col justify-between border-r border-border bg-muted/40 p-10 lg:flex">
        <div className="flex items-center gap-2">
          <div className="grid h-9 w-9 place-items-center rounded-md bg-primary font-display font-bold text-primary-foreground">
            S
          </div>
          <div className="leading-none">
            <div className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              Software Vala
            </div>
            <div className="font-display text-sm font-semibold">Boss Panel</div>
          </div>
        </div>
        <div className="max-w-md">
          <h2 className="font-display text-3xl font-semibold leading-tight">
            The affiliate control center built for a million partners.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Applications, links, commissions, wallets, payouts, compliance and reporting — one
            operator workspace with role-scoped access and a full audit trail.
          </p>
        </div>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="size-4" aria-hidden="true" /> Access is role-gated and every
          action is logged.
        </p>
      </div>

      <main className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold">
            {mode === "signin" ? "Operator sign in" : "Create operator account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Use your Software Vala operator credentials."
              : "Register an account, then ask an admin to grant your role."}
          </p>

          {sent ? (
            <div className="mt-6 rounded-lg border border-border bg-surface p-4 text-sm">
              We sent a confirmation link to <span className="font-medium">{email}</span>. Confirm
              it, then sign in.
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="auth-email">Email</Label>
                <Input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@softwarevala.com"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="auth-password">Password</Label>
                <Input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
              <Button type="submit" className="w-full" disabled={busy}>
                {busy && <Loader2 className="mr-2 size-4 animate-spin" aria-hidden="true" />}
                {mode === "signin" ? "Sign in" : "Create account"}
              </Button>
            </form>
          )}

          <div className="mt-4 flex items-center justify-between text-xs">
            <button
              type="button"
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              onClick={() => {
                setSent(false);
                setMode(mode === "signin" ? "signup" : "signin");
              }}
            >
              {mode === "signin" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
            {mode === "signin" && (
              <button
                type="button"
                onClick={onReset}
                className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Forgot password?
              </button>
            )}
          </div>

          <p className="mt-8 text-xs text-muted-foreground">
            <Link to="/affiliate-manager" className="underline-offset-4 hover:underline">
              Back to the panel
            </Link>
          </p>
        </div>
      </main>
      <Toaster richColors position="bottom-right" />
    </div>
  );
}
