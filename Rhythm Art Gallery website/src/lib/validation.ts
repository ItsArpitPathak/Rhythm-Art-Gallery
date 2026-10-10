// Client-side form checks. The backend must re-validate everything (stage 7).
export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
export const isIndianMobile = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "").replace(/^(\+91|0)/, ""));
export const isPincode = (v: string) => /^[1-9]\d{5}$/.test(v.trim());

export type Errors<K extends string> = Partial<Record<K, string>>;

export function validateLogin(f: { email: string; password: string }): Errors<"email" | "password"> {
  const e: Errors<"email" | "password"> = {};
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (!f.password) e.password = "Enter your password.";
  return e;
}

export function validateRegister(f: {
  name: string;
  email: string;
  mobile: string;
  password: string;
  confirm: string;
  terms: boolean;
}): Errors<"name" | "email" | "mobile" | "password" | "confirm" | "terms"> {
  const e: Errors<"name" | "email" | "mobile" | "password" | "confirm" | "terms"> = {};
  if (f.name.trim().length < 2) e.name = "Enter your full name.";
  if (!isEmail(f.email)) e.email = "Enter a valid email address.";
  if (!isIndianMobile(f.mobile)) e.mobile = "Enter a 10-digit mobile number.";
  if (f.password.length < 8) e.password = "Use at least 8 characters.";
  if (f.confirm !== f.password) e.confirm = "Passwords do not match.";
  if (!f.terms) e.terms = "Please accept the terms to continue.";
  return e;
}

export function validateAddress(f: {
  name: string;
  phone: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
}): Errors<"name" | "phone" | "line1" | "city" | "state" | "pincode"> {
  const e: Errors<"name" | "phone" | "line1" | "city" | "state" | "pincode"> = {};
  if (f.name.trim().length < 2) e.name = "Enter the recipient's name.";
  if (!isIndianMobile(f.phone)) e.phone = "Enter a 10-digit mobile number.";
  if (f.line1.trim().length < 5) e.line1 = "Enter the street address.";
  if (f.city.trim().length < 2) e.city = "Enter the city.";
  if (!f.state) e.state = "Choose a state.";
  if (!isPincode(f.pincode)) e.pincode = "Enter a 6-digit pincode.";
  return e;
}
