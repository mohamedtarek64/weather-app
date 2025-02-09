export function useLocalStorage(key) {
  const save = (value) => {
    try {
      const serialized = JSON.stringify(value);
      window.localStorage.setItem(key, serialized);
    } catch (error) {
      console.warn("[useLocalStorage] Failed to save:", error);
    }
  };

  const get = (fallback = null) => {
    try {
      const stored = window.localStorage.getItem(key);
      if (!stored) return fallback;
      return JSON.parse(stored);
    } catch (error) {
      console.warn("[useLocalStorage] Failed to parse:", error);
      return fallback;
    }
  };

  const remove = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.warn("[useLocalStorage] Failed to remove:", error);
    }
  };

  return {
    save,
    get,
    remove,
  };
}
