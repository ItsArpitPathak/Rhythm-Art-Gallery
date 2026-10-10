const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" });

export const formatINR = (value: number) => inr.format(value);
