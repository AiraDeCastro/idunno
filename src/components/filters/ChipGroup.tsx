interface ChipGroupProps<T extends string> {
  legend: string;
  options: T[];
  selected: Set<T>;
  onToggle: (value: T) => void;
}

export default function ChipGroup<T extends string>({
  legend,
  options,
  selected,
  onToggle,
}: ChipGroupProps<T>) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selected.has(option);
          return (
            <label
              key={option}
              className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm transition ${
                isSelected
                  ? "border-neutral-300 bg-white text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                  : "border-neutral-200 bg-neutral-100 text-neutral-400 line-through hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-600"
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggle(option)}
                className="sr-only"
              />
              {option}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
