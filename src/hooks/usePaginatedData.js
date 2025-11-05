import { useEffect, useMemo, useRef, useState } from "react";

export default function usePaginatedData({
  mode = "local",
  localData = [],
  remoteFetcher,
  initialPage = 1,
  pageSize = 6,
  search = "",
  sort = null,
}) {
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const cacheRef = useRef(new Map());

  const key = useMemo(() => JSON.stringify({ page, pageSize, search, sort }), [page, pageSize, search, sort]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError("");

      try {
        if (mode === "local") {
          let filtered = localData;
          if (search?.trim()) {
            const q = search.trim().toLowerCase();
            filtered = localData.filter((x) =>
              JSON.stringify(x).toLowerCase().includes(q)
            );
          }
          if (sort) {
            const [field, dir] = sort.split(":");
            filtered = [...filtered].sort((a, b) => {
              const av = a[field];
              const bv = b[field];
              if (av == null || bv == null) return 0;
              if (av < bv) return dir === "desc" ? 1 : -1;
              if (av > bv) return dir === "desc" ? -1 : 1;
              return 0;
            });
          }
          const start = (page - 1) * pageSize;
          const paginated = filtered.slice(start, start + pageSize);
          if (!cancelled) {
            setItems(paginated);
            setTotal(filtered.length);
          }
        } else {
          if (cacheRef.current.has(key)) {
            const cached = cacheRef.current.get(key);
            if (!cancelled) {
              setItems(cached.items);
              setTotal(cached.total);
            }
          } else {
            if (!remoteFetcher) throw new Error("remoteFetcher não fornecido.");
            const resp = await remoteFetcher({ page, pageSize, search, sort });
            if (!cancelled) {
              setItems(resp.items || []);
              setTotal(resp.total || 0);
              cacheRef.current.set(key, { items: resp.items || [], total: resp.total || 0 });
            }
          }
        }
      } catch (e) {
        if (!cancelled) setError(e.message || "Erro ao carregar.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, [key, mode, localData, remoteFetcher, pageSize, page, search, sort]);

  return {
    page, setPage,
    pageSize,
    items,
    total,
    loading,
    error,
    setSearch: () => {},
  };
}
