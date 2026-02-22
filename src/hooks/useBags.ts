import { useState, useEffect, useCallback } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { bagService } from "@/lib/services/bagService";
import { Bag } from "@/lib/types/bags";

export function useBags(pageSize: number = 12) {
  const [bags, setBags] = useState<Bag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadBags = useCallback(
    async (reset: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const { bags: newItems, lastDoc: newLastDoc } =
          await bagService.getBags(pageSize, reset ? undefined : lastDoc || undefined);

        if (reset) {
          setBags(newItems);
        } else {
          setBags((prev) => [...prev, ...newItems]);
        }

        setLastDoc(newLastDoc);
        setHasMore(newItems.length === pageSize);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bags");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    setLastDoc(null);
    setHasMore(true);
    loadBags(true);
  };

  useEffect(() => {
    loadBags(true);
  }, [loadBags]);

  return {
    bags,
    loading,
    error,
    hasMore,
    loadMore: () => loadBags(false),
    refresh,
  };
}
