// eslint-disable-next-line @typescript-eslint/no-unused-vars

export default function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  wait: number
) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  const cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
    lastArgs = null;
  };
  const flush = () => {
    cancel();
    if (lastArgs !== null) {
      fn(...lastArgs);
    }
  };
  const debounced = (...args: Parameters<T>) => {
    cancel();
    lastArgs = args;
    timer = setTimeout(() => {
      if (lastArgs !== null) {
        fn(...lastArgs);
      }
      timer = null;
    }, wait);
  };
  (debounced as unknown as { cancel: () => void; flush: () => void }).cancel = cancel;
  (debounced as unknown as { cancel: () => void; flush: () => void }).flush = flush;
  return debounced;
}
