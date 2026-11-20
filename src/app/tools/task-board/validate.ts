// Everything that comes in from outside the page — a CSV, a share link,
// saved browser storage, an uploaded image — goes through these checks.
// The page never renders untrusted HTML (React escapes all text), so this is
// about keeping the data well-formed and bounded, and about never trusting a
// file's name or claimed type.

export const LIMITS = {
	csvBytes: 10 * 1024 * 1024, // largest CSV we'll read
	imageBytes: 15 * 1024 * 1024, // largest image file we'll read
	imagePixels: 40_000_000, // ~40 megapixels; stops decompression bombs
	items: 1000,
	boardTitle: 200,
	client: 200,
	label: 100,
	title: 500,
	details: 5000,
	link: 2000,
	shotChars: 40_000, // our own compressor aims for <= 30,000
	decompressedBytes: 2 * 1024 * 1024, // cap on an unpacked share link
} as const;

export const clip = (value: unknown, max: number): string =>
	typeof value === "string" ? value.slice(0, max) : "";

// Strip control characters (except tab/newline) that have no business in text.
const CONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
export const cleanText = (value: unknown, max: number): string =>
	clip(value, max).replace(CONTROL, "");

// Screenshots are only ever shown in an <img>, so scripts can't run from
// them — but we still only accept the raster data URLs our own compressor
// produces, in strict base64, within a size limit. SVG (which can carry
// script) and every other type is dropped.
const SHOT = /^data:image\/(?:jpeg|png|webp|gif);base64,[A-Za-z0-9+/]+={0,2}$/;
export const safeShot = (value: unknown): string =>
	typeof value === "string" &&
	value.length <= LIMITS.shotChars &&
	SHOT.test(value)
		? value
		: "";

// Returns a message if the file shouldn't be used as a screenshot.
// Name and extension are ignored — only the browser-detected type counts —
// and the real test is that it actually decodes as a raster image (see
// fileToShot, which also re-encodes it, discarding anything embedded).
export function imageFileProblem(file: File): string | null {
	if (file.size > LIMITS.imageBytes)
		return "That image is too large (15 MB max).";
	if (!/^image\/(jpeg|png|webp|gif|bmp|avif|heic|heif)$/i.test(file.type))
		return "Please choose a JPEG, PNG, WebP or GIF image.";
	return null;
}

// Only ever render http(s)/mailto links — imported CSVs are untrusted input
// and a `javascript:` URL in the link column must not become a clickable href.
export function safeHref(raw: string): string | null {
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
