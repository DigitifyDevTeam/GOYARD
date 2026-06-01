/** rel for third-party links opened in a new tab */
export const EXTERNAL_LINK_REL = "nofollow noopener noreferrer";

export function isExternalHref(href: string): boolean {
  return /^https?:\/\//i.test(href);
}
