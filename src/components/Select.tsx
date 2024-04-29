import { HTMLAttributes, useRef } from "react";
import { twMerge } from "tailwind-merge";
import Chevron from "@/icons/chevron";
import LabelText from "@/components/LabelText";

type SelectProps = Omit<HTMLAttributes<HTMLSelectElement>, "id"> & {
  label: string;
  id: string;
  "sr-only-label"?: boolean;
  value?: string;
};

export default function Select({
  children,
  className,
  label,
  id,
  "sr-only-label": srOnlyLabel,
  ...props
}: SelectProps) {
  const selectRef = useRef<HTMLSelectElement>(null);

  return (
    <div className={twMerge("grid gap-2", className)}>
      <label className={`${srOnlyLabel ? "sr-only" : ""}`} htmlFor={id}>
        <LabelText>{label}</LabelText>
      </label>
      <div className="flex items-center relative">
        <select
          id={id}
          className={`
            appearance-none bg-transparent cursor-pointer px-2 py-1 pr-8 rounded-md
            ${srOnlyLabel ? "" : "border"}
          `}
          ref={selectRef}
          {...props}
        >
          {children}
        </select>
        <Chevron
          direction="down"
          className="h-4 w-4 absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
}
