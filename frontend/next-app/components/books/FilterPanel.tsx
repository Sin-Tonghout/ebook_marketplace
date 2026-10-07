"use client";

interface Option {
  value: string;
  label: string;
}

type FilterField = "category" | "language" | "price" | "rating" | "format";
type FilterQuery = Partial<Record<FilterField, string>>;

const categoryOptions: readonly Option[] = [
  { value: "fiction", label: "Fiction" },
  { value: "non-fiction", label: "Non-fiction" },
  { value: "business", label: "Business" },
  { value: "technology", label: "Technology" },
  { value: "education", label: "Education" },
];

const languageOptions: readonly Option[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
];

const priceOptions: readonly Option[] = [
  { value: "under-10", label: "Under $10" },
  { value: "10-20", label: "$10 - $20" },
  { value: "20-30", label: "$20 - $30" },
  { value: "30-plus", label: "$30+" },
];

const ratingOptions: readonly Option[] = [
  { value: "4.5", label: "4.5+" },
  { value: "4.0", label: "4.0+" },
  { value: "3.5", label: "3.5+" },
  { value: "3.0", label: "3.0+" },
];

const formatOptions: readonly Option[] = [
  { value: "ebook", label: "eBook" },
  { value: "paperback", label: "Paperback" },
  { value: "hardcover", label: "Hardcover" },
  { value: "audiobook", label: "Audiobook" },
];

interface RadioGroupProps {
  legend: string;
  name: string;
  value?: string;
  options: readonly Option[];
  anyLabel?: string;
  onSelect: (value: string | undefined) => void;
}

function RadioGroup({
  legend,
  name,
  value,
  options,
  anyLabel = "Any",
  onSelect,
}: RadioGroupProps) {
  const all: Option[] = [{ value: "", label: anyLabel }, ...options];

  return (
    <fieldset>
      <legend className="type-label mb-3">{legend}</legend>
      <div className="space-y-2.5">
        {all.map((o) => {
          const id = `${name}-${o.value || "any"}`;
          return (
            <label
              key={id}
              htmlFor={id}
              className="flex cursor-pointer items-center gap-3 type-body-sm"
            >
              <input
                id={id}
                type="radio"
                name={name}
                checked={(value ?? "") === o.value}
                onChange={() => onSelect(o.value || undefined)}
                className="size-4 cursor-pointer accent-primary"
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

interface FilterPanelProps {
  query: FilterQuery;
  onChange: (patch: Partial<FilterQuery>) => void;
  /** Keeps ids and radio groups unique when the panel is rendered twice */
  idPrefix: string;
}

export function FilterPanel({ query, onChange, idPrefix }: FilterPanelProps) {
  return (
    <div className="space-y-8">
      <RadioGroup
        legend="Category"
        name={`${idPrefix}-category`}
        value={query.category}
        options={categoryOptions}
        anyLabel="All categories"
        onSelect={(v) => onChange({ category: v })}
      />
      <RadioGroup
        legend="Language"
        name={`${idPrefix}-language`}
        value={query.language}
        options={languageOptions}
        onSelect={(v) => onChange({ language: v })}
      />
      <RadioGroup
        legend="Price"
        name={`${idPrefix}-price`}
        value={query.price}
        options={priceOptions}
        onSelect={(v) => onChange({ price: v })}
      />
      <RadioGroup
        legend="Rating"
        name={`${idPrefix}-rating`}
        value={query.rating}
        options={ratingOptions}
        onSelect={(v) => onChange({ rating: v })}
      />
      <RadioGroup
        legend="Format"
        name={`${idPrefix}-format`}
        value={query.format}
        options={formatOptions}
        onSelect={(v) => onChange({ format: v })}
      />
    </div>
  );
}
