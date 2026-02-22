import { useState, useEffect, useCallback } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { jewelryService } from "@/lib/services/jewelryService";
import { Jewelry } from "@/lib/types/jewelry";

export function useJewelry(pageSize: number = 12) {
  const [jewelry, setJewelry] = useState<Jewelry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadJewelry = useCallback(
    async (reset: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const { jewelry: newItems, lastDoc: newLastDoc } =
          await jewelryService.getJewelryItems(pageSize, reset ? undefined : lastDoc || undefined);

        if (reset) {
          setJewelry(newItems);
        } else {
          setJewelry((prev) => [...prev, ...newItems]);
        }

        setLastDoc(newLastDoc);
        setHasMore(newItems.length === pageSize);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jewelry");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    setLastDoc(null);
    setHasMore(true);
    loadJewelry(true);
  };

  useEffect(() => {
    loadJewelry(true);
  }, [loadJewelry]);

  return {
    jewelry,
    loading,
    error,
    hasMore,
    loadMore: () => loadJewelry(false),
    refresh,
  };
}
