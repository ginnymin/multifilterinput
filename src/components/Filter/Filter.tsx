import clsx from "clsx";
import {
  type HTMLAttributes,
  useCallback,
  useMemo,
  useState,
  type FC,
  useRef,
  useEffect,
} from "react";

import { KeySelector, type KeySelectorProps } from "@components/KeySelector";
import type { OperatorDefinition, Filter as FilterType, Key } from "@lib/types";
import {
  OperatorSelector,
  OperatorSelectorProps,
} from "@components/OperatorSelector";
import { ValueInput, ValueInputProps } from "@components/ValueInput";
import { operators as defaultOperators } from "@lib/constants";

type Props = Omit<HTMLAttributes<HTMLDivElement>, "onSelect"> & {
  defaultFilter?: FilterType;
  keys: Key[];
  operators?: OperatorDefinition[];
  onSelect: (filter: FilterType) => void;
};

export const Filter: FC<Props> = ({
  autoFocus,
  className,
  defaultFilter,
  keys,
  operators = defaultOperators,
  onSelect,
  ...props
}) => {
  const [key, setKey] = useState<Partial<FilterType>["key"]>(
    defaultFilter?.key
  );
  const [operator, setOperator] = useState<Partial<FilterType>["operator"]>(
    defaultFilter?.operator
  );

  // use refs to store previously selected values for backspace scenarios
  const selectedKey = useRef<Partial<FilterType>["key"]>(defaultFilter?.key);
  const selectedOperator = useRef<Partial<FilterType>["operator"]>(
    defaultFilter?.operator
  );

  const handleKeyChange: KeySelectorProps["onChange"] = useCallback(
    (option) => {
      if (option) {
        setKey(option.id);
        selectedKey.current = option.id;
      }
    },
    []
  );

  const handleOperatorChange: OperatorSelectorProps["onChange"] = useCallback(
    (option) => {
      if (option) {
        if (option.id === "set" || option.id === "!set") {
          if (key !== undefined) {
            onSelect({ key, operator: option.id });
            setKey(undefined);
            setOperator(undefined);
            selectedKey.current = undefined;
            selectedOperator.current = undefined;
          }
          return;
        }

        setOperator(option.id as FilterType["operator"]);
        selectedOperator.current = option.id as FilterType["operator"];
      }
    },
    [key, onSelect]
  );

  const handleOperatorBackspace: OperatorSelectorProps["onBackspace"] =
    useCallback(() => {
      setKey(undefined);
      setOperator(undefined);
      selectedOperator.current = undefined;
    }, []);

  const handleValueSelect: ValueInputProps["onSelect"] = useCallback(
    (v) => {
      if (key !== undefined && operator !== undefined) {
        onSelect({ key, operator, value: v });
        setKey(undefined);
        setOperator(undefined);
        selectedKey.current = undefined;
        selectedOperator.current = undefined;
      }
    },
    [key, operator, onSelect]
  );

  const handleValueBackspace: ValueInputProps["onBackspace"] =
    useCallback(() => {
      setOperator(undefined);
    }, []);

  const currentKey = useMemo(() => keys.find((k) => k.id === key), [key, keys]);
  const currentOperator = useMemo(
    () => operators.find((o) => o.id === operator),
    [operator, operators]
  );

  // for when we're editing a filter that has set or !set as the oeprator
  // we need the operator selector to be editable on load instead of the value filter
  useEffect(() => {
    if (
      defaultFilter?.operator === "set" ||
      defaultFilter?.operator === "!set"
    ) {
      setOperator(undefined);
    }
  }, [defaultFilter?.operator]);

  return (
    <div {...props} className={clsx("flex gap-2 items-baseline", className)}>
      {currentKey !== undefined ? (
        <span className="font-bold text-blue-600">{currentKey.name}</span>
      ) : (
        <KeySelector
          keys={keys}
          onChange={handleKeyChange}
          selectedId={selectedKey.current}
          autoFocus={selectedKey.current !== undefined || autoFocus === true}
        />
      )}

      {currentKey !== undefined ? (
        currentOperator !== undefined ? (
          <span className="font-bold text-blue-600">
            {currentOperator.value}
          </span>
        ) : (
          <OperatorSelector
            type={currentKey.type}
            operators={operators}
            selectedId={selectedOperator.current}
            onBackspace={handleOperatorBackspace}
            onChange={handleOperatorChange}
          />
        )
      ) : null}

      {currentKey !== undefined &&
        operator !== undefined &&
        operator !== "set" &&
        operator !== "!set" &&
        (currentKey.type === "multiselect" || currentKey.type === "select" ? (
          <ValueInput
            type={currentKey.type}
            initialValue={
              defaultFilter !== undefined && "value" in defaultFilter
                ? defaultFilter.value
                : undefined
            }
            values={Array.isArray(currentKey.values) ? currentKey.values : []}
            onBackspace={handleValueBackspace}
            onSelect={handleValueSelect}
          />
        ) : (
          <ValueInput
            type={currentKey.type}
            initialValue={
              defaultFilter !== undefined &&
              "value" in defaultFilter &&
              !Array.isArray(defaultFilter.value)
                ? defaultFilter.value
                : undefined
            }
            onBackspace={handleValueBackspace}
            onSelect={handleValueSelect}
          />
        ))}
    </div>
  );
};
