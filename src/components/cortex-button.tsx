import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "@/components/ui/button";
import { SlideText } from "@/components/slide-text";
import { cn } from "@/lib/utils";

const cortexButtonVariants = cva(
  "group/button cursor-pointer overflow-hidden rounded-full font-mona text-[length:var(--text-nav)] leading-[var(--text-nav-line-height)] font-semibold transition-colors active:!translate-y-0 disabled:cursor-not-allowed disabled:opacity-[var(--button-disabled-opacity)]",
  {
    variants: {
      variant: {
        primary:
          "border-transparent bg-action-primary text-neutral-white hover:bg-action-primary-hover aria-expanded:bg-action-primary-hover",
        outline:
          "border-action-primary bg-transparent text-neutral-white hover:border-action-primary-hover hover:bg-transparent aria-expanded:border-action-primary-hover aria-expanded:bg-transparent",
        secondary:
          "border-transparent bg-action-secondary text-neutral-white hover:bg-action-secondary-hover aria-expanded:bg-action-secondary-hover",
        ghost:
          "border-transparent bg-transparent text-neutral-white hover:bg-bg-elevated aria-expanded:bg-bg-elevated",
      },
      size: {
        default:
          "h-[var(--button-height)] px-[var(--button-padding-inline)] has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
        lg: "h-[var(--button-height-lg)] px-[var(--button-padding-inline)] has-data-[icon=inline-end]:pr-6 has-data-[icon=inline-start]:pl-6",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type CortexButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "variant" | "size"
> &
  VariantProps<typeof cortexButtonVariants> & {
    animated?: boolean;
  };

function CortexButton({
  className,
  variant,
  size,
  asChild,
  animated = true,
  children,
  ...props
}: CortexButtonProps) {
  let content: React.ReactNode;

  if (!animated) {
    content = children;
  } else if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<React.PropsWithChildren>;
    const label = child.props.children;
    content = React.cloneElement(
      child,
      {},
      typeof label === "string" ? <SlideText>{label}</SlideText> : label,
    );
  } else {
    content =
      typeof children === "string" ? (
        <SlideText>{children}</SlideText>
      ) : (
        children
      );
  }

  return (
    <Button
      data-cortex-variant={variant}
      data-cortex-size={size}
      variant="default"
      size="default"
      asChild={asChild}
      className={cn(cortexButtonVariants({ variant, size }), className)}
      {...props}
    >
      {content}
    </Button>
  );
}

export { CortexButton, cortexButtonVariants };
