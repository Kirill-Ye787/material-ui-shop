import { useEffect, useState } from 'react';
import { readStorage, writeStorage } from '../utils/localStorage.js';

export function usePersistentState(key, initialValue, validate = value => value) {
  const [value, setValue] = useState(() => validate(readStorage(key, initialValue)));
  useEffect(() => { writeStorage(key, value); }, [key, value]);
  return [value, setValue];
}
