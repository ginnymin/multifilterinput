import { Key, Operator } from "./types";

export const operators: {
  id: Operator;
  value: string;
  types: Key["type"][];
}[] = [
  {
    id: "=",
    value: "equals",
    types: ["string", "number", "date", "select", "multiselect"],
  },
  {
    id: "!=",
    value: "does not equal",
    types: ["string", "number", "date", "select", "multiselect"],
  },
  {
    id: "set",
    value: "is set",
    types: ["string", "number", "date", "select", "multiselect"],
  },
  {
    id: "!set",
    value: "is not set",
    types: ["string", "number", "date", "select", "multiselect"],
  },
  {
    id: "contains",
    value: "contains",
    types: ["string", "select", "multiselect"],
  },
  {
    id: "!contains",
    value: "does not contain",
    types: ["string", "select", "multiselect"],
  },
  { id: "<", value: "is less than", types: ["number", "date"] },
  { id: ">", value: "is greater than", types: ["number", "date"] },
  { id: "<=", value: "is less than or equal to", types: ["number", "date"] },
  { id: ">=", value: "is greater than or equal to", types: ["number", "date"] },
];
