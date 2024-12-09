import { useState } from "react";

import { MultiFilterInput } from "@components/MultiFilterInput";
import { operators } from "@lib/constants";
import { Filter, Key } from "@lib/types";

const keys: Key[] = [
  { id: "1", name: "Name", type: "string" },
  { id: "2", name: "Age", type: "number" },
  { id: "3", name: "Order date", type: "date" },
  {
    id: "4",
    name: "Shirt size",
    type: "select",
    values: ["XS", "Small", "Medium", "Large", "XL"],
  },
  {
    id: "5",
    name: "Colors",
    type: "multiselect",
    values: ["Red", "Blue", "Green", "Purple", "White", "Black"],
  },
];

function App() {
  const [currentFilters, setCurrentFilters] = useState<Filter[]>([]);

  const handleChange = (filters: Filter[]) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="m-6">
      <MultiFilterInput keys={keys} onChange={handleChange} />

      <p className="mt-4 font-bold">Current filters:</p>
      <ul>
        {currentFilters.map((filter, i) => (
          <li
            key={`${i}-${filter.key}-${filter.operator}-${
              "value" in filter ? filter.value.toString() : ""
            }`}
          >
            {keys.find((k) => k.id === filter.key)?.name ?? filter.key}{" "}
            {operators.find((o) => o.id === filter.operator)?.value ??
              filter.operator}{" "}
            {"value" in filter
              ? Array.isArray(filter.value)
                ? filter.value.join(", ")
                : filter.value.toString()
              : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
