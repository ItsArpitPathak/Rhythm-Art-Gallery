"use client";

import Link from "next/link";
import { useState } from "react";
import { type Errors, validateLogin, validateRegister } from "@/lib/validation";
import { Field } from "./field";

type Mode = "login" | "register";

/** Front-end only: validates and shows a preview notice. Real sign-in arrives with the backend (objective stage 7). */
export function AuthForm({ mode }: { mode: Mode }) {
  const [values, setValues] = useState({ name: "", email: "", mobile: "", password: "", confirm: "", terms: false });
  const [errors, setErrors] = useState<Errors<string>>({});
  const [showPw, setShowPw] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [k]: k === "terms" ? e.target.checked : e.target.value }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const found: Errors<string> = mode === "login" ? validateLogin(values) : validateRegister(values);
    setErrors(found);
    setDone(Object.keys(found).length === 0);
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      {mode === "register" && <Field label="Full name" autoComplete="name" value={values.name} onChange={set("name")} error={errors.name} />}
      <Field label="Email" type="email" autoComplete="email" value={values.email} onChange={set("email")} error={errors.email} />
      {mode === "register" && (
        <Field label="Mobile number" type="tel" inputMode="numeric" autoComplete="tel" placeholder="10-digit number" value={values.mobile} onChange={set("mobile")} error={errors.mobile} />
      )}
      <Field
        label="Password"
        type={showPw ? "text" : "password"}
        autoComplete={mode === "login" ? "current-password" : "new-password"}
        value={values.password}
        onChange={set("password")}
        error={errors.password}
      />
      {mode === "register" && (
        <Field label="Confirm password" type={showPw ? "text" : "password"} autoComplete="new-password" value={values.confirm} onChange={set("confirm")} error={errors.confirm} />
      )}
      <label className="flex min-h-11 items-center gap-2 text-xs text-ink/70">
        <input type="checkbox" checked={showPw} onChange={(e) => setShowPw(e.target.checked)} className="size-5 accent-rani" /> Show password
      </label>

      {mode === "register" && (
        <div>
          <label className="flex min-h-11 items-center gap-2 text-sm">
            <input type="checkbox" checked={values.terms} onChange={set("terms")} className="size-5 shrink-0 accent-rani" />
            <span>I accept the terms and privacy policy.</span>
          </label>
          {errors.terms && <p role="alert" className="mt-1 text-xs text-rani">{errors.terms}</p>}
        </div>
      )}

      <button type="submit" className="w-full rounded-full bg-rani py-3 text-sm font-semibold text-paper transition-colors hover:bg-ink">
        {mode === "login" ? "Log in" : "Create account"}
      </button>

      {done && (
        <p role="status" className="rounded-xl bg-marigold/20 p-3 text-sm">
          Details look good. This is a preview: accounts go live when the backend is connected, so nothing was saved.
        </p>
      )}

      <p className="text-center text-sm text-ink/70">
        {mode === "login" ? (
          <>New here? <Link href="/register" className="-my-3 inline-block py-3 font-semibold text-rani underline">Create an account</Link></>
        ) : (
          <>Already registered? <Link href="/login" className="-my-3 inline-block py-3 font-semibold text-rani underline">Log in</Link></>
        )}
      </p>
    </form>
  );
}
