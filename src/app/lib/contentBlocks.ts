import { marked } from "marked";

marked.use({ gfm: true });

// Markdown body content (blog posts, case studies) is authored as a sequence
// of ::: variant ... ::: blocks. "standard" gets a centred column with the
// page's default background; "white"/"lime"/"mauve" get a full-width
// coloured band with a centred column inside it. Anything left outside a
// fence falls through as "loose" — full width, no centred column — which
// acts as a deliberate nudge to always name a section.
export type SectionVariant = "standard" | "white" | "lime" | "mauve";

export type ContentBlock =
	| { kind: "loose"; html: string }
	| { kind: "section"; variant: SectionVariant; html: string };

const FENCE_OPEN = /^:::\s*(standard|white|lime|mauve)\s*$/;
const FENCE_CLOSE = /^:::\s*$/;

export function parseBlocks(markdown: string): ContentBlock[] {
	const lines = markdown.split("\n");
	const blocks: ContentBlock[] = [];
	let looseLines: string[] = [];

	const flushLoose = () => {
		const text = looseLines.join("\n").trim();
		if (text) blocks.push({ kind: "loose", html: marked.parse(text) as string });
		looseLines = [];
	};

	for (let i = 0; i < lines.length; i++) {
		const openMatch = lines[i].match(FENCE_OPEN);
		if (!openMatch) {
			looseLines.push(lines[i]);
			continue;
		}

		flushLoose();
		const variant = openMatch[1] as SectionVariant;
		const sectionLines: string[] = [];
		i++;
		while (i < lines.length && !FENCE_CLOSE.test(lines[i])) {
			sectionLines.push(lines[i]);
			i++;
		}
		blocks.push({
			kind: "section",
			variant,
			html: marked.parse(sectionLines.join("\n").trim()) as string,
		});
	}
	flushLoose();

	return blocks;
}

export function readingTimeFor(content: string): string {
	const words = content.trim().split(/\s+/).length;
	const minutes = Math.max(1, Math.round(words / 200));
	return `${minutes} min read`;
}
