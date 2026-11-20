// Shared Tailwind class strings for the task board's buttons and inputs.

export const btn =
	"rounded border border-[var(--tb-line)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tb-accent)]";
export const btnPrimary =
	"rounded bg-[var(--tb-accent)] px-3 py-1.5 text-sm font-bold text-[var(--tb-accent-fg)] transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tb-accent)]";
export const field =
	"w-full rounded border border-[var(--tb-line)] bg-transparent px-2.5 py-1.5 text-sm text-[var(--tb-fg)] placeholder:text-[var(--tb-muted)] focus-visible:outline-2 focus-visible:outline-[var(--tb-accent)]";
