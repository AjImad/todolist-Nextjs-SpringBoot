import { Loader2 } from "lucide-react";

import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const spinnerVariats = cva("text-muted-foreground animate-spin", {
  variants: {
    size: {
      default: "h-4 w-4",
      sm: "h-2 w-2",
      lg: "h-6 w-6",
      icon: "h-10 w-10",
    },
    speed: {
      default: "duration-500",
      fast: "duration-300",
      slow: "duration-900",
    },
  },
  defaultVariants: {
    size: "default",
    speed: "default",
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariats> {}

export const Spinner = ({ size, speed }: SpinnerProps) => {
  return <Loader2 className={cn(spinnerVariats({ size, speed }))} />;
};

export default Spinner;
