// Passphrase protection for share links, using the browser's built-in Web
// Crypto: PBKDF2 (SHA-256) stretches the passphrase into an AES-256-GCM key.
// GCM is authenticated, so a wrong passphrase (or a tampered/cut-off link)
// fails to decrypt rather than producing garbage. Nothing leaves the browser.

const SALT_BYTES = 16;
const IV_BYTES = 12;
const ITERATIONS = 600_000; // OWASP's current guidance for PBKDF2-SHA256

export const MIN_PASSPHRASE_LENGTH = 8;

async function deriveKey(passphrase: string, salt: Uint8Array) {
	const material = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(passphrase),
		"PBKDF2",
		false,
		["deriveKey"],
	);
	return crypto.subtle.deriveKey(
		{
			name: "PBKDF2",
			salt: salt as BufferSource,
			iterations: ITERATIONS,
			hash: "SHA-256",
		},
		material,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"],
	);
}

// Output layout: salt (16) | iv (12) | ciphertext+tag
export async function encryptBytes(
	plain: Uint8Array,
	passphrase: string,
): Promise<Uint8Array> {
	const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
	const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
	const key = await deriveKey(passphrase, salt);
	const cipher = new Uint8Array(
		await crypto.subtle.encrypt(
			{ name: "AES-GCM", iv: iv as BufferSource },
			key,
			plain as BufferSource,
		),
	);
	const out = new Uint8Array(SALT_BYTES + IV_BYTES + cipher.length);
	out.set(salt, 0);
	out.set(iv, SALT_BYTES);
	out.set(cipher, SALT_BYTES + IV_BYTES);
	return out;
}

// Throws if the passphrase is wrong or the data was altered.
export async function decryptBytes(
	packed: Uint8Array,
	passphrase: string,
): Promise<Uint8Array> {
	if (packed.length < SALT_BYTES + IV_BYTES + 16) throw new Error("too short");
	const salt = packed.slice(0, SALT_BYTES);
	const iv = packed.slice(SALT_BYTES, SALT_BYTES + IV_BYTES);
	const cipher = packed.slice(SALT_BYTES + IV_BYTES);
	const key = await deriveKey(passphrase, salt);
	return new Uint8Array(
		await crypto.subtle.decrypt(
			{ name: "AES-GCM", iv: iv as BufferSource },
			key,
			cipher as BufferSource,
		),
	);
}

// Easy to read out over the phone: no 0/O, 1/l/I. 12 characters from a
// 31-letter alphabet is ~59 bits — plenty against guessing.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

export function generatePassphrase(): string {
	// Rejection sampling avoids modulo bias.
	const limit = 256 - (256 % ALPHABET.length);
	let out = "";
	while (out.length < 12) {
		for (const b of crypto.getRandomValues(new Uint8Array(24))) {
			if (b < limit && out.length < 12) out += ALPHABET[b % ALPHABET.length];
		}
	}
	return `${out.slice(0, 4)}-${out.slice(4, 8)}-${out.slice(8, 12)}`;
}
