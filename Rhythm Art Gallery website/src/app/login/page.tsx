import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Log in | Rhythm Art Gallery" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" intro="Log in to see your orders and check out faster.">
      <AuthForm mode="login" />
    </AuthShell>
  );
}
