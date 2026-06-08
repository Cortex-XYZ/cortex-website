const VARIANT_CLASS = {
  orange: "section-divider--orange",
  "orange-reverse": "section-divider--orange-reverse",
  purple: "section-divider--purple",
} as const;

type SectionDividerVariant = keyof typeof VARIANT_CLASS;

type SectionDividerProps = {
  variant?: SectionDividerVariant;
  className?: string;
};

export function SectionDivider({
  variant = "orange",
  className,
}: SectionDividerProps) {
  return (
    <hr
      className={`section-divider ${VARIANT_CLASS[variant]}${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    />
  );
}
