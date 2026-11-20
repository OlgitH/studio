"use client";

import {
	useCallback,
	useMemo,
	useEffect,
	useRef,
	useState,
	type DragEvent,
	type FormEvent,
} from "react";
import { flushSync } from "react-dom";
import { guardCell, parseCsv, toCsv, unguardCell } from "./csv";
import {
	MIN_PASSPHRASE_LENGTH,
	decryptBytes,
	encryptBytes,
	generatePassphrase,
} from "./shareCrypto";
import ImportReviewDialog from "./ImportReviewDialog";
import LinkPromptDialog from "./LinkPromptDialog";
import { buildReview, type ImportReview } from "./importReview";
import { btn, btnPrimary, field } from "./ui";
import {
	LIMITS,
	cleanText,
	imageFileProblem,
	safeHref,
	safeShot,
} from "./validate";
import { scanBoard, scanFields, type BoardIssue } from "./sensitive";
import "./task-board.css";

type Status = "todo" | "doing" | "done";
type Kind = "task" | "note";

type Item = {
	id: string;
	kind: Kind;
	status: Status;
	title: string;
	label: string;
	details: string;
	link: string;
	shot: string; // JPEG data URL, or ""
	// Came from outside (an imported file or a share link) rather than being
	// typed here. Links on these cards ask before opening. Cleared if the
	// person types a new link themselves.
	ext?: boolean;
};

const COLUMNS: {
	id: Status;
	label: string;
	bg: string;
	fg: string;
}[] = [
	{ id: "todo", label: "To do", bg: "#e8e8e5", fg: "#2b2b2b" },
	{ id: "doing", label: "Needs Review", bg: "#c6ff00", fg: "#120d0d" },
	{ id: "done", label: "Done", bg: "#120d0d", fg: "#ffffff" },
];

const CSV_HEADER = [
	"type",
	"status",
	"label",
	"title",
	"details",
	"link",
	"screenshot",
];

// Label pill colours. "Services…" is always green; any other label gets a
// stable colour picked from its text so the same label always matches.
const GREEN = { bg: "#dff5df", fg: "#14532d" };
const LABEL_COLOURS = [
	{ bg: "#e0ecff", fg: "#1e3a8a" },
	{ bg: "#fde7d3", fg: "#7c2d12" },
	{ bg: "#f1e4fb", fg: "#581c87" },
	{ bg: "#fbe3ea", fg: "#831843" },
	{ bg: "#fdf3c4", fg: "#713f12" },
	{ bg: "#ddf3f3", fg: "#134e4a" },
];

function labelColour(label: string) {
	if (/^services\b/i.test(label.trim())) return GREEN;
	let h = 0;
	for (const ch of label.toLowerCase()) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
	return LABEL_COLOURS[h % LABEL_COLOURS.length];
}

// Excel caps a cell at 32,767 characters, so screenshots are squeezed to fit.
const MAX_SHOT_CHARS = 30000;

// A Stripe Payment Link (set NEXT_PUBLIC_DONATE_URL in .env.local / hosting).
// No link configured -> the coffee note simply doesn't show.
const DONATE_URL = (process.env.NEXT_PUBLIC_DONATE_URL ?? "").trim();
const donateHref = /^https:\/\//i.test(DONATE_URL) ? DONATE_URL : "";

const STORAGE_KEY = "greencrown-task-board-v1";
const DEFAULT_TITLE = "Website progress checklist";

const str = (v: unknown) => (typeof v === "string" ? v : "");

// Rebuild clean items from untrusted data (storage or a share link).
function cleanItems(raw: unknown[]): Item[] {
	return (raw as Item[])
		.slice(0, LIMITS.items)
		.filter((i) => i && (i.kind === "task" || i.kind === "note"))
		.map((i) => ({
			id: str(i.id).slice(0, 64) || newId(),
			kind: i.kind,
			status: COLUMNS.some((c) => c.id === i.status) ? i.status : "todo",
			label: cleanText(i.label, LIMITS.label),
			title: cleanText(i.title, LIMITS.title),
			details: cleanText(i.details, LIMITS.details),
			link: cleanText(i.link, LIMITS.link),
			shot: safeShot(i.shot),
			ext: i.ext === true,
		}));
}

// Pull a saved board back out of storage, tolerating anything odd in there.
function readSaved(): { title: string; client: string; items: Item[] } | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		if (!data || !Array.isArray(data.items)) return null;
		return {
			title: cleanText(data.title, LIMITS.boardTitle) || DEFAULT_TITLE,
			client: cleanText(data.client, LIMITS.client),
			items: cleanItems(data.items),
		};
	} catch {
		return null;
	}
}

// ── Share links ──
// The board is packed into the URL fragment (#b=…), which browsers never
// send to a server. Text only: screenshots are too big for a URL.
const SHARE_PREFIX = "#b=";
const MAX_SHARE_PAYLOAD = 30000; // refuse absurdly long links on the way in
const WARN_URL_LENGTH = 8000; // beyond this, chat apps tend to truncate

const toB64Url = (bytes: Uint8Array) => {
	let bin = "";
	for (const b of bytes) bin += String.fromCharCode(b);
	return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};
const fromB64Url = (text: string) => {
	const bin = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
	return Uint8Array.from(bin, (c) => c.charCodeAt(0));
};

// Runs bytes through a (de)compression stream, aborting if the output would
// pass `maxOut` — so a tiny crafted link can't balloon into gigabytes.
async function pipe(
	bytes: Uint8Array,
	stream: CompressionStream | DecompressionStream,
	maxOut: number = LIMITS.decompressedBytes,
) {
	const reader = new Blob([bytes as BlobPart])
		.stream()
		.pipeThrough(stream)
		.getReader();
	const chunks: Uint8Array[] = [];
	let total = 0;
	for (;;) {
		const { done, value } = await reader.read();
		if (done) break;
		total += value.length;
		if (total > maxOut) {
			await reader.cancel();
			throw new Error("too large");
		}
		chunks.push(value);
	}
	const out = new Uint8Array(total);
	let at = 0;
	for (const c of chunks) {
		out.set(c, at);
		at += c.length;
	}
	return out;
}

// Thrown when a link is passphrase-protected and none was supplied yet.
class NeedsPassphraseError extends Error {}

// Compress when the browser can (leading flag byte says which), so the same
// bytes can sit inside an encrypted payload and be unpacked after decrypting.
async function packBytes(bytes: Uint8Array): Promise<Uint8Array> {
	const compressed =
		typeof CompressionStream === "undefined"
			? null
			: await pipe(bytes, new CompressionStream("deflate-raw"));
	const body = compressed ?? bytes;
	const out = new Uint8Array(body.length + 1);
	out[0] = compressed ? 1 : 0;
	out.set(body, 1);
	return out;
}

