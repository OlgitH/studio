// Spots text that looks like a secret or sensitive personal/financial data,
// so people are warned before it goes on a board (and before the board is
// shared). Runs entirely in the browser — nothing is sent anywhere — and
// never repeats the suspected value back, only what kind of thing it looks like.
//
// It can't catch everything ("the wifi code is sunshine99" has no pattern),
// so it's a safety net for common accidents, not a guarantee.

export type Finding = {
	id: string;
	// "block": almost never legitimate on a checklist — can't be saved/shared.
	// "warn": might be a false alarm — flagged, but the person can continue.
	level: "block" | "warn";
	label: string;
};

type Rule = {
	id: string;
	level: Finding["level"];
	label: string;
	test: (text: string) => boolean;
};

// Luhn checksum — what real card numbers satisfy, so random digit runs don't.
function luhn(digits: string): boolean {
	let sum = 0;
	let dbl = false;
	for (let i = digits.length - 1; i >= 0; i--) {
		let d = digits.charCodeAt(i) - 48;
		if (dbl) {
			d *= 2;
			if (d > 9) d -= 9;
		}
		sum += d;
		dbl = !dbl;
	}
	return sum % 10 === 0;
}

// Card network prefixes + lengths (Visa, Mastercard, Amex, Discover).
const CARD_SHAPES = [
	/^4\d{12}(?:\d{3}){0,2}$/,
	/^(?:5[1-5]\d{2}|222[1-9]|22[3-9]\d|2[3-6]\d{2}|27[01]\d|2720)\d{12}$/,
	/^3[47]\d{13}$/,
	/^(?:6011|65\d{2}|64[4-9]\d)\d{12}$/,
];

function hasCardNumber(text: string): boolean {
	// Digit runs of 13–19 digits, allowing single spaces or hyphens between.
	for (const m of text.matchAll(/\d(?:[ -]?\d){12,18}/g)) {
		const digits = m[0].replace(/\D/g, "");
		if (CARD_SHAPES.some((re) => re.test(digits)) && luhn(digits)) return true;
	}
	return false;
}

// IBAN mod-97 check, so only real IBAN structures match.
function validIban(raw: string): boolean {
	const iban = raw.replace(/\s/g, "").toUpperCase();
	if (iban.length < 15 || iban.length > 34) return false;
	const moved = iban.slice(4) + iban.slice(0, 4);
	let rem = 0;
	for (const ch of moved) {
		const v = /[A-Z]/.test(ch) ? String(ch.charCodeAt(0) - 55) : ch;
		for (const d of v) rem = (rem * 10 + (d.charCodeAt(0) - 48)) % 97;
	}
	return rem === 1;
}

function hasIban(text: string): boolean {
	for (const m of text.matchAll(
		/\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){2,7}(?: ?[A-Z0-9]{1,3})?\b/gi,
	)) {
		if (validIban(m[0])) return true;
	}
	return false;
}

const RULES: Rule[] = [
	{
		id: "private-key",
		level: "block",
		label: "a private key",
		test: (t) => /-----BEGIN [A-Z0-9 ]*PRIVATE KEY(?: BLOCK)?-----/.test(t),
	},
	{
		id: "card",
		level: "block",
		label: "a payment card number",
		test: hasCardNumber,
	},
	{
		id: "api-key",
		level: "warn",
		label: "an API key or access token",
		test: (t) =>
			/\b(?:sk|rk)_(?:live|test)_[A-Za-z0-9]{10,}/.test(t) || // Stripe
			/\bAKIA[0-9A-Z]{16}\b/.test(t) || // AWS
			/\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}/.test(t) ||
			/\bgithub_pat_[A-Za-z0-9_]{30,}/.test(t) ||
			/\bxox[baprs]-[A-Za-z0-9-]{10,}/.test(t) || // Slack
			/\bAIza[0-9A-Za-z_-]{35}\b/.test(t) || // Google
			/\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{6,}/.test(
				t,
			) || // JWT
			/\bBearer\s+[A-Za-z0-9._~+/-]{20,}/i.test(t),
	},
	{
		id: "password",
		level: "warn",
		label: "a password or login",
		// "password: xyz", "pwd = xyz", "pin - 1234" — a label, a separator,
		// then a value. A bare mention ("reset password page broken") passes.
		test: (t) =>
			/\b(?:pass(?:word|wd|code|phrase)?|pwd|pin|secret|login|api[ _-]?key|token)\b\s*(?:is\b|[:=]|->)\s*\S{3,}/i.test(
				t,
			),
	},
	{
		id: "credentials-url",
		level: "warn",
		label:
			"a web address or connection string with a username and password in it",
		test: (t) => /\b[a-z][a-z0-9+.-]*:\/\/[^\s/:@]+:[^\s/@]+@/i.test(t),
	},
	{
		id: "bank",
		level: "warn",
		label: "bank account details",
		test: (t) =>
			hasIban(t) ||
			// UK sort code next to an 8-digit account number (either order).
			/\b\d{2}[- ]\d{2}[- ]\d{2}\b[\s\S]{0,40}\b\d{8}\b/.test(t) ||
			/\b\d{8}\b[\s\S]{0,40}\b\d{2}[- ]\d{2}[- ]\d{2}\b/.test(t),
	},
	{
		id: "ni-number",
		level: "warn",
		label: "a National Insurance number",
		test: (t) =>
			/\b[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z]\s?\d{2}\s?\d{2}\s?\d{2}\s?[A-D]\b/i.test(
				t,
			),
	},
];

export function scanText(text: string): Finding[] {
	if (!text) return [];
	return RULES.filter((r) => r.test(text)).map(({ id, level, label }) => ({
		id,
		level,
		label,
	}));
}

// Merge findings from several fields, keeping each kind once.
export function scanFields(fields: string[]): Finding[] {
	const found = new Map<string, Finding>();
	for (const f of fields) for (const x of scanText(f)) found.set(x.id, x);
	return [...found.values()];
}

export type BoardIssue = {
	where: string; // which card (or "Board title"), shortened
	findings: Finding[];
};

export function scanBoard(
	title: string,
	client: string,
	items: { title: string; label: string; details: string; link: string }[],
): BoardIssue[] {
	const issues: BoardIssue[] = [];
	const head = scanFields([title, client]);
	if (head.length)
		issues.push({ where: "Board title / client name", findings: head });
	for (const it of items) {
		const findings = scanFields([it.title, it.label, it.details, it.link]);
		if (findings.length) {
			const name =
				it.title.length > 50 ? `${it.title.slice(0, 50)}…` : it.title;
			issues.push({ where: name || "(untitled card)", findings });
		}
	}
	return issues;
}
