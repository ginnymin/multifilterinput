import { useMemo, type FC } from "react";

import { Combobox, type ComboboxProps } from "@components/Combobox";
import { type Key } from "@lib/types";
import { operators } from "@lib/constants";

type Props = Pick<
  ComboboxProps,
  "autoFocus" | "onChange" | "onBackspace" | "className"
> & {
  type: Key["type"];
  selectedId?: string;
};

const operatorOptions = operators.map((o) => ({
  ...o,
  value: `${o.value} (${o.id})`,
}));

export const OperatorSelector: FC<Props> = ({
  className,
  selectedId,
  type,
  ...props
}) => {
  const filteredOptions = useMemo(
    () => operatorOptions.filter((option) => option.types.includes(type)),
    [type]
  );

  const selectedOption = useMemo(
    () => operators.find((option) => option.id === selectedId),
    [selectedId]
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
