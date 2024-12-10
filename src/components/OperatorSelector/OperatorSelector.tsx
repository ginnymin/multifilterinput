import { useMemo, type FC } from "react";

import { Combobox, type ComboboxProps } from "@components/Combobox";
import type { Key, OperatorDefinition } from "@lib/types";
import { operators as defaultOperators } from "@lib/constants";

type Props = Pick<
  ComboboxProps,
  "autoFocus" | "onChange" | "onBackspace" | "className"
> & {
  operators?: OperatorDefinition[];
  type: Key["type"];
  selectedId?: string;
};

export const OperatorSelector: FC<Props> = ({
  className,
  operators = defaultOperators,
  selectedId,
  type,
  ...props
}) => {
  const operatorOptions = useMemo(
    () =>
      operators.map((o) => ({
        ...o,
        value: `${o.value} (${o.id})`,
      })),
    [operators]
  );

  const filteredOptions = useMemo(
    () => operatorOptions.filter((option) => option.types.includes(type)),
    [operatorOptions, type]
  );

  const selectedOption = useMemo(
    () => operators.find((option) => option.id === selectedId),
    [operators, selectedId]
  );

  return (
    <Combobox
      {...props}
      className={className}
      label="Filter operator"
      placeholder="Select an operator..."
      options={filteredOptions}
      selectedOptions={selectedOption}
      autoFocus
    />
  );
};
