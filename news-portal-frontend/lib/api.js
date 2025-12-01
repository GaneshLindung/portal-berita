export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function safeFetchJson(path, fallback = []) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`);
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`Request error for ${API_BASE_URL}${path}:`, error);
    return fallback;
  }
}