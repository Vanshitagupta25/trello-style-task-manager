import { useState, useEffect } from "react";

export function LocalStorage(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;

    } catch (err) {
      console.log(err);
      return initialValue;

    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));

    } catch (err) {
      console.log(err);
    }
  }, [key, state]);
  return [state, setState];
}