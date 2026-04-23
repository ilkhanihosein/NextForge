import type { InputProps } from "@/components/ui/input";

export type SearchInputProps = Omit<InputProps, "type"> & {
  type?: "search" | "text";
};
