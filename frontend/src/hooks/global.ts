import { useDebounce } from 'use-debounce';

export const useDebounced = ({ searchQuery, delay }: { searchQuery: string, delay: number }) => {
  const [debouncedValue] = useDebounce(searchQuery, delay);
  return debouncedValue;
};
