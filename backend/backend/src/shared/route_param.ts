/** Express may type `req.params` values as `string | string[]` — normalize for services. */
export const routeParam = (value: string | string[] | undefined): string => {
  if (value === undefined) return "";
  return Array.isArray(value) ? (value[0] ?? "") : value;
};
