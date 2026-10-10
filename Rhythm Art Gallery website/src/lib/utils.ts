// ponytail: no tailwind-merge; later classes don't override earlier ones. Add it if class conflicts appear.
export const cn = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");
