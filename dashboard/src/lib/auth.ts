const STORAGE_KEY = "lumivara.ops.pat";

export function loadPAT(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function savePAT(token: string): void {
  localStorage.setItem(STORAGE_KEY, token.trim());
}

export function clearPAT(): void {
  localStorage.removeItem(STORAGE_KEY);
}