async function unpackBytes(packed: Uint8Array): Promise<Uint8Array> {
	const body = packed.slice(1);
	if (packed[0] !== 1) return body;
	if (typeof DecompressionStream === "undefined")
		throw new Error("unsupported");
	return pipe(body, new DecompressionStream("deflate-raw"));
}

// Payload kinds: "e." encrypted with a passphrase, "z." compressed, "r." raw.
async function encodeShare(
	board: { title: string; client: string; items: Item[] },
	passphrase?: string,
): Promise<string> {
	const json = JSON.stringify({
		t: board.title,
		c: board.client,
		i: board.items.map((i) => [
			i.kind === "task" ? "t" : "n",
			i.status,
			i.label,
			i.title,
			i.details,
			i.link,
		]),
	});
	const bytes = new TextEncoder().encode(json);
	if (passphrase) {
		return `e.${toB64Url(await encryptBytes(await packBytes(bytes), passphrase))}`;
	}
	if (typeof CompressionStream === "undefined") return `r.${toB64Url(bytes)}`;
	return `z.${toB64Url(await pipe(bytes, new CompressionStream("deflate-raw")))}`;
}

async function decodeShare(payload: string, passphrase?: string) {
	if (payload.length > MAX_SHARE_PAYLOAD) throw new Error("too long");
	const kind = payload.slice(0, 2);
	let bytes: Uint8Array = fromB64Url(payload.slice(2));
	if (kind === "e.") {
		if (!passphrase) throw new NeedsPassphraseError();
		// Throws if the passphrase is wrong or the link was altered/cut off.
		bytes = await unpackBytes(await decryptBytes(bytes, passphrase));
	} else if (kind === "z.") {
		if (typeof DecompressionStream === "undefined")
			throw new Error("unsupported");
		bytes = await pipe(bytes, new DecompressionStream("deflate-raw"));
	} else if (kind !== "r.") {
		throw new Error("bad link");
	}
	const data = JSON.parse(new TextDecoder().decode(bytes));
	if (!data || !Array.isArray(data.i)) throw new Error("bad link");
	const items = cleanItems(
		data.i.map((r: unknown[]) => ({
			kind: r[0] === "t" ? "task" : "note",
			status: r[1],
			label: r[2],
			title: r[3],
			details: r[4],
			link: r[5],
		})),
	);
	return {
		title: cleanText(data.t, LIMITS.boardTitle) || DEFAULT_TITLE,
		client: cleanText(data.c, LIMITS.client),
		items,
	};
}

