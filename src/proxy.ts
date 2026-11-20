import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

// Password gate for the private tools (/tools and everything under it).
//
// Uses HTTP Basic Auth: the browser shows its own username/password prompt,
// and the server refuses to send the page at all without the right
// credentials — so this is real protection, not just a hidden link.
//
// Credentials come from two environment variables (set them in Vercel under
// Project → Settings → Environment Variables, then redeploy; locally they live
// in .env.local, which is not committed):
//   TOOLS_USER      the username
//   TOOLS_PASSWORD  the password — make it long and random
//
// If either is missing the tools stay CLOSED (503) rather than open, so a
// forgotten setting can never expose them.

const PRIVATE_HEADERS = {
	"Cache-Control": "private, no-store",
	"X-Robots-Tag": "noindex, nofollow, noarchive",
};

// Compare without leaking, through timing, how much of a guess was right.
// Hashing first makes both sides the same length, which timingSafeEqual needs.
const digest = (value: string) => createHash("sha256").update(value).digest();
const matches = (given: string, expected: string) =>
	timingSafeEqual(digest(given), digest(expected));

export function proxy(request: NextRequest) {
	const user = process.env.TOOLS_USER;
	const password = process.env.TOOLS_PASSWORD;

	if (!user || !password) {
		return new NextResponse("These tools are not available right now.", {
			status: 503,
			headers: PRIVATE_HEADERS,
		});
	}

	const header = request.headers.get("authorization") ?? "";
	if (header.startsWith("Basic ")) {
		const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
		const split = decoded.indexOf(":");
		if (split !== -1) {
			// `&` (not `&&`) so both checks always run.
			const ok =
				Number(matches(decoded.slice(0, split), user)) &
				Number(matches(decoded.slice(split + 1), password));
			if (ok) {
				const response = NextResponse.next();
				for (const [key, value] of Object.entries(PRIVATE_HEADERS)) {
					response.headers.set(key, value);
				}
				return response;
			}
		}
	}

	return new NextResponse("Authentication required.", {
		status: 401,
		headers: {
			...PRIVATE_HEADERS,
			"WWW-Authenticate": 'Basic realm="Greencrown tools", charset="UTF-8"',
		},
	});
}

export const config = {
	matcher: ["/tools", "/tools/:path*"],
};
