import { Search } from "lucide-react";
import { forwardRef } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SearchInputProps } from "./search-input.types";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput({ className, type = "search", ...props }, ref) {
    return (
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input ref={ref} type={type} className={cn("pl-9", className)} {...props} />
      </div>
    );
  },
);
