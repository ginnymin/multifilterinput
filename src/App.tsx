import { useCallback, useState } from "react";

import {
  MultiFilterInput,
  type OperatorDefinition,
  type Filter,
  type Key,
} from "@components/MultiFilterInput";
import { operators as defaultOperators } from "@lib/constants";

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

const operators: OperatorDefinition[] = [
  { id: "matches", value: "matches", types: ["string", "number", "select"] },
  { id: "earlier", value: "is earlier than", types: ["date"] },
  { id: "later", value: "is later than", types: ["date"] },
  { id: "contains", value: "contains", types: ["multiselect"] },
];

function App() {
  const [currentFilters, setCurrentFilters] = useState<Filter[]>([]);

  const handleChange = useCallback((filters: Filter[]) => {
    setCurrentFilters(filters);
  }, []);

  return (
    <div className="m-6">
      <p className="font-bold">Default operators:</p>
      <MultiFilterInput className="my-4" keys={keys} onChange={handleChange} />

      <p className="font-bold">Custom operators:</p>
      <MultiFilterInput
        className="my-4"
        keys={keys}
        operators={operators}
        onChange={handleChange}
      />

      <p className="mt-4 font-bold">Current filters:</p>
      <ul>
        {currentFilters.map((filter, i) => (
          <li
            key={`${i}-${filter.key}-${filter.operator}-${
              "value" in filter ? filter.value.toString() : ""
            }`}
          >
            {keys.find((k) => k.id === filter.key)?.name ?? filter.key}{" "}
            {defaultOperators.find((o) => o.id === filter.operator)?.value ??
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
