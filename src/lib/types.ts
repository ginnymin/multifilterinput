export interface SingleKey {
  id: string;
  name: string;
  type: "string" | "number" | "date";
}

export interface MultiKey {
  id: string;
  name: string;
  type: "select" | "multiselect";
  values: (string | number)[];
}

export type Key = SingleKey | MultiKey;

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

export interface FilterWithSet {
  key: Key["id"];
  operator: Extract<Operator, "set" | "!set">;
}

export interface FilterWithoutSet {
  key: Key["id"];
  operator: Exclude<Operator, "set" | "!set">;
  value: string | number | (string | number)[];
}

export type Filter = FilterWithSet | FilterWithoutSet;
