type Entry<T> = { v: T; exp: number };
const mem = new Map<string, Entry<any>>();

export async function cached<T>(key: string, ttlMs: number, loader: () => Promise<T>): Promise<T> {
  const hit = mem.get(key);
  if (hit && hit.exp > Date.now()) return hit.v;
  const v = await loader();
  mem.set(key, { v, exp: Date.now() + ttlMs });
  return v;
}
