const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  'http://localhost:4000';

const normalizedBaseUrl = apiBaseUrl.endsWith('/')
  ? apiBaseUrl.slice(0, -1)
  : apiBaseUrl;

export function buildApiUrl(path) {
  if (!path) return normalizedBaseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBaseUrl}${normalizedPath}`;
}

export const API_BASE_URL = normalizedBaseUrl;