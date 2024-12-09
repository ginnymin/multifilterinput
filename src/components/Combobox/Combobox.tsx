import {
  Combobox as HeadlessCombobox,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  type ComboboxProps as HeadlessComboboxProps,
} from "@headlessui/react";
import clsx from "clsx";
import {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
} from "react";

import { Chip } from "@components/Chip";

export interface Option<T = string> {
  id: T;
  value: string | number;
}

type ComboboxProps<T = string> = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  "placeholder" | "autoFocus" | "onKeyDown"
> & {
  className?: string;
  label: string;
  options: Option<T>[];
  onChange: (option: Option | null) => void;
  onBackspace?: () => void;
  onRemoveOption?: (option: Option) => void;
  selectedOptions?: Option<T> | Option<T>[];
};

type SingleProps<T = string> = Omit<
  HeadlessComboboxProps<Option, false>,
  "by" | "virtual" | "onChange"
> &
  ComboboxProps<T>;

type MultiProps<T = string> = Omit<
  HeadlessComboboxProps<Option[], true>,
  "by" | "virtual" | "onChange"
> &
  ComboboxProps<T>;

type Props<T = string> = SingleProps<T> | MultiProps<T>;

export const Combobox: FC<Props> = ({
  autoFocus,
  className,
  label,
  multiple,
  placeholder,
  options,
  selectedOptions,
  onChange,
  onBackspace,
  onRemoveOption,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [isStatic, setStatic] = useState(autoFocus ?? false);

  const handleChange = useCallback(
    (value: Option | null) => {
      if (multiple) setQuery("");
      onChange(value);
    },
    [onChange, multiple]
  );

  const handleRemoveOption = useCallback(
    (option: Option) => () => {
      if (onRemoveOption !== undefined) {
        onRemoveOption(option);
      }
    },
    [onRemoveOption]
  );

  const handleClose = useCallback(() => {
    setQuery("");
  }, []);

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (isStatic === true) {
        setStatic(false);
      }

      if (event.key === "Backspace" && query === "") {
        if (
          multiple &&
          Array.isArray(selectedOptions) &&
          selectedOptions.length > 0 &&
          onRemoveOption !== undefined
        ) {
          onRemoveOption(selectedOptions[selectedOptions.length - 1]);
          return;
        }

        if (onBackspace !== undefined) {
          onBackspace();
        }
      }
    },
    [onBackspace, onRemoveOption, query, isStatic, multiple, selectedOptions]
  );

  const filteredOptions = useMemo(
    () =>
      query === ""
        ? options
        : options?.filter((option) => {
            return typeof option.value === "string"
              ? option.value.toLowerCase().includes(query.toLowerCase())
              : option.value.toString().includes(query.toLowerCase());
          }),
    [query, options]
  );

  useEffect(() => {
    if (!Array.isArray(selectedOptions)) {
      setQuery(selectedOptions?.value.toString() ?? "");
    }
  }, [selectedOptions]);

  useEffect(() => {
    const handleClickEvent = (e: MouseEvent) => {
      // when clicking outside the input, set static to false
      if (e.target !== inputRef.current) {
        setStatic(false);
      }
    };

    if (isStatic) {
      window.addEventListener("click", handleClickEvent);
    } else {
      window.removeEventListener("click", handleClickEvent);
    }

    return () => {
      window.removeEventListener("click", handleClickEvent);
    };
  }, [isStatic]);

  return (
    <HeadlessCombobox
      {...props}
      multiple={multiple}
      immediate
      value={selectedOptions ?? (multiple ? [] : null)}
      onChange={handleChange}
      onClose={handleClose}
    >
      <div>
        <div className="flex items-center gap-1">
          {multiple &&
            Array.isArray(selectedOptions) &&
            selectedOptions.map((option) => (
              <Chip key={option.id} onRemove={handleRemoveOption(option)}>
                {option.value}
              </Chip>
            ))}
          <ComboboxInput
            ref={inputRef}
            aria-label={label}
            autoFocus={autoFocus}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={clsx("disabled:bg-gray-100 outline-none", className)}
            value={query}
          />
        </div>

        <ComboboxOptions
          anchor={{ to: "bottom start", gap: 8, offset: -2 }}
          className="rounded bg-white border border-gray-200 empty:invisible z-10"
          // when using autoFocus, the options do not appear even though the input is focused.
          // setting static to true, but only for the initial render, addresses this.
          static={isStatic}
        >
          {filteredOptions?.map((option) => (
            <ComboboxOption
              key={option.id}
              value={option}
              className="flex gap-1.5 items-center data-[selected]:bg-blue-100 data-[focus]:bg-blue-200 data-[focus]:data-[selected]:bg-blue-200 py-2 px-4"
            >
              {option.value}
            </ComboboxOption>
          ))}
        </ComboboxOptions>
      </div>
    </HeadlessCombobox>
  );
};
