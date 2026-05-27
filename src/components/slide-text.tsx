import { cn } from "@/lib/utils";

interface SlideTextProps {
  children: string;
  className?: string;
}

export function SlideText({ children, className }: SlideTextProps) {
  return (
    <span
      aria-label={children}
      className={cn("relative inline-flex overflow-hidden", className)}
    >
      <span
        aria-hidden
        className="translate-y-0 skew-y-0 transition duration-300 group-hover/button:translate-y-[-150%] group-hover/button:skew-y-8"
      >
        {children}
      </span>
      <span
        aria-hidden
        className="absolute translate-y-[154%] skew-y-8 transition duration-300 group-hover/button:translate-y-0 group-hover/button:skew-y-0"
      >
        {children}
      </span>
    </span>
  );
}
