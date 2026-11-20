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

// Spreadsheet apps (Excel, Sheets, LibreOffice) run a cell as a formula when it
// starts with = + - or @ (a leading tab/CR, or spaces before one of those,
// can also fool them). A booby-trapped CSV can use that to run commands or
// pull data out when someone opens it — this is the "CSV injection" attack, and
// it works on anyone who opens the file, whatever site made it. So on export,
// any such cell is prefixed with an apostrophe, which makes spreadsheets treat
// it as plain text; on import the apostrophe is stripped again.
const FORMULA_START = /^(?:\s*[=+\-@]|[\t\r])/;

export function guardCell(value: string): string {
	return FORMULA_START.test(value) ? `'${value}` : value;
}

export function unguardCell(value: string): string {
	return value.startsWith("'") && FORMULA_START.test(value.slice(1))
		? value.slice(1)
		: value;
}
