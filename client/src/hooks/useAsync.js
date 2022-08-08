import { useCallback, useEffect, useState } from "react";

export function useAsync(func, deps = []) {
  const { execute, ...state } = useAsyncInternal(func, deps, true);

  useEffect(() => {
    execute();
  }, [execute]);

  return state;
}

export function useAsyncFn(func, deps = []) {
  return useAsyncInternal(func, deps, false);
}

function useAsyncInternal(func, deps, initialLoading = false) {
  const [loading, setLoading] = useState(initialLoading);
  const [error, setError] = useState();
  const [value, setValue] = useState();

  const execute = useCallback((...params) => {
    setLoading(true);
    return func(...params)
      .then((data) => {
        setValue(data);
        setError(undefined);
        return data;
      })
      .catch((error) => {
        setError(error);
        setValue(undefined);
        return Promise.reject(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  return { loading, error, value, execute };
}
