import CuisineFilter from "./CuisineFilter";
import MinRatingFilter from "./MinRatingFilter";
import PriceFilter from "./PriceFilter";
import RadiusFilter from "./RadiusFilter";

export default function FilterBar() {
  return (
    <div className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      <CuisineFilter />
      <PriceFilter />
      <RadiusFilter />
      <MinRatingFilter />
    </div>
  );
}
