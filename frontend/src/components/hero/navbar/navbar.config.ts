export interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Home", end: true },
  { to: "/explore", label: "Explore" },
  { to: "/story-inspiration", label: "Stories" },
  { to: "/community", label: "Community" },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  { to: "/analytics", label: "Analytics" },
  { to: "/collab", label: "Collab" },
  { to: "/contact-us", label: "Contact" },
  { to: "/help-center", label: "Help" },
];

export const isNavActive = (pathname: string, path: string, end?: boolean) => {
  if (end || path === "/") {
    return pathname === path;
  }
  return pathname === path || pathname.startsWith(`${path}/`);
};
