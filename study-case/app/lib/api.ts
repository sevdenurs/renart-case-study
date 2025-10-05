export type Product = {
  name: string;
  price: number;
  popularityScore: number;
  weight: number;
  images: { yellow: string; rose: string; white: string };
};

export type ProductFilters = {
  priceMin?: number;
  priceMax?: number;
  popMin?: number;
  popMax?: number;

  minPrice?: number;
  maxPrice?: number;
  minPopularity?: number;
  maxPopularity?: number;
};

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

  const qs = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([k, v]) => {
      if (typeof v === "number" && Number.isFinite(v)) qs.set(k, String(v));
    });
  }
  const url = `${base}/api/products${qs.toString() ? `?${qs}` : ""}`;
  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new Error(`Network error fetching ${url || "/api/products"}: ${msg}`);
  }
  if (!res.ok) {
    let detail = "";
    try { detail = (await res.json())?.error ?? ""; } catch {}
    throw new Error(`Fetch failed: ${res.status}${detail ? ` - ${detail}` : ""}`);
    
  }
  const data = await res.json();
  return data;
}
