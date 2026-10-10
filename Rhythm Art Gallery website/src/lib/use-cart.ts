"use client";

import { useSyncExternalStore } from "react";
import { addLine, type CartLine, itemCount, removeLine, setQty } from "./cart";

// Browser-only cart persisted in localStorage. Replaced by the server cart in the backend stage.
const KEY = "rag-cart";
const EMPTY: CartLine[] = [];
const listeners = new Set<() => void>();
let cachedRaw: string | null = null;
let cached: CartLine[] = EMPTY;

function read(): CartLine[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw === cachedRaw) return cached;
    cachedRaw = raw;
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    cached = Array.isArray(parsed) ? (parsed as CartLine[]) : EMPTY;
  } catch {
    cached = EMPTY;
  }
  return cached;
}

function write(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage blocked: cart lives for this render only */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

export function useCart() {
  const lines = useSyncExternalStore(subscribe, read, () => EMPTY);
  return {
    lines,
    count: itemCount(lines),
    add: (line: CartLine) => write(addLine(read(), line)),
    setQty: (key: string, qty: number) => write(setQty(read(), key, qty)),
    remove: (key: string) => write(removeLine(read(), key)),
    clear: () => write([]),
  };
}
