import { siteLinks } from "./links"

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
          {
            label: "Mission Statement",
            href: siteLinks.mission.href,
            description: "What Cortex exists to do.",
          },
          {
            label: "Cortex History",
            href: siteLinks.history.href,
            description: "Where the network came from.",
          },
          {
            label: "Team",
            href: siteLinks.team.href,
            description: "People behind the network.",
          },
        ],
      },
      {
        heading: "Monad Context",
        links: [
          {
            label: "What is Monad",
            href: siteLinks.monad.href,
            description: "Foundational context for new visitors.",
          },
          {
            label: "History and Team",
            href: siteLinks.monadHistory.href,
            description: "Monad's story and the team behind it.",
          },
          {
            label: "Monad Links",
            href: siteLinks.monadLinks.href,
            description: "Ecosystem references and MIPLand.",
          },
        ],
      },
      {
        heading: "Start Here",
        links: [
          {
            label: "New Here?",
            href: siteLinks.start.href,
            description: "Mission, history, Monad context, programs.",
          },
        ],
      },
    ],
  },
  { label: siteLinks.services.label, href: siteLinks.services.href },
  { label: siteLinks.contact.label, href: siteLinks.contact.href },
]

export type DirectNavLink = { label: string; href: string }

export const aboutNavItem = navItems.find((item) => item.megaNav)

export const directNavLinks = navItems.filter(
  (item): item is DirectNavLink => !item.megaNav,
)

export const ctaButton = {
  label: siteLinks.stake.label,
  href: siteLinks.stake.href,
}
