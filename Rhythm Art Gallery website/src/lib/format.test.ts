import { describe, expect, it } from "vitest";
import { formatINR, formatPrice } from "./format";

describe("formatINR", () => {
  it("uses Indian digit grouping", () => {
    expect(formatINR(124999)).toBe("₹1,24,999.00");
  });
});

describe("formatPrice", () => {
  it("drops paise", () => {
    expect(formatPrice(18500)).toBe("₹18,500");
  });
});
