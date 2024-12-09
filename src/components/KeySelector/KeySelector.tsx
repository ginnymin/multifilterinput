import { useMemo, type FC } from "react";

import { Combobox, type ComboboxProps } from "@components/Combobox";
import { type Key } from "@lib/types";

type Props = Pick<
  ComboboxProps,
  "autoFocus" | "disabled" | "onChange" | "className"
> & {
  keys: Key[];
  selectedId?: string;
};

export const KeySelector: FC<Props> = ({ keys, selectedId, ...props }) => {
  const selectedOption = useMemo(() => {
    const key = keys.find((key) => key.id === selectedId);
    return key ? { id: key.id, value: key.name } : undefined;
  }, [keys, selectedId]);

  return (
    <Combobox
      {...props}
      label="Filter key"
      placeholder="Add a filter..."
      options={keys.map((key) => ({ id: key.id, value: key.name }))}
      selectedOptions={selectedOption}
    />
  );
};
