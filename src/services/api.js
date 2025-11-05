export async function fetchPaginated({ url, page, pageSize, search, sort, signal }) {
  const params = new URLSearchParams({ page, pageSize });
  if (search) params.set("search", search);
  if (sort) params.set("sort", sort);

  const res = await fetch(`${url}?${params.toString()}`, { signal });
  if (!res.ok) throw new Error("Falha ao buscar dados.");
  const json = await res.json();
  return json;
}
