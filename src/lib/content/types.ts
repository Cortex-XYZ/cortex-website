export type InternalHref =
  | `/${string}`
  | `#${string}`
  | `mailto:${string}`

export type ExternalHref = `https://${string}` | `http://${string}`

export type LinkHref = InternalHref | ExternalHref

export type RichTextSpan<LinkKey extends string = string> =
  | string
  | {
      text: string
      linkKey: LinkKey
      underline?: boolean
    }

export type RichText<LinkKey extends string = string> =
  readonly RichTextSpan<LinkKey>[]

export type ContentParagraph<LinkKey extends string = string> =
  | string
  | RichText<LinkKey>

export type ContentImage = {
  src: `/${string}`
  alt: string
  width?: number
  height?: number
}

export type ContentCta = {
  label: string
  href: LinkHref
  ariaLabel?: string
}

export type SectionContent = {
  id: string
  eyebrow?: string
  title: string
  description?: string
}
