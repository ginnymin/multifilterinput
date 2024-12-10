# MultiFilterInput component

A component that allows users to select multiple filter criteria from the convience of a single input.

See it in action: https://multifilterinput.vercel.app

## Usage

```tsx
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

const Component = () => {
  const [currentFilters, setCurrentFilters] = useState<Filter[]>([]);

  const handleChange = (filters: Filter[]) => {
    setCurrentFilters(filters);
  };

  return (
    <div className="m-6">
      <MultiFilterInput keys={keys} onChange={handleChange} />

      <p className="mt-4 font-bold">
        Current filters: {JSON.stringify(currentFilters)}{" "}
        {/* example output: [{"key":"1","operator":"=","value":"hello"}] */}
      </p>
    </div>
  );
};
```

## Props

- `keys`: An array of filter keys that determines the available types of filters. Required. Type: `Key[]`
- `onChange`: A function that is called when the user adds or changes the filters. Required. Type: `(filters: Filter[]) => void`
- `operators`: An array of operator definitions if you want to use custom operators. Type: `OperatorDefinition[]`
- `autoFocus`: A boolean that determines if component's input should be focused when mounted. Type: `boolean`

In addition, the component accepts all props from the `HTMLAttributes<HTMLDivElement>` interface.

## Types

- `Key`: An interface that represents a key to filter by. Properties: `id`, `name`, `type`. Available types are `string`, `number`, `date`, `select`, and `multiselect`. `values` is only available for `select` and `multiselect` types.
- `Operator`: A string union that represents the default operators: `=`, `!=`, `set`, `!set`, `contains`, `!contains`, `<`, `>`, `<=`, `>=`.
- `Filter`: An interface that represents a filter. Properties: `key`, `operator`, `value`. `value` is not applicable for `set` and `!set` operators.

```ts
interface SingleKey {
  id: string;
  name: string;
  type: "string" | "number" | "date";
}

interface MultiKey {
  id: string;
  name: string;
  type: "select" | "multiselect";
  values: (string | number)[];
}

type Key = SingleKey | MultiKey;

type Operator =
  | "="
  | "!="
  | "set"
  | "!set"
  | "contains"
  | "!contains"
  | "<"
  | ">"
  | "<="
  | ">=";

interface OperatorDefinition {
  id: string;
  value: string;
  types: Key["type"][];
}

interface FilterWithSet {
  key: Key["id"];
  operator: Extract<Operator, "set" | "!set">;
}

interface FilterWithoutSet {
  key: Key["id"];
  operator: Exclude<Operator, "set" | "!set">;
  value: string | number | (string | number)[];
}

type Filter = FilterWithSet | FilterWithoutSet;
```

## Available scripts

- `npm run dev`: Run the development server.
- `npm run build`: Build the production version.
- `npm run preview`: Preview the production version.
- `npm run test`: Run tests.
- `npm run lint`: Run type and lint checks.
