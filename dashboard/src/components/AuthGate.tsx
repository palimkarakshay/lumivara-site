import { useState, type FormEvent } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { savePAT } from "../lib/auth";

export function AuthGate({ onAuthed }: { onAuthed: (token: string) => void }) {
  const [token, setToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = token.trim();
    if (!trimmed) {
      setError("Paste a token first.");
      return;
    }
    setSubmitting(true);
    setError(null);
    // Cheap sanity check — verify the token resolves before persisting.
    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${trimmed}`, Accept: "application/vnd.github+json" },
      });
      if (!res.ok) {
        setError(`GitHub rejected the token (HTTP ${res.status}).`);
        setSubmitting(false);
        return;
      }
      savePAT(trimmed);
      onAuthed(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-xl"
      >
        <div className="flex items-center gap-2 text-neutral-200">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h1 className="text-lg font-semibold">AI Ops · Sign in</h1>
        </div>
        <p className="text-sm text-neutral-400">
          Paste a fine-grained PAT scoped to{" "}
          <span className="font-mono text-neutral-300">palimkarakshay/lumivara-site</span>.
          The token is stored in your browser's localStorage only.
        </p>
        <label className="block">
          <span className="mb-1 flex items-center gap-1 text-xs uppercase tracking-wide text-neutral-400">
            <KeyRound className="h-3 w-3" /> Personal access token
          </span>
          <input
            type="password"
            autoComplete="off"
            spellCheck={false}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="github_pat_…"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 font-mono text-sm text-neutral-100 outline-none focus:border-emerald-500"
          />
        </label>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-500 disabled:opacity-50"
        >
          {submitting ? "Verifying…" : "Unlock dashboard"}
        </button>
        <p className="text-xs text-neutral-500">
          Required scopes: Actions R/W, Variables R/W, Pull requests R/W, Contents R/W, Metadata R.
        </p>
      </form>
    </div>
  );
}
