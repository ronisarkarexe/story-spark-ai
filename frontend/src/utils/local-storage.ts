export const setToLocalStorage = (key: string, value: string): void => {
  if (!key || typeof window === "undefined") {
    return;
  }
  localStorage.setItem(key, value);
};

export const getFromLocalStorage = (key: string): string | null => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  return localStorage.getItem(key);
};

export const removeFromLocalStorage = (key: string): void => {
  if (!key || typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(key);
};
