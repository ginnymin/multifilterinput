export type SingleKey = {
  id: string;
  name: string;
  type: "string" | "number" | "date";
};

export type MultiKey = {
  id: string;
  name: string;
  type: "select" | "multiselect";
  values: (string | number)[];
};

export type Key = SingleKey | MultiKey;

// export type Key = {
//   id: string;
//   name: string;
//   type: "string" | "number" | "date" | "select" | "multiselect";
//   values?: (string | number)[]; // for select / multiselect types
// };

export type Operator =
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

type FilterWithSet = {
  key: Key["id"];
  operator: Extract<Operator, "set" | "!set">;
};

type FilterWithoutSet = {
  key: Key["id"];
  operator: Exclude<Operator, "set" | "!set">;
  value: string | number | (string | number)[];
};

export type Filter = FilterWithSet | FilterWithoutSet;
