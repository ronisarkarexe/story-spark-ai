export const setToLocalStorage = (key: string, value: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  try {
    localStorage.setItem(key, value);
    return value;
  } catch {
    return "";
  }
};

export const getFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  try {
    return localStorage.getItem(key);
  } catch {
    return "";
  }
};

export const removeFromLocalStorage = (key: string) => {
  if (!key || typeof window === "undefined") {
    return "";
  }
  try {
    localStorage.removeItem(key);
    return "";
  } catch {
    return "";
  }
};
