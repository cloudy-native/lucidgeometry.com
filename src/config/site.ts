export type SiteConfig = typeof siteConfig;

const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "About",
    href: "/about",
  },
];

export const siteConfig = {
  name: "Lucid Geometry",
  description:
    "Lucid Geometry is a modern, three-dimensional evolution of the Spirograph idea.",
  navItems,
  navMenuItems: navItems,
  links: {
    github: "https://github.com/cloudy-native/lucidgeometry.com",
    linkedin: "https://www.linkedin.com/in/stephenharrison/",
    portfolio: "https://handycomputerbloke.com",
    contact: "https://dinsor.org",
  },
};
