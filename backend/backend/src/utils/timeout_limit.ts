export const timeoutLimit = (timeLimit: number) => {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error()), timeLimit)
  );
};
