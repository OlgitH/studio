"use client";

import { inspectLink } from "./importReview";
import { btn, btnPrimary } from "./ui";

// Shown before opening a link on a card that came from an imported file or a
// share link. The page can't run anything an attacker puts in a board, but a
// link on a trusted domain is exactly what a phisher wants — so show where it
// really goes and make the person choose.
export default function LinkPromptDialog({
	raw,
	onClose,
}: {
	raw: string;
	onClose: () => void;
}) {
	const info = inspectLink(raw);
	if (!info) return null;
	const risky = info.flags.length > 0;

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label="Open link?"
			onKeyDown={(e) => e.key === "Escape" && onClose()}
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 print:hidden"
		>
			<div className="tb-box w-full max-w-md rounded-lg p-5">
				<h3 className="text-lg font-bold">Open this link?</h3>
				<p className="mt-2 text-[15px] text-[var(--tb-muted)]">
					This link came from a file or link someone sent you — not from
					Greencrown. Check where it goes before you open it.
				</p>
				<p className="mt-3 text-[15px]">
					It goes to <strong>{info.host}</strong>
				</p>
				<p className="mt-1 rounded border border-[var(--tb-line)] p-2 text-sm [overflow-wrap:anywhere]">
					{info.href}
				</p>
				{risky && (
					<p
						role="alert"
						className="mt-3 rounded border border-amber-400 bg-amber-50 p-3 text-[15px] text-amber-950"
					>
						<strong>Be careful: </strong>
						{info.flags.join("; ")}.
					</p>
				)}
				<div className="mt-4 flex flex-wrap gap-2">
					<button
						type="button"
						autoFocus
						className={btnPrimary}
						onClick={onClose}
					>
						Don&apos;t open
					</button>
					<button
						type="button"
						className={btn}
						onClick={() => {
							window.open(info.href, "_blank", "noopener,noreferrer");
							onClose();
						}}
					>
						Open link
					</button>
				</div>
			</div>
		</div>
	);
}
