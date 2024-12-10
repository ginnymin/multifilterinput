import clsx from "clsx";
import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useState,
  type FC,
} from "react";
import { TbSquareRoundedCheckFilled } from "react-icons/tb";

import { Combobox, type Option } from "@components/Combobox";
import { MultiKey, SingleKey } from "@lib/types";

interface InputProps {
  className?: string;
  initialValue?: string | number | (string | number)[];
  onBackspace?: () => void;
  onSelect: (value: string | number | (string | number)[]) => void;
}

type SingleProps = InputProps & {
  type: SingleKey["type"];
  values?: never;
};

type MultiProps = InputProps & {
  type: MultiKey["type"];
  values: MultiKey["values"];
};

type Props = SingleProps | MultiProps;

export const ValueInput: FC<Props> = ({
  className,
  initialValue,
  onBackspace,
  onSelect,
  type,
  values,
  ...props
}) => {
  const [value, setValue] = useState<string | number | (string | number)[]>(
    type === "multiselect"
      ? Array.isArray(initialValue)
        ? initialValue
        : []
      : initialValue ?? ""
  );

  const isDisabled =
    (Array.isArray(value) && value.length === 0) ||
    value.toString().trim() === "";

  const handleSelectChange = useCallback((option: Option | Option[] | null) => {
    if (option !== null) {
      if (Array.isArray(option)) {
        setValue(option.map((v) => v.value));
      } else {
        setValue(option.value);
      }
    }
  }, []);

  const handleRemoveOption = useCallback(
    (option: Option) => {
      if (type === "multiselect") {
        setValue((prev) => {
          if (Array.isArray(prev)) {
            return prev.filter((v) => v !== option.value);
          }
          return prev;
        });
      }
    },
    [type]
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (type === "date" && e.target.value.length > 10) {
      return;
    }
    setValue(e.target.value);
  };

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (
        event.key === "Backspace" &&
        onBackspace !== undefined &&
        value === ""
      ) {
        onBackspace();
        return;
      }

      if (event.key === "Enter" && !isDisabled) {
        onSelect(value);
      }
    },
    [onBackspace, onSelect, value, isDisabled]
  );

  const handleComboboxKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !isDisabled) {
        if ((event.target as HTMLElement).textContent === "Remove") {
          return;
        }

        onSelect(value);
      }
    },
    [onSelect, value, isDisabled]
  );

  const handleSelect = () => {
    if (!isDisabled) {
      onSelect(value);
    }
  };

  const isSelect = type === "select" || type === "multiselect";

  const inputWidth =
    value.toString().length > 14
      ? type === "number"
        ? value.toString().length + 2
        : value.toString().length
      : type === "number"
      ? 16
      : 14;

  return (
    <div className="flex items-center gap-2">
      {isSelect ? (
        <Combobox
          {...props}
          autoFocus
          className="w-[10ch]"
          label="Filter value"
          placeholder="Enter value..."
          multiple={type === "multiselect"}
          options={
            values?.map((value) => ({
              id: value.toString(),
              value,
            })) ?? []
          }
          onChange={handleSelectChange}
          onRemoveOption={handleRemoveOption}
          onBackspace={onBackspace}
          onKeyDown={handleComboboxKeyDown}
          selectedOptions={
            Array.isArray(value)
              ? value.map((v) => ({
                  id: v.toString(),
                  value: v.toString(),
                }))
              : { id: value.toString(), value: value.toString() }
          }
        />
      ) : (
        <input
          {...props}
          autoFocus
          aria-label="Filter value"
          placeholder="Enter value..."
          type={type === "string" ? "text" : type}
          className={clsx(
            "disabled:bg-gray-100 outline-none font-mono text-sm",
            className
          )}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          style={{ width: `${inputWidth}ch` }}
          value={
            typeof value === "string" || typeof value === "number"
              ? value
              : undefined
          }
        />
      )}
      <button onClick={handleSelect} disabled={isDisabled}>
        <span className="sr-only">Save filter</span>
        <TbSquareRoundedCheckFilled
          className={clsx(
            "size-6",
            isDisabled ? "text-gray-300" : "text-blue-700 hover:text-blue-500"
          )}
        />
      </button>
    </div>
  );
};
