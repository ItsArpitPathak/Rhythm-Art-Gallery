"use client";

import { useInView } from "motion/react";
import { useRef } from "react";
import { AnimatedNumber } from "@/components/motion-primitives/animated-number";

/** Counts from 0 to `value` when scrolled into view (AnimatedNumber alone starts at its value). */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const seen = useInView(ref, { once: true });
  return (
    <span ref={ref}>
      <AnimatedNumber value={seen ? value : 0} springOptions={{ bounce: 0, duration: 1800 }} />
    </span>
  );
}
