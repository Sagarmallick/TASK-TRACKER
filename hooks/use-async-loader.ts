"use client";

import { useState } from "react";

export function useAsyncLoader() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    if (loading) return;

    try {
      setLoading(true);
      setError(null);
      return await fn();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  return {
    loading,
    error,
    run,
  };
}
