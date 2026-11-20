"use client";

import { useState, type ReactNode } from "react";
import type { ImportReview } from "./importReview";
import { btn, btnPrimary } from "./ui";

const kb = (bytes: number) =>
	bytes < 1024 * 1024
		? `${Math.max(1, Math.round(bytes / 1024))} KB`
		: `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// One row of the checklist: a status mark, a heading, and some detail.
function Check({
	tone,
	title,
	children,
}: {
	tone: "ok" | "warn" | "bad";
	title: string;
	children?: ReactNode;
}) {
	const mark = { ok: "✓", warn: "⚠", bad: "✕" }[tone];
	const colour = {
		ok: "text-green-700",
		warn: "text-amber-700",
		bad: "text-red-700",
	}[tone];
	return (
		<li className="flex gap-3 rounded border border-[var(--tb-line)] p-3">
			<span aria-hidden className={`mt-0.5 font-bold ${colour}`}>
				{mark}
			</span>
			<div className="min-w-0 text-[15px]">
				<p className="font-bold">{title}</p>
				{children && (
					<div className="mt-1 text-[var(--tb-muted)] [overflow-wrap:anywhere]">
						{children}
					</div>
				)}
			</div>
		</li>
	);
}

export default function ImportReviewDialog({
	review,
	onCancel,
	onApprove,
}: {
	review: ImportReview;
	onCancel: () => void;
	onApprove: (includeScreenshots: boolean) => void;
}) {
	const [trusted, setTrusted] = useState(false);
	const [includeShots, setIncludeShots] = useState(true);
	const { counts, links, issues } = review;
	const blocked = issues.some((i) =>
		i.findings.some((f) => f.level === "block"),
	);
	const tasks = counts.todo + counts.doing + counts.done;
	const flaggedLinks = links.filter((l) => l.flags.length > 0);
	const isLink = review.source === "link";

	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-label={
				isLink ? "Review shared board" : "Review file before importing"
			}
			onKeyDown={(e) => e.key === "Escape" && onCancel()}
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 print:hidden"
		>
			<div className="tb-box max-h-full w-full max-w-xl overflow-y-auto rounded-lg p-5">
				<h3 className="text-lg font-bold">
					{isLink
						? "Review this shared board before opening it"
						: "Review this file before importing"}
				</h3>
				{isLink ? (
					<p className="mt-1 text-[15px] text-[var(--tb-muted)]">
						You opened a share link. Nothing has been loaded yet.
					</p>
				) : (
					<p className="mt-1 text-[15px] [overflow-wrap:anywhere]">
						<strong>{review.fileName}</strong>{" "}
						<span className="text-[var(--tb-muted)]">
							· {kb(review.fileSize)} · last changed{" "}
							{new Date(review.fileModified).toLocaleDateString("en-GB", {
								day: "numeric",
								month: "short",
								year: "numeric",
							})}
						</span>
					</p>
				)}

				<ul className="mt-4 flex flex-col gap-2">
					{isLink ? (
						review.protectedLink ? (
							<Check
								tone="ok"
								title="Unlocked with the passphrase you were given"
							>
								That shows the sender gave you the passphrase. It doesn&apos;t
								prove who made the link, so still only open links from people
								you trust.
							</Check>
						) : (
							<Check tone="warn" title="Came from a share link">
								Anyone can make one, and this one wasn&apos;t protected with a
								passphrase. Only open links from people you trust.
							</Check>
						)
					) : review.fromTool ? (
						<Check tone="ok" title="Looks like it was exported from this tool">
							Exported {review.exportedAt}. That&apos;s a note written inside
							the file, not proof — anyone could add one.
						</Check>
					) : (
						<Check tone="warn" title="Not exported from this tool">
							It was made or changed somewhere else (another app, or by hand).
							Make sure you know where it came from.
						</Check>
					)}

					<Check
						tone="ok"
						title={`${review.title}${review.client ? ` — ${review.client}` : ""}`}
					>
						{tasks} task{tasks === 1 ? "" : "s"} ({counts.todo} to do,{" "}
						{counts.doing} needs review, {counts.done} done) · {counts.notes}{" "}
						note{counts.notes === 1 ? "" : "s"} · {counts.labels} label
						{counts.labels === 1 ? "" : "s"}
						{review.currentItems > 0 && (
							<>
								<br />
								<strong className="text-[var(--tb-fg)]">
									This replaces your current board ({review.currentItems} item
									{review.currentItems === 1 ? "" : "s"}).
								</strong>{" "}
								Export first if you want to keep it.
							</>
						)}
						{review.skipped > 0 && (
							<>
								<br />
								{review.skipped} row{review.skipped === 1 ? " was" : "s were"}{" "}
								skipped (unusable or over the 1,000-item limit).
							</>
						)}
					</Check>

					{blocked ? (
						<Check
							tone="bad"
							title="Contains something that can't be stored here"
						>
							It looks like it has a private key, card number or password. Ask
							the sender to remove it and send a clean copy.
							<ul className="mt-1 list-disc pl-5">
								{issues
									.filter((i) => i.findings.some((f) => f.level === "block"))
									.map((i, n) => (
										<li key={n}>
											{i.where} — looks like{" "}
											{i.findings.map((f) => f.label).join(", ")}
										</li>
									))}
							</ul>
						</Check>
					) : issues.length > 0 ? (
						<Check
							tone="warn"
							title={`${issues.length} card${issues.length === 1 ? "" : "s"} may contain sensitive information`}
						>
							<ul className="list-disc pl-5">
								{issues.slice(0, 6).map((i, n) => (
									<li key={n}>
										{i.where} — looks like{" "}
										{i.findings.map((f) => f.label).join(", ")}
									</li>
								))}
								{issues.length > 6 && <li>…and {issues.length - 6} more</li>}
							</ul>
							They&apos;ll be stored in this browser, and sharing or exporting
							will need your confirmation.
						</Check>
					) : (
						<Check
							tone="ok"
							title="Nothing that looks like a password, key or card or bank detail"
						>
							The automatic check can&apos;t catch everything.
						</Check>
					)}

					{links.length === 0 && review.textOnlyLinks === 0 ? (
						<Check tone="ok" title="No links" />
					) : (
						<Check
							tone={
								flaggedLinks.length > 0 || review.textOnlyLinks > 0
									? "warn"
									: "ok"
							}
							title={`Links go to ${links.length} place${links.length === 1 ? "" : "s"}`}
						>
							<ul className="list-disc pl-5">
								{links.slice(0, 8).map((l) => (
									<li key={l.host}>
										<strong className="text-[var(--tb-fg)]">{l.host}</strong>
										{l.count > 1 ? ` (${l.count})` : ""}
										{l.flags.length > 0 && (
											<span className="text-amber-800">
												{" "}
												— {l.flags.join("; ")}
											</span>
										)}
									</li>
								))}
								{links.length > 8 && <li>…and {links.length - 8} more</li>}
							</ul>
							{review.textOnlyLinks > 0 && (
								<p className="mt-1">
									{review.textOnlyLinks === 1
										? "1 link isn't a web or email address and will show as plain text only."
										: `${review.textOnlyLinks} links aren't web or email addresses and will show as plain text only.`}
								</p>
							)}
						</Check>
					)}

					{counts.shots > 0 && (
						<li className="rounded border border-[var(--tb-line)] p-3 text-[15px]">
							<label className="flex items-start gap-2">
								<input
									type="checkbox"
									className="mt-1"
									checked={includeShots}
									onChange={(e) => setIncludeShots(e.target.checked)}
								/>
								<span>
									<strong>
										Include the {counts.shots} screenshot
										{counts.shots === 1 ? "" : "s"}
									</strong>
									<span className="block text-[var(--tb-muted)]">
										Images can&apos;t be scanned for passwords or personal
										details. Untick to import the cards without them.
									</span>
								</span>
							</label>
						</li>
					)}
				</ul>

				{!blocked && (
					<label className="mt-4 flex items-start gap-2 text-[15px]">
						<input
							type="checkbox"
							className="mt-1"
							checked={trusted}
							onChange={(e) => setTrusted(e.target.checked)}
						/>
						<span>
							{isLink
								? "I trust who sent me this link and want to open it."
								: "I trust where this file came from and want to import it."}
						</span>
					</label>
				)}

				<div className="mt-4 flex flex-wrap gap-2">
					{!blocked && (
						<button
							type="button"
							className={btnPrimary}
							disabled={!trusted}
							onClick={() => onApprove(includeShots)}
						>
							{review.currentItems > 0
								? "Replace my board"
								: isLink
									? "Open board"
									: "Import"}
						</button>
					)}
					<button
						type="button"
						autoFocus
						className={blocked ? btnPrimary : btn}
						onClick={onCancel}
					>
						{blocked ? "Close" : "Cancel"}
					</button>
				</div>
			</div>
		</div>
	);
}
