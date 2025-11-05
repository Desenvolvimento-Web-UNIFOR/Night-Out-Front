import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

export default function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  showNumbers = true,
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < totalPages;

  const go = (p) => {
    if (p >= 1 && p <= totalPages && p !== page) onPageChange(p);
  };

  const windowPages = () => {
    if (!showNumbers) return [];
    const pages = new Set([1, totalPages, page, page - 1, page + 1]);
    const arr = Array.from(pages).filter(p => p >= 1 && p <= totalPages).sort((a,b) => a-b);
    const out = [];
    let prev = 0;
    for (const p of arr) {
      if (prev && p - prev > 1) out.push("gap");
      out.push(p);
      prev = p;
    }
    return out;
  };

  return (
    <div className="flex items-center justify-between gap-3 mt-6">
      <div className="text-sm text-muted">
        Página <span className="font-medium text-text">{page}</span> de{" "}
        <span className="font-medium text-text">{totalPages}</span> ·{" "}
        <span className="text-text font-medium">{total}</span> itens
      </div>

      <div className="flex items-center gap-1">
        <button
          className="btn-ghost px-3 py-2 disabled:opacity-50"
          onClick={() => go(page - 1)}
          disabled={!canPrev}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {windowPages().map((p, i) =>
          p === "gap" ? (
            <span key={`gap-${i}`} className="px-2 text-muted">
              <MoreHorizontal className="w-4 h-4" />
            </span>
          ) : (
            <button
              key={p}
              onClick={() => go(p)}
              className={`px-3 py-2 rounded-lg border ${
                p === page
                  ? "bg-primary text-white border-primary"
                  : "bg-panel border-border text-text hover:bg-panel/70"
              }`}
            >
              {p}
            </button>
          )
        )}

        <button
          className="btn-ghost px-3 py-2 disabled:opacity-50"
          onClick={() => go(page + 1)}
          disabled={!canNext}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
