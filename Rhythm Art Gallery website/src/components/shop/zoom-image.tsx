"use client";

import Image from "next/image";
import { useState } from "react";

/** Hover to zoom into the fabric or stonework (desktop). On touch it stays a plain image. */
export function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  return (
    <div
      className="relative aspect-[3/4] cursor-zoom-in overflow-hidden rounded-3xl bg-cream ring-1 ring-blush"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
      }}
      onMouseLeave={() => setZoom(null)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(min-width: 1024px) 40vw, 90vw"
        className="object-cover transition-transform duration-200 ease-out"
        style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
      />
    </div>
  );
}
