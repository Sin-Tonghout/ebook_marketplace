"use client";

import type { MockScenario } from "@/types/commerce";

const OPTIONS: { value: MockScenario; label: string; hint: string }[] = [
  { value: "success", label: "Succeeds", hint: "Payment goes through" },
  { value: "failed", label: "Declined", hint: "Card is declined" },
  { value: "cancelled", label: "Cancelled", hint: "Buyer cancels" },
];

export function MockScenarioPicker({
  value,
  onChange,
  disabled,
}: {
  value: MockScenario;
  onChange: (value: MockScenario) => void;
  disabled?: boolean;
}) {
  return (
    <fieldset disabled={disabled} className="mt-5 rounded-xl border border-dashed border-border p-4">
      <legend className="px-2 text-xs font-medium uppercase tracking-wide text-muted">
        Demo only · simulate result
      </legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {OPTIONS.map((o) => (
          <label
            key={o.value}
            className="flex cursor-pointer items-start gap-2 rounded-lg p-2 text-sm transition-colors duration-200 hover:bg-muted has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2"
          >
            <input
              type="radio"
              name="mock-scenario"
              value={o.value}
              checked={value === o.value}
              onChange={() => onChange(o.value)}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-medium text-foreground">{o.label}</span>
              <span className="block text-xs text-muted">{o.hint}</span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}