const pad = (n: number) => String(n).padStart(2, "0");
// Local time, e.g. "2026-11-20 14:32" (CSV) / "20 Nov 2026, 14:32" (PDF).
const csvStamp = (d: Date) =>
	`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
const prettyStamp = (d: Date) =>
	`${d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;

const newId = () =>
	typeof crypto !== "undefined" && "randomUUID" in crypto
		? crypto.randomUUID()
		: `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function statusFromText(text: string): Status {
	const key = text.toLowerCase().replace(/[^a-z]/g, "");
	if (key === "done" || key === "complete" || key === "completed")
		return "done";
	if (
		key === "inprogress" ||
		key === "needsreview" ||
		key === "review" ||
		key === "doing" ||
		key === "wip"
	)
		return "doing";
	return "todo";
}

async function fileToShot(file: File): Promise<string> {
	const problem = imageFileProblem(file);
	if (problem) throw new Error(problem);
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise<HTMLImageElement>((resolve, reject) => {
			const el = new Image();
			el.onload = () => resolve(el);
			el.onerror = () => reject(new Error("Could not read that image."));
			el.src = url;
		});
		// Guard against "decompression bomb" images that are tiny to download
		// but enormous to decode.
		if (img.naturalWidth * img.naturalHeight > LIMITS.imagePixels)
			throw new Error("That image is too large to use.");
		let maxW = 720;
		let quality = 0.65;
		let out = "";
		for (let attempt = 0; attempt < 12; attempt++) {
			const scale = Math.min(1, maxW / img.width);
			const canvas = document.createElement("canvas");
			canvas.width = Math.max(1, Math.round(img.width * scale));
			canvas.height = Math.max(1, Math.round(img.height * scale));
			const ctx = canvas.getContext("2d");
			if (!ctx) throw new Error("Could not process that image.");
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
			out = canvas.toDataURL("image/jpeg", quality);
			if (out.length <= MAX_SHOT_CHARS) return out;
			maxW *= 0.85;
			quality = Math.max(0.45, quality - 0.03);
		}
		return out;
	} finally {
		URL.revokeObjectURL(url);
	}
}

// ─── Add / edit form ────────────────────────────────────────────────────────

function ItemForm({
	initial,
	kind,
	labels,
	onSave,
	onCancel,
}: {
	initial?: Item;
	kind: Kind;
	onSave: (
		v: Pick<Item, "label" | "title" | "details" | "link" | "shot">,
	) => void;
	labels: string[];
	onCancel: () => void;
}) {
	const [title, setTitle] = useState(initial?.title ?? "");
	const [label, setLabel] = useState(initial?.label ?? "");
	const [details, setDetails] = useState(initial?.details ?? "");
	const [link, setLink] = useState(initial?.link ?? "");
	const [shot, setShot] = useState(initial?.shot ?? "");
	// A newly attached screenshot has to be confirmed as free of passwords and
	// personal/financial details — the tool can't read text inside images.
	const [shotChecked, setShotChecked] = useState(false);
	const needsShotCheck = shot !== "" && shot !== (initial?.shot ?? "");
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);
	// Live check for passwords, keys, card/bank details as the person types.
	const findings = useMemo(
		() => scanFields([title, label, details, link]),
		[title, label, details, link],
	);
	const blocked = findings.some((f) => f.level === "block");

	async function onFile(file: File | undefined) {
		if (!file) return;
		setError("");
		setBusy(true);
		try {
			setShot(await fileToShot(file));
			setShotChecked(false);
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not add that image.");
		} finally {
			setBusy(false);
		}
	}

	function submit(e: FormEvent) {
		e.preventDefault();
		if (!title.trim() || blocked || (needsShotCheck && !shotChecked)) return;
		onSave({
			label: label.trim(),
			title: title.trim(),
			details: details.trim(),
			link: link.trim(),
			shot,
		});
	}

	return (
		<form
			onSubmit={submit}
			className="flex flex-col gap-2 tb-box rounded border-[var(--tb-accent)] p-3"
		>
			<input
				className={field}
				placeholder={kind === "task" ? "Task title" : "Comment"}
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				aria-label="Title"
				maxLength={LIMITS.title}
				required
				autoFocus
			/>
			<input
				className={field}
				placeholder="Label, e.g. Homepage (optional)"
				value={label}
				onChange={(e) => setLabel(e.target.value)}
				aria-label="Label"
				maxLength={LIMITS.label}
				list="tb-labels"
			/>
			<datalist id="tb-labels">
				{labels.map((l) => (
					<option key={l} value={l} />
				))}
			</datalist>
			<textarea
				className={field}
				placeholder="Details (optional)"
				rows={2}
				value={details}
				onChange={(e) => setDetails(e.target.value)}
				aria-label="Details"
				maxLength={LIMITS.details}
			/>
			<input
				className={field}
				placeholder="Link (optional)"
				value={link}
				onChange={(e) => setLink(e.target.value)}
				aria-label="Link"
				maxLength={LIMITS.link}
			/>
			<div className="flex flex-col gap-2 text-sm">
				{shot && (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={shot}
						alt="Screenshot preview"
						className="max-h-32 w-auto self-start rounded border border-[var(--tb-line)]"
					/>
				)}
				<label className="text-[var(--tb-muted)]">
					<span className="mb-1 block">Screenshot (optional)</span>
					<input
						type="file"
						accept="image/*"
						onChange={(e) => {
							void onFile(e.target.files?.[0]);
							e.target.value = "";
						}}
						className="block w-full text-xs file:mr-2 file:rounded file:border file:border-[var(--tb-line)] file:bg-transparent file:px-2 file:py-1 file:text-[var(--tb-fg)]"
					/>
				</label>
				{shot && (
					<button
						type="button"
						className="self-start text-xs underline"
						onClick={() => setShot("")}
					>
						Remove screenshot
					</button>
				)}
				{needsShotCheck && (
					<label className="flex items-start gap-2 rounded border border-amber-400 bg-amber-50 p-2.5 text-[15px] text-amber-950">
						<input
							type="checkbox"
							className="mt-1"
							checked={shotChecked}
							onChange={(e) => setShotChecked(e.target.checked)}
						/>
						<span>
							I&apos;ve checked this screenshot doesn&apos;t show passwords,
							logins, or personal or financial details. (The tool can&apos;t
							scan images, so this is down to you.)
						</span>
					</label>
				)}
				{busy && <span className="text-xs">Processing image…</span>}
				{error && (
					<span role="alert" className="text-xs text-red-600">
						{error}
					</span>
				)}
			</div>
			{findings.length > 0 && (
				<div
					role="alert"
					className={`rounded border p-3 text-[15px] ${
						blocked
							? "border-red-400 bg-red-50 text-red-950"
							: "border-amber-400 bg-amber-50 text-amber-950"
					}`}
				>
					<strong>{blocked ? "This can't be saved. " : "Careful — "}</strong>
					{blocked
						? "It looks like it contains "
						: "this looks like it may contain "}
					{findings.map((f) => f.label).join(", ")}.{" "}
					{blocked
						? "Please remove it. "
						: "If it's real, please don't put it on a board. "}
					Share sensitive details another way, such as a password manager&apos;s
					share feature or a phone call.
				</div>
			)}
			<div className="flex gap-2">
				<button
					type="submit"
					className={btnPrimary}
					disabled={busy || blocked || (needsShotCheck && !shotChecked)}
				>
					{initial ? "Save" : "Add"}
				</button>
				<button type="button" className={btn} onClick={onCancel}>
					Cancel
				</button>
			</div>
		</form>
	);
}

// ─── Card ───────────────────────────────────────────────────────────────────

function Card({
	item,
	onEdit,
	onDelete,
	onOpenLink,
	onPreview,
	onDragStart,
	onDropBefore,
}: {
	item: Item;
	onEdit: () => void;
	onDelete: () => void;
	// Cards that came from outside ask before opening their link.
	onOpenLink: (raw: string) => void;
	onPreview: (src: string) => void;
	onDragStart?: () => void;
	onDropBefore?: () => void;
}) {
	const href = safeHref(item.link);

	return (
		<li
			draggable={Boolean(onDragStart)}
			onDragStart={onDragStart}
			onDragOver={(e) => onDropBefore && e.preventDefault()}
			onDrop={(e: DragEvent) => {
				if (!onDropBefore) return;
				e.preventDefault();
				e.stopPropagation();
				onDropBefore();
			}}
			className={`tb-box tb-card break-inside-avoid rounded-md p-3 ${
				onDragStart ? "cursor-grab active:cursor-grabbing" : ""
			}`}
		>
			{item.label && (
				<span
					className="mb-1.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold"
					style={{
						backgroundColor: labelColour(item.label).bg,
						color: labelColour(item.label).fg,
					}}
				>
					{item.label}
				</span>
			)}
			<p className="text-base font-normal leading-snug [overflow-wrap:anywhere]">
				{item.title}
			</p>
			{item.details && (
				<p className="mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-[var(--tb-muted)] [overflow-wrap:anywhere]">
					{item.details}
				</p>
			)}
			{item.shot && (
				<button
					type="button"
					onClick={() => onPreview(item.shot)}
					className="mt-2 block w-full overflow-hidden rounded border border-[var(--tb-line)]"
					aria-label="View screenshot full size"
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img src={item.shot} alt="Screenshot" className="w-full" />
				</button>
			)}
			{item.link && (
				<p className="mt-2 text-[15px] [overflow-wrap:anywhere]">
					{href ? (
						<a
							href={href}
							target="_blank"
							rel="noopener noreferrer"
							onClick={(e) => {
								if (!item.ext) return;
								e.preventDefault();
								onOpenLink(item.link);
							}}
							className="underline decoration-[var(--tb-accent)] underline-offset-2"
						>
							{item.link}
						</a>
					) : (
						<span className="text-[var(--tb-muted)]">{item.link}</span>
					)}
				</p>
			)}
			<div className="mt-3 flex flex-wrap items-center gap-2 text-xs print:hidden">
				<button type="button" className={btn} onClick={onEdit}>
					Edit
				</button>
				<button type="button" className={btn} onClick={onDelete}>
					Delete
				</button>
			</div>
		</li>
	);
}

// ─── Board ──────────────────────────────────────────────────────────────────

export default function TaskBoard() {
	const [title, setTitle] = useState(DEFAULT_TITLE);
	const [client, setClient] = useState("");
	const [items, setItems] = useState<Item[]>([]);
	// "todo" | "doing" | "done" | "note" → add form open in that section.
	const [adding, setAdding] = useState<Status | "note" | null>(null);
	const [doneOpen, setDoneOpen] = useState(false);
	// When the PDF was made. Refreshed right before every print (button or
	// Cmd+P) so a saved PDF never shows a stale time.
	const [printedAt, setPrintedAt] = useState<Date | null>(null);
	useEffect(() => {
		const stamp = () => flushSync(() => setPrintedAt(new Date()));
		window.addEventListener("beforeprint", stamp);
		return () => window.removeEventListener("beforeprint", stamp);
	}, []);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [preview, setPreview] = useState<string | null>(null);
	const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
		null,
	);
	const dragId = useRef<string | null>(null);
	const [overCol, setOverCol] = useState<Status | null>(null);
	const fileInput = useRef<HTMLInputElement>(null);

	// Browser autosave. Loading happens after mount (not in the initial state)
	// so server and client render the same HTML; `loaded` stops the empty
	// starting board from overwriting what's saved before it has been read.
	const [loaded, setLoaded] = useState(false);

	// Share-link state. `pendingShare` holds a protected link's payload while
	// we wait for the passphrase; `sharePanel` is the "Share this board" form.
	const [pendingShare, setPendingShare] = useState<string | null>(null);
	const [unlockPass, setUnlockPass] = useState("");
	const [unlockError, setUnlockError] = useState("");
	const [unlockBusy, setUnlockBusy] = useState(false);
	const [sharePanel, setSharePanel] = useState(false);
	const [protect, setProtect] = useState(true);
	const [passphrase, setPassphrase] = useState("");
	const [shareError, setShareError] = useState("");

	// The link on an outside-sourced card that someone has clicked (awaiting OK).
	const [linkPrompt, setLinkPrompt] = useState<string | null>(null);

	// A CSV that has been read and checked but not yet approved. Nothing on the
	// board changes until the person reviews it and confirms.
	const [pendingImport, setPendingImport] = useState<{
		review: ImportReview;
		items: Item[];
		title: string;
		client: string;
	} | null>(null);
	// Whether CSV exports and the PDF include screenshots (share links never do).
	const [includeShots, setIncludeShots] = useState(true);

	// Before the board leaves the browser (share, CSV, PDF) it's scanned for
	// sensitive-looking text AND the person must confirm they've checked it —
	// every time, even when the scan finds nothing, because screenshots (and
	// plain-language secrets) can't be scanned.
	type ExportKind = "csv" | "pdf" | "share";
	const [scanReport, setScanReport] = useState<{
		issues: BoardIssue[];
		run: () => void;
		kind: ExportKind;
		shots: number; // screenshots that would be included
	} | null>(null);
	const [scanConfirmed, setScanConfirmed] = useState(false);
	function gate(kind: ExportKind, run: () => void) {
		setScanConfirmed(false);
		setScanReport({
			issues: scanBoard(title, client, items),
			run,
			kind,
			// Share links never carry screenshots.
			shots:
				kind !== "share" && includeShots
					? items.filter((i) => i.shot).length
					: 0,
		});
	}

	// Decode a share payload and hand it to the review step. Nothing is shown
	// on the board until the person has seen what's in it and approved it —
	// a link is the easiest thing for someone else to put in front of you.
	// Throws NeedsPassphraseError for protected links.
	const loadShared = useCallback(async (payload: string, pass?: string) => {
		const shared = await decodeShare(payload, pass);
		const items = shared.items.map((i) => ({ ...i, ext: true }));
		setPendingImport({
			items,
			title: shared.title,
			client: shared.client,
			review: buildReview({
				source: "link",
				protectedLink: payload.startsWith("e."),
				title: shared.title,
				client: shared.client,
				items,
				skipped: 0,
				currentItems: readSaved()?.items.length ?? 0,
			}),
		});
	}, []);

	async function unlock(e: FormEvent) {
		e.preventDefault();
		if (!pendingShare || !unlockPass.trim()) return;
		setUnlockBusy(true);
		try {
			await loadShared(pendingShare, unlockPass.trim());
			setPendingShare(null);
			setUnlockPass("");
		} catch {
			setUnlockError(
				"That passphrase didn't work — or the link was cut off. Check it and try again.",
			);
		} finally {
			setUnlockBusy(false);
		}
	}
	useEffect(() => {
		const saved = readSaved();
		if (saved) {
			setTitle(saved.title);
			setClient(saved.client);
			setItems(saved.items);
		}
		setLoaded(true);

		// Opened from a share link? Take the payload and clear the hash right
		// away (also keeps dev's double-run of effects from asking twice).
		const takeShareLink = () => {
			const { hash, pathname } = window.location;
			if (!hash.startsWith(SHARE_PREFIX)) return;
			const payload = hash.slice(SHARE_PREFIX.length);
			// Drop the #… (and any ?for=… from links made by older versions),
			// leaving just the page URL.
			window.history.replaceState(null, "", pathname);
			loadShared(payload).catch((e) => {
				if (e instanceof NeedsPassphraseError) {
					// Protected link: ask for the passphrase (kept in memory only).
					setPendingShare(payload);
					setUnlockError("");
				} else {
					setMessage({
						ok: false,
						text: "That share link couldn't be read — it may have been cut off. Ask for a new one.",
					});
				}
			});
		};
		takeShareLink();
		// A link pasted into a tab that already has the tool open only changes
		// the #, so the page doesn't reload — listen for that too.
		window.addEventListener("hashchange", takeShareLink);
		return () => window.removeEventListener("hashchange", takeShareLink);
	}, [loadShared]);

	useEffect(() => {
		if (!loaded) return;
		try {
			window.localStorage.setItem(
				STORAGE_KEY,
				JSON.stringify({ v: 1, title, client, items }),
			);
		} catch {
			setMessage({
				ok: false,
				text: "Couldn't autosave (browser storage is full or blocked). Export a CSV to keep your work.",
			});
		}
	}, [loaded, title, client, items]);

	async function buildShareUrl(pass?: string) {
		const payload = await encodeShare({ title, client, items }, pass);
		// Nothing about the board goes before the "#": the server (and its
		// logs) only ever see the plain page address. In particular no client
		// or board name is put in the URL.
		return `${window.location.origin}${window.location.pathname}${SHARE_PREFIX}${payload}`;
	}

	function openSharePanel() {
		// Protection is on by default, with a ready-made passphrase.
		setProtect(true);
		setPassphrase(generatePassphrase());
		setShareError("");
		setSharePanel(true);
	}

	async function copyShareLink() {
		if (protect && passphrase.trim().length < MIN_PASSPHRASE_LENGTH) {
			setShareError(
				`Use a passphrase of at least ${MIN_PASSPHRASE_LENGTH} characters, or press Generate.`,
			);
			return;
		}
		setShareError("");
		try {
			const urlPromise = buildShareUrl(protect ? passphrase.trim() : undefined);
			const rich =
				typeof ClipboardItem !== "undefined" && "write" in navigator.clipboard;
			if (rich) {
				// Copy as clickable words (for email) plus the plain URL (for
				// WhatsApp/Slack/etc.). The ClipboardItem is created straight
				// away with promised blobs, which Safari requires.
				const esc = (t: string) =>
					t
						.replace(/&/g, "&amp;")
						.replace(/</g, "&lt;")
						.replace(/"/g, "&quot;");
				const text = `Open “${title}”${client.trim() ? ` for ${client.trim()}` : ""}`;
				await navigator.clipboard.write([
					new ClipboardItem({
						"text/html": urlPromise.then(
							(u) =>
								new Blob([`<a href="${esc(u)}">${esc(text)}</a>`], {
									type: "text/html",
								}),
						),
						"text/plain": urlPromise.then(
							(u) => new Blob([u], { type: "text/plain" }),
						),
					}),
				]);
			} else {
				await navigator.clipboard.writeText(await urlPromise);
			}
			const url = await urlPromise;
			const notes = [
				items.some((i) => i.shot) ? "screenshots aren't included" : "",
				url.length > WARN_URL_LENGTH
					? "it's long, so some apps may cut it off — send a CSV instead"
					: "",
			].filter(Boolean);
			setMessage({
				ok: true,
				text: `Share link copied${notes.length ? ` (${notes.join("; ")})` : ""}. ${
					protect
						? "Send the passphrase separately — not in the same message."
						: "It is NOT protected: anyone with it can read the board."
				}`,
			});
		} catch {
			setMessage({
				ok: false,
				text: "Couldn't copy the link — your browser blocked clipboard access.",
			});
		}
	}

	function clearBoard() {
		if (
			!window.confirm(
				"Clear the whole board, including the saved copy in this browser? Export a CSV first if you want to keep it.",
			)
		)
			return;
		setItems([]);
		setTitle(DEFAULT_TITLE);
		setClient("");
		setAdding(null);
		setEditingId(null);
		setMessage({ ok: true, text: "Board cleared." });
	}

	const tasks = items.filter((i) => i.kind === "task");
	const notes = items.filter((i) => i.kind === "note");
	const labels = [...new Set(items.map((i) => i.label).filter(Boolean))];

	function addItem(
		kind: Kind,
		status: Status,
		v: Pick<Item, "label" | "title" | "details" | "link" | "shot">,
	) {
		setItems((prev) => [...prev, { id: newId(), kind, status, ...v }]);
		setAdding(null);
	}

	function updateItem(id: string, v: Partial<Item>) {
		setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...v } : i)));
	}

	function removeItem(id: string) {
		setItems((prev) => prev.filter((i) => i.id !== id));
	}

	function move(id: string, status: Status, beforeId?: string) {
		setItems((prev) => {
			const moving = prev.find((i) => i.id === id);
			if (!moving || id === beforeId) return prev;
			const rest = prev.filter((i) => i.id !== id);
			const next = { ...moving, status };
			const at = beforeId ? rest.findIndex((i) => i.id === beforeId) : -1;
			if (at === -1) return [...rest, next];
			return [...rest.slice(0, at), next, ...rest.slice(at)];
		});
	}

	// ── CSV ──
	function exportCsv() {
		const now = new Date();
		const rows: string[][] = [
			CSV_HEADER,
			["board", "", "", guardCell(title), "", "", ""],
			["client", "", "", guardCell(client), "", "", ""],
			["exported", "", "", csvStamp(now), "", "", ""],
			...items.map((i) => [
				i.kind,
				i.kind === "task"
					? (COLUMNS.find((c) => c.id === i.status)?.label ?? "")
					: "",
				guardCell(i.label),
				guardCell(i.title),
				guardCell(i.details),
				guardCell(i.link),
				includeShots ? i.shot : "",
			]),
		];
		// BOM so Excel reads the file as UTF-8.
		const blob = new Blob(["﻿", toCsv(rows)], {
			type: "text/csv;charset=utf-8",
		});
		const slug =
			title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, "-")
				.replace(/^-|-$/g, "") || "task-board";
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `${slug}-${now.toISOString().slice(0, 10)}.csv`;
		document.body.appendChild(a);
		a.click();
		a.remove();
		setTimeout(() => URL.revokeObjectURL(a.href), 1000);
		setMessage({
			ok: true,
			text: `CSV exported${
				!includeShots && items.some((i) => i.shot)
					? " (without screenshots)"
					: ""
			}.`,
		});
	}

	async function importCsv(file: File | undefined) {
		if (!file) return;
		try {
			if (file.size > LIMITS.csvBytes)
				throw new Error("That file is too large (10 MB max).");
			const text = await file.text();
			// Real CSVs are text. A NUL byte means a binary file (image, zip,
			// spreadsheet…) that has just been renamed .csv.
			if (text.includes("\u0000"))
				throw new Error("That doesn't look like a CSV file.");
			const rows = parseCsv(text);
			if (rows.length < 2) throw new Error("That file has no rows.");
			const header = rows[0].map((h) => h.trim().toLowerCase());
			const col = (name: string) => header.indexOf(name);
			if (col("title") === -1) {
				throw new Error(
					"Couldn't find a 'title' column. Was this exported from this tool?",
				);
			}
			const get = (r: string[], name: string) =>
				(col(name) === -1 ? "" : (r[col(name)] ?? "")).trim();
			let skipped = 0;

			let boardTitle = "";
			let clientName = "";
			let exportedAt = "";
			const imported: Item[] = [];
			for (const r of rows.slice(1)) {
				// No "type" column (or a blank cell) means a plain task.
				const type = get(r, "type").toLowerCase() || "task";
				const text = cleanText(unguardCell(get(r, "title")), LIMITS.title);
				if (type === "board") {
					boardTitle = cleanText(text, LIMITS.boardTitle);
					continue;
				}
				if (type === "client") {
					clientName = cleanText(text, LIMITS.client);
					continue;
				}
				// "exported" (timestamp) rows are expected; anything else
				// unknown, or a row with no title, is skipped.
				if (type === "exported") {
					exportedAt = text;
					continue;
				}
				if ((type !== "task" && type !== "note") || !text) {
					skipped++;
					continue;
				}
				if (imported.length >= LIMITS.items) {
					skipped++;
					continue;
				}
				imported.push({
					id: newId(),
					kind: type,
					status: type === "task" ? statusFromText(get(r, "status")) : "todo",
					title: text,
					label: cleanText(unguardCell(get(r, "label")), LIMITS.label),
					details: cleanText(unguardCell(get(r, "details")), LIMITS.details),
					link: cleanText(unguardCell(get(r, "link")), LIMITS.link),
					// Only raster images our own compressor could have made.
					shot: safeShot(get(r, "screenshot")),
					ext: true,
				});
			}
			// Don't touch the board yet: hand the file's contents to the review
			// step, which shows what's in it and waits for approval.
			setPendingImport({
				items: imported,
				title: boardTitle,
				client: clientName,
				review: buildReview({
					source: "file",
					fileName: file.name.slice(0, 120),
					fileSize: file.size,
					fileModified: file.lastModified,
					header,
					exportedAt,
					title: boardTitle || DEFAULT_TITLE,
					client: clientName,
					items: imported,
					skipped,
					currentItems: items.length,
				}),
			});
		} catch (e) {
			setMessage({
				ok: false,
				text: e instanceof Error ? e.message : "Could not read that CSV.",
			});
		}
	}

	// The person has reviewed the file and approved it: now apply it.
	function approveImport(includeScreenshots: boolean) {
		if (!pendingImport) return;
		const next = includeScreenshots
			? pendingImport.items
			: pendingImport.items.map((i) => ({ ...i, shot: "" }));
		setItems(next);
		if (pendingImport.title) setTitle(pendingImport.title);
		setClient(pendingImport.client);
		setAdding(null);
		setEditingId(null);
		const { skipped } = pendingImport.review;
		setMessage({
			ok: true,
			text: `${pendingImport.review.source === "link" ? "Opened the shared board:" : "Imported"} ${next.length} item${next.length === 1 ? "" : "s"}${
				skipped ? ` (${skipped} row${skipped === 1 ? "" : "s"} skipped)` : ""
			}${
				!includeScreenshots && pendingImport.review.counts.shots
					? ", without screenshots"
					: ""
			}.`,
		});
		setPendingImport(null);
	}

	function renderCard(item: Item, draggable: boolean) {
		if (editingId === item.id) {
			return (
				<li key={item.id}>
					<ItemForm
						labels={labels}
						initial={item}
						kind={item.kind}
						onCancel={() => setEditingId(null)}
						onSave={(v) => {
							// Typing a new link yourself takes ownership of it.
							updateItem(
								item.id,
								v.link === item.link ? v : { ...v, ext: false },
							);
							setEditingId(null);
						}}
					/>
				</li>
			);
		}
		return (
			<Card
				key={item.id}
				item={item}
				onEdit={() => {
					setAdding(null);
					setEditingId(item.id);
				}}
				onDelete={() => removeItem(item.id)}
				onOpenLink={setLinkPrompt}
				onPreview={setPreview}
				onDragStart={
					draggable
						? () => {
								dragId.current = item.id;
							}
						: undefined
				}
				onDropBefore={
					draggable
						? () => {
								if (dragId.current) move(dragId.current, item.status, item.id);
								dragId.current = null;
								setOverCol(null);
							}
						: undefined
				}
			/>
		);
	}

	return (
		<main
			data-no-shots={!includeShots || undefined}
			className="tb-root mx-auto flex min-h-dvh w-full max-w-[1400px] flex-col gap-8 px-4 pb-16 pt-32 md:px-8"
		>
			{/* Header + toolbar */}
			<header className="tb-head flex flex-col gap-4">
				<p className="hidden text-sm font-bold uppercase tracking-widest text-[var(--tb-muted)] print:block">
					Greencrown Studio
				</p>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					aria-label="Board title"
					maxLength={LIMITS.boardTitle}
					className="w-full border-b border-transparent bg-transparent text-3xl font-black leading-tight hover:border-[var(--tb-line)] focus-visible:border-[var(--tb-accent)] focus-visible:outline-none md:text-5xl"
				/>
				<label
					className={`flex items-baseline gap-2 text-lg text-[var(--tb-muted)] ${client.trim() ? "" : "print:hidden"}`}
				>
					<span className="shrink-0">Prepared for</span>
					<input
						value={client}
						onChange={(e) => setClient(e.target.value)}
						placeholder="Client name"
						maxLength={LIMITS.client}
						className="w-full border-b border-[var(--tb-line)] bg-transparent text-[var(--tb-fg)] placeholder:text-[var(--tb-muted)] focus-visible:border-[var(--tb-accent)] focus-visible:outline-none md:max-w-md print:border-transparent print:placeholder:text-transparent"
					/>
				</label>
				<p className="hidden text-sm text-[var(--tb-muted)] print:block">
					{printedAt ? `${prettyStamp(printedAt)} · ` : ""}
					{COLUMNS.filter((c) => c.id !== "done")
						.map(
							(c) =>
								`${tasks.filter((i) => i.status === c.id).length} ${c.label.toLowerCase()}`,
						)
						.join(" · ")}
				</p>
				<div className="flex flex-wrap items-center gap-2 print:hidden">
					<button
						type="button"
						className={btnPrimary}
						onClick={() => gate("csv", exportCsv)}
					>
						Export CSV
					</button>
					<button
						type="button"
						className={btn}
						onClick={() => fileInput.current?.click()}
					>
						Import CSV
					</button>
					<input
						ref={fileInput}
						type="file"
						accept=".csv,text/csv"
						className="hidden"
						onChange={(e) => {
							void importCsv(e.target.files?.[0]);
							e.target.value = "";
						}}
					/>
					<button
						type="button"
						className={btn}
						onClick={() => gate("pdf", () => window.print())}
					>
						Save as PDF
					</button>
					<button
						type="button"
						className={`${btn} inline-flex items-center gap-2`}
						onClick={() =>
							sharePanel ? setSharePanel(false) : openSharePanel()
						}
						aria-expanded={sharePanel}
						aria-label="Copy share link"
					>
						<svg
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							aria-hidden="true"
						>
							<circle cx="18" cy="5" r="3" />
							<circle cx="6" cy="12" r="3" />
							<circle cx="18" cy="19" r="3" />
							<line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
							<line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
						</svg>
						Share
					</button>
					<button type="button" className={btn} onClick={clearBoard}>
						Clear board
					</button>
					{items.some((i) => i.shot) && (
						<label className="flex items-center gap-2 text-sm text-[var(--tb-muted)]">
							<input
								type="checkbox"
								checked={includeShots}
								onChange={(e) => setIncludeShots(e.target.checked)}
							/>
							Include screenshots in CSV &amp; PDF
						</label>
					)}
					{message && (
						<span
							role="status"
							className={`text-sm font-bold ${message.ok ? "text-green-700" : "text-red-600"}`}
						>
							{message.text}
						</span>
					)}
				</div>
				{pendingShare && (
					<form
						onSubmit={unlock}
						className="tb-box flex max-w-xl flex-col gap-3 rounded-md border-[var(--tb-accent)] p-4 print:hidden"
					>
						<h3 className="font-bold">This board is protected</h3>
						<p className="text-[15px] text-[var(--tb-muted)]">
							Enter the passphrase you were sent along with the link.
						</p>
						<div className="flex gap-2">
							<input
								className={field}
								value={unlockPass}
								onChange={(e) => setUnlockPass(e.target.value)}
								placeholder="Passphrase"
								aria-label="Passphrase"
								autoFocus
								autoCapitalize="off"
								autoCorrect="off"
								spellCheck={false}
							/>
							<button
								type="submit"
								className={btnPrimary}
								disabled={unlockBusy}
							>
								{unlockBusy ? "Opening…" : "Open"}
							</button>
						</div>
						{unlockError && (
							<p role="alert" className="text-sm text-red-600">
								{unlockError}
							</p>
						)}
						<button
							type="button"
							className="self-start text-sm underline"
							onClick={() => {
								setPendingShare(null);
								setUnlockPass("");
							}}
						>
							Cancel
						</button>
					</form>
				)}

				{sharePanel && (
					<div className="tb-box flex max-w-xl flex-col gap-3 rounded-md p-4 print:hidden">
						<h3 className="font-bold">Share this board</h3>
						<label className="flex items-start gap-2 text-[15px]">
							<input
								type="checkbox"
								className="mt-1"
								checked={protect}
								onChange={(e) => setProtect(e.target.checked)}
							/>
							<span>
								<strong>Protect with a passphrase</strong> (recommended)
								<span className="block text-[var(--tb-muted)]">
									The link is scrambled, so it&apos;s useless without the
									passphrase.
								</span>
							</span>
						</label>
						{protect ? (
							<>
								<div className="flex gap-2">
									<input
										className={field}
										value={passphrase}
										onChange={(e) => setPassphrase(e.target.value)}
										aria-label="Passphrase"
										autoCapitalize="off"
										autoCorrect="off"
										spellCheck={false}
									/>
									<button
										type="button"
										className={btn}
										onClick={() => setPassphrase(generatePassphrase())}
									>
										Generate
									</button>
								</div>
								<p className="text-[15px] text-[var(--tb-muted)]">
									Send the passphrase separately from the link — by phone or
									text, not in the same email or message.
								</p>
							</>
						) : (
							<p
								role="alert"
								className="rounded border border-amber-400 bg-amber-50 p-3 text-[15px] text-amber-950"
							>
								<strong>⚠ Not protected. </strong>Anyone who gets this link can
								read the whole board — including if it&apos;s forwarded or sits
								in someone&apos;s email or chat history. Only share it like this
								if there&apos;s nothing sensitive on the board.
							</p>
						)}
						{shareError && (
							<p role="alert" className="text-sm text-red-600">
								{shareError}
							</p>
						)}
						<div className="flex gap-2">
							<button
								type="button"
								className={btnPrimary}
								onClick={() => gate("share", () => void copyShareLink())}
							>
								Copy link
							</button>
							{protect && (
								<button
									type="button"
									className={btn}
									onClick={() =>
										void navigator.clipboard
											.writeText(passphrase.trim())
											.then(() =>
												setMessage({ ok: true, text: "Passphrase copied." }),
											)
											.catch(() => {})
									}
								>
									Copy passphrase
								</button>
							)}
							<button
								type="button"
								className={btn}
								onClick={() => setSharePanel(false)}
							>
								Close
							</button>
						</div>
					</div>
				)}

				<p className="max-w-[70ch] text-[15px] leading-relaxed text-[var(--tb-muted)] print:hidden">
					Your board saves automatically in this browser, so a refresh
					won&apos;t lose it — but it isn&apos;t shared, so other people and
					devices won&apos;t see it. Export a CSV to send it on or keep a
					backup, and import one to load it. Choose &ldquo;Save as PDF&rdquo; in
					the print dialog for a shareable visual. Screenshots are compressed so
					they fit in a spreadsheet cell.
				</p>
				<p className="max-w-[70ch] rounded border border-amber-400 bg-amber-50 p-3 text-[15px] leading-relaxed text-amber-950 print:hidden">
					<strong>Security: </strong>don&apos;t put passwords, logins, API keys,
					card or bank details, or other sensitive information on a board. The
					tool warns about common patterns, but it can&apos;t catch everything —
					and boards travel as links, CSV files and PDFs, which can be forwarded
					or sit in email and chat history.
					<br />
					<strong>Personal data: </strong>keep other people&apos;s personal
					details off boards where you can, and never include children&apos;s
					names, ages or photos. Boards are saved on this device until you clear
					them.
				</p>
			</header>

			{/* Kanban */}
			<section
				aria-label="Tasks"
				className="tb-kanban relative isolate -mb-8 grid gap-4 pb-16 pt-8 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-[#1c1c1c] before:content-[''] md:grid-cols-3"
			>
				{COLUMNS.map((c) => {
					const colItems = tasks.filter((i) => i.status === c.id);
					// Done stays collapsed (headline + count only) until expanded.
					const collapsible = c.id === "done";
					const open = !collapsible || doneOpen;
					return (
						<div
							key={c.id}
							onDragOver={(e) => {
								e.preventDefault();
								setOverCol(c.id);
							}}
							onDragLeave={() => setOverCol((o) => (o === c.id ? null : o))}
							onDrop={(e) => {
								e.preventDefault();
								if (dragId.current) move(dragId.current, c.id);
								dragId.current = null;
								setOverCol(null);
							}}
							className={`tb-box tb-colbox flex flex-col gap-3 rounded-lg p-3 ${
								collapsible ? "tb-done" : ""
							} ${overCol === c.id ? "!border-[#c6ff00]" : ""}`}
						>
							<h2
								className="-mx-3 -mt-3 rounded-t-lg text-lg font-bold"
								style={{ backgroundColor: c.bg, color: c.fg }}
							>
								{collapsible ? (
									<button
										type="button"
										onClick={() => setDoneOpen((o) => !o)}
										aria-expanded={open}
										className="flex w-full items-baseline justify-between px-3 py-2 text-left font-bold"
									>
										<span>
											{c.label}{" "}
											<span
												aria-hidden
												className="text-sm font-normal print:hidden"
											>
												{open ? "▾" : "▸"}
											</span>
										</span>
										<span className="text-sm font-normal">
											{colItems.length}
										</span>
									</button>
								) : (
									<span className="flex items-baseline justify-between px-3 py-2">
										{c.label}
										<span className="text-sm font-normal">
											{colItems.length}
										</span>
									</span>
								)}
							</h2>
							<ul
								className={`tb-list min-h-12 flex-col gap-3 ${open ? "flex" : "hidden print:flex"}`}
							>
								{colItems.map((item) => renderCard(item, true))}
							</ul>
							{!open ? null : adding === c.id ? (
								<ItemForm
									labels={labels}
									kind="task"
									onCancel={() => setAdding(null)}
									onSave={(v) => addItem("task", c.id, v)}
								/>
							) : (
								<button
									type="button"
									className={`${btn} self-start bg-white print:hidden`}
									onClick={() => {
										setEditingId(null);
										setAdding(c.id);
									}}
								>
									+ Add task
								</button>
							)}
						</div>
					);
				})}
			</section>

			{/* Notes */}
			{/* The grey panel bleeds to both page edges (viewport-wide ::before)
			and down to the footer (-mb-16 cancels <main>'s bottom padding),
			while the content inside stays in the board's column. */}
			<section
				aria-label="Other comments and notes"
				className="tb-notes relative isolate -mb-16 pb-24 pt-8 before:absolute before:inset-y-0 before:left-1/2 before:-z-10 before:w-screen before:-translate-x-1/2 before:bg-[#efefec] before:content-[''] print:mb-0 print:pb-4"
			>
				<div className="flex max-w-3xl flex-col gap-3">
					<h2 className="text-lg font-bold">Other comments / notes</h2>
					<ul className="tb-list flex flex-col gap-3">
						{notes.map((item) => renderCard(item, false))}
					</ul>
					{adding === "note" ? (
						<ItemForm
							labels={labels}
							kind="note"
							onCancel={() => setAdding(null)}
							onSave={(v) => addItem("note", "todo", v)}
						/>
					) : (
						<button
							type="button"
							className={`${btn} self-start print:hidden`}
							onClick={() => {
								setEditingId(null);
								setAdding("note");
							}}
						>
							+ Add comment
						</button>
					)}

					{donateHref && (
						<p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--tb-line)] pt-5 text-[15px] text-[var(--tb-muted)] print:hidden">
							If you like using this tool, buy me a coffee.
							<a
								href={donateHref}
								target="_blank"
								rel="noopener noreferrer"
								className="rounded bg-[var(--tb-accent)] px-3 py-1.5 text-sm font-bold text-[var(--tb-accent-fg)] hover:opacity-85"
							>
								☕ Buy me a coffee
							</a>
						</p>
					)}
				</div>
			</section>

			{linkPrompt && (
				<LinkPromptDialog
					raw={linkPrompt}
					onClose={() => setLinkPrompt(null)}
				/>
			)}

			{/* Review + approval before a CSV changes the board */}
			{pendingImport && (
				<ImportReviewDialog
					review={pendingImport.review}
					onCancel={() => setPendingImport(null)}
					onApprove={approveImport}
				/>
			)}

			{/* Sensitive-content check before share / export / PDF */}
			{scanReport && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Sensitive information check"
					onKeyDown={(e) => e.key === "Escape" && setScanReport(null)}
					className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 print:hidden"
				>
					<div className="tb-box max-h-full w-full max-w-lg overflow-y-auto rounded-lg p-5">
						{(() => {
							const { issues, kind, shots } = scanReport;
							const hardBlock = issues.some((i) =>
								i.findings.some((f) => f.level === "block"),
							);
							const action = {
								csv: "export the CSV",
								pdf: "save the PDF",
								share: "share this board",
							}[kind];
							return (
								<>
									<h3 className="text-lg font-bold">
										{hardBlock
											? "Can't continue — remove sensitive details first"
											: issues.length > 0
												? "This board may contain sensitive information"
												: `Before you ${action}`}
									</h3>
									<p className="mt-2 text-[15px] text-[var(--tb-muted)]">
										Boards travel as links, CSV files and PDFs, which can be
										forwarded or sit in email and chat history.
									</p>
									{issues.length > 0 ? (
										<ul className="mt-3 flex flex-col gap-2 text-[15px]">
											{issues.map((issue, n) => (
												<li
													key={n}
													className="rounded border border-[var(--tb-line)] p-2.5"
												>
													<span className="font-bold [overflow-wrap:anywhere]">
														{issue.where}
													</span>
													<br />
													<span className="text-[var(--tb-muted)]">
														Looks like{" "}
														{issue.findings.map((f) => f.label).join(", ")}
													</span>
												</li>
											))}
										</ul>
									) : (
										<p className="mt-3 text-[15px]">
											The automatic check found nothing that looks like a
											password, key, or card or bank detail. It can&apos;t catch
											everything, so please check too.
										</p>
									)}
									{shots > 0 && (
										<p className="mt-3 rounded border border-amber-400 bg-amber-50 p-2.5 text-[15px] text-amber-950">
											<strong>
												{shots} screenshot{shots === 1 ? " is" : "s are"}{" "}
												included.{" "}
											</strong>
											Images can&apos;t be scanned. Look at each one, or close
											this and untick &ldquo;Include screenshots in CSV &amp;
											PDF&rdquo;.
										</p>
									)}
									{!hardBlock && (
										<label className="mt-4 flex items-start gap-2 text-[15px]">
											<input
												type="checkbox"
												className="mt-1"
												checked={scanConfirmed}
												onChange={(e) => setScanConfirmed(e.target.checked)}
											/>
											<span>
												I&apos;ve checked this board and it doesn&apos;t contain
												passwords, logins, or personal or financial details.
											</span>
										</label>
									)}
									<div className="mt-4 flex flex-wrap gap-2">
										{!hardBlock && (
											<button
												type="button"
												className={btnPrimary}
												disabled={!scanConfirmed}
												onClick={() => {
													const run = scanReport.run;
													setScanReport(null);
													run();
												}}
											>
												{issues.length > 0 ? "Continue anyway" : "Continue"}
											</button>
										)}
										<button
											type="button"
											autoFocus
											className={hardBlock ? btnPrimary : btn}
											onClick={() => setScanReport(null)}
										>
											{hardBlock ? "Go back and edit" : "Cancel"}
										</button>
									</div>
								</>
							);
						})()}
					</div>
				</div>
			)}

			{/* Screenshot lightbox */}
			{preview && (
				<div
					role="dialog"
					aria-modal="true"
					aria-label="Screenshot"
					onClick={() => setPreview(null)}
					onKeyDown={(e) => e.key === "Escape" && setPreview(null)}
					className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 print:hidden"
				>
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						src={preview}
						alt="Screenshot full size"
						className="max-h-full max-w-full rounded"
					/>
					<button
						type="button"
						autoFocus
						className="absolute right-4 top-4 rounded bg-white px-3 py-1.5 text-sm font-bold text-black"
						onClick={() => setPreview(null)}
					>
						Close
					</button>
				</div>
			)}
		</main>
	);
}
