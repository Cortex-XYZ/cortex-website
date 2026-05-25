export type MegaNavLink = {
  label: string
  description: string
  href: string
}

export type MegaNavColumn = {
  heading: string
  links: MegaNavLink[]
}

export type NavItem =
  | { label: string; href: string; megaNav?: never }
  | { label: string; href?: never; megaNav: MegaNavColumn[] }

export const navItems: NavItem[] = [
  {
    label: "About",
    megaNav: [
      {
        heading: "Cortex",
        links: [
          { label: "Mission Statement", href: "/#mission", description: "What Cortex exists to do." },
          { label: "Cortex History", href: "/#history", description: "Where the network came from." },
          { label: "Team", href: "/#team", description: "People behind the network." },
        ],
      },
      {
        heading: "Monad Context",
        links: [
          { label: "What is Monad", href: "/#monad", description: "Foundational context for new visitors." },
          { label: "History and Team", href: "/#monad-history", description: "Monad's story and the team behind it." },
          { label: "Monad Links", href: "/#monad-links", description: "Ecosystem references and MIPLand." },
        ],
      },
      {
        heading: "Start Here",
        links: [
          { label: "New Here?", href: "/#start", description: "Mission, history, Monad context, programs." },
        ],
      },
    ],
  },
  { label: "Services", href: "/#services" },
  { label: "Contact", href: "/#contact" },
]

export const ctaButton = {
  label: "Stake to Support",
  href: "/stake",
}
