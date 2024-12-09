import clsx from "clsx";
import { HTMLAttributes, type FC } from "react";
import { TbX } from "react-icons/tb";

type Props = HTMLAttributes<HTMLDivElement> & {
  onRemove?: () => void;
  onSelect?: () => void;
};

export const Chip: FC<Props> = ({ children, onRemove, onSelect, ...props }) => {
  return (
    <div
      {...props}
      className={clsx(
        "flex items-center gap-1 text-sm rounded-md  px-1.5 py-1 -my-1 cursor-default",
        onSelect !== undefined ? "bg-blue-600 text-white" : "bg-gray-300"
      )}
    >
      {onSelect !== undefined ? (
        <button className="rounded element-white-focus" onClick={onSelect}>
          {children}
        </button>
      ) : (
        children
      )}

      {onRemove !== undefined && (
        <button className="rounded element-white-focus" onClick={onRemove}>
          <span className="sr-only">Remove</span>
          <TbX className="size-4" />
        </button>
      )}
    </div>
  );
};
