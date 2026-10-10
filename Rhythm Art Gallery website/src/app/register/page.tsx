import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/auth/auth-shell";

export const metadata: Metadata = { title: "Create account | Rhythm Art Gallery" };

export default function RegisterPage() {
  return (
    <AuthShell title="Join Rhythm Art Gallery" intro="Create an account to save your bag, track orders and check out in a tap.">
      <AuthForm mode="register" />
    </AuthShell>
  );
}
