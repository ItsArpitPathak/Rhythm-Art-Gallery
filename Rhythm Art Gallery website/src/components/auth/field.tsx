import { useId } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> & { label: string; error?: string };

export function Field({ label, error, className, ...input }: Props) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-err` : undefined}
        className={cn(
          "w-full rounded-xl border bg-paper min-h-11 px-4 py-2.5 text-base outline-none md:text-sm transition-colors focus:border-rani focus:ring-2 focus:ring-rani/20",
          error ? "border-rani" : "border-ink/20",
          className,
        )}
        {...input}
      />
      {error && <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-rani">{error}</p>}
    </div>
  );
}
