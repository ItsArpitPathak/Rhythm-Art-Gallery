import { describe, expect, it } from "vitest";
import { isEmail, isIndianMobile, isPincode, validateAddress, validateLogin, validateRegister } from "./validation";

describe("validation", () => {
  it("checks email, mobile and pincode shapes", () => {
    expect(isEmail("a@b.co")).toBe(true);
    expect(isEmail("a@b")).toBe(false);
    expect(isIndianMobile("98765 43210")).toBe(true);
    expect(isIndianMobile("+91 9876543210")).toBe(true);
    expect(isIndianMobile("5876543210")).toBe(false);
    expect(isPincode("110001")).toBe(true);
    expect(isPincode("010001")).toBe(false);
  });

  it("login requires email and password", () => {
    expect(validateLogin({ email: "x", password: "" })).toEqual({ email: expect.any(String), password: expect.any(String) });
    expect(validateLogin({ email: "a@b.co", password: "x" })).toEqual({});
  });

  it("register catches mismatch, short password and missing terms", () => {
    const ok = { name: "Asha Rao", email: "a@b.co", mobile: "9876543210", password: "longenough", confirm: "longenough", terms: true };
    expect(validateRegister(ok)).toEqual({});
    expect(validateRegister({ ...ok, confirm: "other" }).confirm).toBeDefined();
    expect(validateRegister({ ...ok, password: "short", confirm: "short" }).password).toBeDefined();
    expect(validateRegister({ ...ok, terms: false }).terms).toBeDefined();
  });

  it("address needs every field", () => {
    expect(Object.keys(validateAddress({ name: "", phone: "", line1: "", city: "", state: "", pincode: "" }))).toHaveLength(6);
  });
});
