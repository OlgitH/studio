// Minimal RFC 4180 CSV reader/writer — handles quoted fields, embedded
// commas/newlines, doubled quotes and a UTF-8 BOM (Excel adds one).

export function toCsv(rows: string[][]): string {
	return rows
		.map((row) =>
			row
				.map((cell) =>
					/[",\r\n]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell,
				)
				.join(","),
		)
		.join("\r\n");
}

// Excel in many locales saves "CSV" with semicolons (or tabs) instead of
// commas. Sniff the header line so those files still import.
function detectDelimiter(text: string): string {
	const firstLine = text.split(/\r?\n/, 1)[0] ?? "";
	let best = ",";
	let bestCount = 0;
	for (const d of [",", ";", "\t"]) {
		const count = firstLine.split(d).length - 1;
		if (count > bestCount) {
			best = d;
			bestCount = count;
		}
	}
	return best;
}

export function parseCsv(input: string): string[][] {
	const text = input.replace(/^\uFEFF/, "");
	const delimiter = detectDelimiter(text);
	const rows: string[][] = [];
	let row: string[] = [];
	let cell = "";
	let inQuotes = false;

	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (inQuotes) {
			if (ch === '"') {
				if (text[i + 1] === '"') {
					cell += '"';
					i++;
				} else {
					inQuotes = false;
				}
			} else {
				cell += ch;
			}
		} else if (ch === '"') {
			inQuotes = true;
		} else if (ch === delimiter) {
			row.push(cell);
			cell = "";
		} else if (ch === "\n" || ch === "\r") {
			if (ch === "\r" && text[i + 1] === "\n") i++;
			row.push(cell);
			rows.push(row);
			row = [];
			cell = "";
		} else {
			cell += ch;
		}
	}
	if (cell !== "" || row.length > 0) {
		row.push(cell);
		rows.push(row);
	}
	// Drop fully blank lines (spreadsheets often append them).
	return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

// Spreadsheet apps execute cells that start with = + @ as formulas. Prefix
// them with an apostrophe on export and strip it again on import.
export function guardCell(value: string): string {
	return /^[=+@\t\r]/.test(value) ? `'${value}` : value;
}

export function unguardCell(value: string): string {
	return /^'[=+@\t\r]/.test(value) ? value.slice(1) : value;
}
