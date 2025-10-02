export type Product = {
  name: string;
  popularityScore: number;
  weight: number;
  images: { yellow: string; rose: string; white: string };
};

export async function fetchProducts(): Promise<Product[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/products`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}
