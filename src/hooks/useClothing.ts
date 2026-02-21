import { useState, useEffect, useCallback } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { clothingService } from "@/lib/services/clothingService";
import { Clothing } from "@/lib/types/clothing";

export function useClothing(pageSize: number = 12) {
  const [clothing, setClothing] = useState<Clothing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadClothing = useCallback(async (reset: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const { clothing: newItems, lastDoc: newLastDoc } =
        await clothingService.getClothingItems(pageSize, reset ? undefined : lastDoc || undefined);

      if (reset) {
        setClothing(newItems);
      } else {
        setClothing((prev) => [...prev, ...newItems]);
      }

      setLastDoc(newLastDoc);
      setHasMore(newItems.length === pageSize);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load clothing");
    } finally {
      setLoading(false);
    }
  }, [pageSize]); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    setLastDoc(null);
    setHasMore(true);
    loadClothing(true);
  };

  useEffect(() => {
    loadClothing(true);
  }, [loadClothing]);

  return {
    clothing,
    loading,
    error,
    hasMore,
    loadMore: () => loadClothing(false),
    refresh,
  };
}
