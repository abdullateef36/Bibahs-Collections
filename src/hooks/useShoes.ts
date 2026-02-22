import { useState, useEffect, useCallback } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { shoeService } from "@/lib/services/shoeService";
import { Shoe } from "@/lib/types/shoes";

export function useShoes(pageSize: number = 12) {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadShoes = useCallback(
    async (reset: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const { shoes: newItems, lastDoc: newLastDoc } =
          await shoeService.getShoes(pageSize, reset ? undefined : lastDoc || undefined);

        if (reset) {
          setShoes(newItems);
        } else {
          setShoes((prev) => [...prev, ...newItems]);
        }

        setLastDoc(newLastDoc);
        setHasMore(newItems.length === pageSize);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load shoes");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    setLastDoc(null);
    setHasMore(true);
    loadShoes(true);
  };

  useEffect(() => {
    loadShoes(true);
  }, [loadShoes]);

  return {
    shoes,
    loading,
    error,
    hasMore,
    loadMore: () => loadShoes(false),
    refresh,
  };
}
