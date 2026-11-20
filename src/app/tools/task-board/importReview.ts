// Works out what a CSV that's about to be imported contains, so the person
// can review it and approve it first. Pure functions: no DOM, no storage.
//
// A file can't be cryptographically "verified" here — there are no accounts or
// server, and any signature would break the moment a client edits the CSV in a
// spreadsheet, which is the whole workflow. So this is about showing what's
// inside (where it claims to come from, what it contains, where its links go,
// whether it holds anything sensitive) and making the person decide.

import { scanBoard, type BoardIssue } from "./sensitive";
import { safeHref } from "./validate";

export type ReviewItem = {
	kind: "task" | "note";
	status: "todo" | "doing" | "done";
	title: string;
	label: string;
	details: string;
	link: string;
	shot: string;
};

export type LinkInfo = { host: string; count: number; flags: string[] };

export type ImportReview = {
	source: "file" | "link"; // a CSV file, or a share link someone sent
	protectedLink: boolean; // (link) it was passphrase-protected and unlocked
	fileName: string;
	fileSize: number;
	fileModified: number;
	fromTool: boolean; // has this tool's header and an "exported" stamp
	exportedAt: string;
	title: string;
	client: string;
	skipped: number; // rows that weren't usable (or past the item limit)
	counts: {
		todo: number;
		doing: number;
		done: number;
		notes: number;
		labels: number;
		shots: number;
	};
	links: LinkInfo[]; // clickable links, grouped by destination
	textOnlyLinks: number; // present but not a safe web/email link
	issues: BoardIssue[]; // sensitive-looking content, by card
	currentItems: number; // what the import would replace
};

export const EXPECTED_HEADER = [
	"type",
	"status",
	"label",
	"title",
	"details",
	"link",
	"screenshot",
];

// "2026-11-20 12:51" — the stamp this tool writes when exporting.
const STAMP = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

export function looksExportedByThisTool(
	header: string[],
	exportedAt: string,
): boolean {
	const h = header.map((x) => x.trim().toLowerCase());
	return (
		h.length === EXPECTED_HEADER.length &&
		EXPECTED_HEADER.every((c, i) => h[i] === c) &&
		STAMP.test(exportedAt)
	);
}

// Services that hide where a link really goes.
const SHORTENERS = new Set([
	"bit.ly",
	"tinyurl.com",
	"t.co",
	"goo.gl",
	"ow.ly",
	"is.gd",
	"buff.ly",
	"rebrand.ly",
	"cutt.ly",
	"shorturl.at",
	"tiny.cc",
	"rb.gy",
	"lnkd.in",
	"s.id",
]);

function hostFlags(url: URL): string[] {
	const flags: string[] = [];
	const host = url.hostname.toLowerCase();
	if (url.protocol === "http:") flags.push("not encrypted (http)");
	if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host) || host.startsWith("["))
		flags.push("a raw IP address");
	if (host.split(".").some((part) => part.startsWith("xn--")))
		flags.push("look-alike (non-English) characters");
	if (SHORTENERS.has(host.replace(/^www\./, "")))
		flags.push("a link shortener — hides the real address");
	if (url.username || url.password)
		flags.push("has a username or password in it");
	return flags;
}

// Looks at one link the way a careful person would: where does it really go,
// and is anything about it unusual?
export function inspectLink(
	raw: string,
): { href: string; host: string; flags: string[] } | null {
	const href = safeHref(raw);
	if (!href) return null;
	const url = new URL(href);
	if (url.protocol === "mailto:") {
		return {
			href,
			host: `email: ${url.pathname.split("@")[1] ?? url.pathname}`,
			flags: [],
		};
	}
	return {
		href,
		host: url.hostname.replace(/^www\./, ""),
		flags: hostFlags(url),
	};
}

export function reviewLinks(links: string[]): {
	links: LinkInfo[];
	textOnly: number;
} {
	const byHost = new Map<string, LinkInfo>();
	let textOnly = 0;
	for (const raw of links) {
		if (!raw.trim()) continue;
		const info = inspectLink(raw);
		if (!info) {
			textOnly++;
			continue;
		}
		const { host, flags } = info;
		const existing = byHost.get(host);
		if (existing) {
			existing.count++;
			for (const f of flags)
				if (!existing.flags.includes(f)) existing.flags.push(f);
		} else {
			byHost.set(host, { host, count: 1, flags });
		}
	}
	// Flagged destinations first, then busiest.
	const list = [...byHost.values()].sort(
		(a, b) => b.flags.length - a.flags.length || b.count - a.count,
	);
	return { links: list, textOnly };
}

export function buildReview(input: {
	source: "file" | "link";
	protectedLink?: boolean;
	fileName?: string;
	fileSize?: number;
	fileModified?: number;
	header?: string[];
	exportedAt?: string;
	title: string;
	client: string;
	items: ReviewItem[];
	skipped: number;
	currentItems: number;
}): ImportReview {
	const { links, textOnly } = reviewLinks(input.items.map((i) => i.link));
	const tasks = input.items.filter((i) => i.kind === "task");
	return {
		source: input.source,
		protectedLink: input.protectedLink ?? false,
		fileName: input.fileName ?? "",
		fileSize: input.fileSize ?? 0,
		fileModified: input.fileModified ?? 0,
		fromTool:
			input.source === "file" &&
			looksExportedByThisTool(input.header ?? [], input.exportedAt ?? ""),
		exportedAt: input.exportedAt ?? "",
		title: input.title,
		client: input.client,
		skipped: input.skipped,
		counts: {
			todo: tasks.filter((i) => i.status === "todo").length,
			doing: tasks.filter((i) => i.status === "doing").length,
			done: tasks.filter((i) => i.status === "done").length,
			notes: input.items.length - tasks.length,
			labels: new Set(input.items.map((i) => i.label).filter(Boolean)).size,
			shots: input.items.filter((i) => i.shot).length,
		},
		links,
		textOnlyLinks: textOnly,
		issues: scanBoard(input.title, input.client, input.items),
		currentItems: input.currentItems,
	};
}
