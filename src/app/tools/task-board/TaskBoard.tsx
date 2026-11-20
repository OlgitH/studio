"use client";

import {
	useEffect,
	useRef,
	useState,
	type DragEvent,
	type FormEvent,
} from "react";
import { flushSync } from "react-dom";
import { guardCell, parseCsv, toCsv, unguardCell } from "./csv";
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

// Pull a saved board back out of storage, tolerating anything odd in there.
function readSaved(): { title: string; client: string; items: Item[] } | null {
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) return null;
		const data = JSON.parse(raw);
		if (!data || !Array.isArray(data.items)) return null;
		const str = (v: unknown) => (typeof v === "string" ? v : "");
		const items: Item[] = data.items
			.filter((i: Item) => i && (i.kind === "task" || i.kind === "note"))
			.map((i: Item) => ({
				id: str(i.id) || newId(),
				kind: i.kind,
				status: COLUMNS.some((c) => c.id === i.status) ? i.status : "todo",
				label: str(i.label),
				title: str(i.title),
				details: str(i.details),
				link: str(i.link),
				shot: str(i.shot),
			}));
		return {
			title: str(data.title) || DEFAULT_TITLE,
			client: str(data.client),
			items,
		};
	} catch {
		return null;
	}
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

// Only ever render http(s)/mailto links — imported CSVs are untrusted input
// and a `javascript:` URL in the link column must not become a clickable href.
function safeHref(raw: string): string | null {
	const value = raw.trim();
	if (!value) return null;
	const withScheme = /^[a-z][a-z0-9+.-]*:/i.test(value)
		? value
		: `https://${value}`;
	try {
		const url = new URL(withScheme);
		return ["http:", "https:", "mailto:"].includes(url.protocol)
			? url.href
			: null;
	} catch {
		return null;
	}
}

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
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise<HTMLImageElement>((resolve, reject) => {
			const el = new Image();
			el.onload = () => resolve(el);
			el.onerror = () => reject(new Error("Could not read that image."));
			el.src = url;
		});
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

const btn =
	"rounded border border-[var(--tb-line)] px-3 py-1.5 text-sm transition-colors hover:border-[var(--tb-accent)] hover:text-[var(--tb-accent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tb-accent)]";
const btnPrimary =
	"rounded bg-[var(--tb-accent)] px-3 py-1.5 text-sm font-bold text-[var(--tb-accent-fg)] transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tb-accent)]";
const field =
	"w-full rounded border border-[var(--tb-line)] bg-transparent px-2.5 py-1.5 text-sm text-[var(--tb-fg)] placeholder:text-[var(--tb-muted)] focus-visible:outline-2 focus-visible:outline-[var(--tb-accent)]";

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
	const [error, setError] = useState("");
	const [busy, setBusy] = useState(false);

	async function onFile(file: File | undefined) {
		if (!file) return;
		setError("");
		setBusy(true);
		try {
			setShot(await fileToShot(file));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Could not add that image.");
		} finally {
			setBusy(false);
		}
	}

	function submit(e: FormEvent) {
		e.preventDefault();
		if (!title.trim()) return;
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
				required
				autoFocus
			/>
			<input
				className={field}
				placeholder="Label, e.g. Homepage (optional)"
				value={label}
				onChange={(e) => setLabel(e.target.value)}
				aria-label="Label"
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
			/>
			<input
				className={field}
				placeholder="Link (optional)"
				value={link}
				onChange={(e) => setLink(e.target.value)}
				aria-label="Link"
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
				{busy && <span className="text-xs">Processing image…</span>}
				{error && (
					<span role="alert" className="text-xs text-red-600">
						{error}
					</span>
				)}
			</div>
			<div className="flex gap-2">
				<button type="submit" className={btnPrimary} disabled={busy}>
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
	onPreview,
	onDragStart,
	onDropBefore,
}: {
	item: Item;
	onEdit: () => void;
	onDelete: () => void;
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
	useEffect(() => {
		const saved = readSaved();
		if (saved) {
			setTitle(saved.title);
			setClient(saved.client);
			setItems(saved.items);
		}
		setLoaded(true);
	}, []);

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
				i.shot,
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
		setMessage({ ok: true, text: "CSV exported." });
	}

	async function importCsv(file: File | undefined) {
		if (!file) return;
		try {
			const rows = parseCsv(await file.text());
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

			let boardTitle = "";
			let clientName = "";
			const imported: Item[] = [];
			for (const r of rows.slice(1)) {
				// No "type" column (or a blank cell) means a plain task.
				const type = get(r, "type").toLowerCase() || "task";
				const text = unguardCell(get(r, "title"));
				if (type === "board") {
					boardTitle = text;
					continue;
				}
				if (type === "client") {
					clientName = text;
					continue;
				}
				if ((type !== "task" && type !== "note") || !text) continue;
				const shot = get(r, "screenshot");
				imported.push({
					id: newId(),
					kind: type,
					status: type === "task" ? statusFromText(get(r, "status")) : "todo",
					title: text,
					label: unguardCell(get(r, "label")),
					details: unguardCell(get(r, "details")),
					link: unguardCell(get(r, "link")),
					// Only accept inline images we could have produced ourselves.
					shot: /^data:image\/(jpeg|png|webp|gif);base64,/i.test(shot)
						? shot
						: "",
				});
			}
			if (
				items.length > 0 &&
				!window.confirm(
					"Importing replaces everything currently on the board. Continue?",
				)
			) {
				return;
			}
			setItems(imported);
			if (boardTitle) setTitle(boardTitle);
			setClient(clientName);
			setAdding(null);
			setEditingId(null);
			setMessage({
				ok: true,
				text: `Imported ${imported.length} item${imported.length === 1 ? "" : "s"}.`,
			});
		} catch (e) {
			setMessage({
				ok: false,
				text: e instanceof Error ? e.message : "Could not read that CSV.",
			});
		}
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
							updateItem(item.id, v);
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
		<main className="tb-root mx-auto flex min-h-dvh w-full max-w-[1400px] flex-col gap-8 px-4 pb-16 pt-32 md:px-8">
			{/* Header + toolbar */}
			<header className="tb-head flex flex-col gap-4">
				<p className="hidden text-sm font-bold uppercase tracking-widest text-[var(--tb-muted)] print:block">
					Greencrown Studio
				</p>
				<input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					aria-label="Board title"
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
					<button type="button" className={btnPrimary} onClick={exportCsv}>
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
					<button type="button" className={btn} onClick={() => window.print()}>
						Save as PDF
					</button>
					<button type="button" className={btn} onClick={clearBoard}>
						Clear board
					</button>
					{message && (
						<span
							role="status"
							className={`text-sm font-bold ${message.ok ? "text-green-700" : "text-red-600"}`}
						>
							{message.text}
						</span>
					)}
				</div>
				<p className="max-w-[70ch] text-[15px] leading-relaxed text-[var(--tb-muted)] print:hidden">
					Your board saves automatically in this browser, so a refresh
					won&apos;t lose it — but it isn&apos;t shared, so other people and
					devices won&apos;t see it. Export a CSV to send it on or keep a
					backup, and import one to load it. Choose &ldquo;Save as PDF&rdquo; in
					the print dialog for a shareable visual. Screenshots are compressed so
					they fit in a spreadsheet cell.
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
