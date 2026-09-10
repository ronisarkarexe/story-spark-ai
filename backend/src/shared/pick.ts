const pick = <T extends object, k extends keyof T>(
  obj: T,
  keys: k[]
): Partial<T> => {
  const finalObject: Partial<T> = {};
  for (const key of keys) {
    if (obj && Object.hasOwnProperty.call(obj, key)) {
      finalObject[key] = obj[key];
    }
  }
  return finalObject;
};
export default pick;
