
import * as React from "react";
import { cn } from "@/lib/utils";

const Pagination = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <nav
    role="navigation"
    aria-label="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);

export { Pagination };
