import { useState, useEffect, useCallback } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { perfumeService } from "@/lib/services/perfumeService";
import { Perfume } from "@/lib/types/perfumes";

export function usePerfumes(pageSize: number = 12) {
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const loadPerfumes = useCallback(
    async (reset: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const { perfumes: newItems, lastDoc: newLastDoc } =
          await perfumeService.getPerfumes(pageSize, reset ? undefined : lastDoc || undefined);

        if (reset) {
          setPerfumes(newItems);
        } else {
          setPerfumes((prev) => [...prev, ...newItems]);
        }

        setLastDoc(newLastDoc);
        setHasMore(newItems.length === pageSize);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load perfumes");
      } finally {
        setLoading(false);
      }
    },
    [pageSize]
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => {
    setLastDoc(null);
    setHasMore(true);
    loadPerfumes(true);
  };

  useEffect(() => {
    loadPerfumes(true);
  }, [loadPerfumes]);

  return {
    perfumes,
    loading,
    error,
    hasMore,
    loadMore: () => loadPerfumes(false),
    refresh,
  };
}
