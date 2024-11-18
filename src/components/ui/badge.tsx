import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

interface BadgeProps extends PropsWithChildren {
  className?: string;
}

const Badge = ({ children, className }: BadgeProps) => {
  return (
    <span
      className={cn(
        "w-fit bg-primary px-2 py-1 text-sm text-primary-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
};

export default Badge;
