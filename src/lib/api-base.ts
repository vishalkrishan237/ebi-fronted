const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";

export const apiBaseUrl = rawApiBaseUrl.replace(/\/+$/, "");

export function resolveApiUrl(path: string): string {
  if (!apiBaseUrl || !path.startsWith("/")) {
    return path;
  }

  return `${apiBaseUrl}${path}`;
}
