const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });
const inrWhole = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

export const formatINR = (value: number) => inr.format(value);
/** Whole rupees for product cards, e.g. ₹18,500. */
export const formatPrice = (value: number) => inrWhole.format(value);
