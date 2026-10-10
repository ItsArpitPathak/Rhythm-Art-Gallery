"use client";

import { MotionConfig } from "motion/react";

// Honours the OS reduced-motion setting for every motion/react animation.
export function Motion({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
