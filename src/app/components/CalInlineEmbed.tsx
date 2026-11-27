"use client";

import { useEffect, useId } from "react";

type CalApi = ((...args: unknown[]) => void) & {
	loaded?: boolean;
	ns: Record<string, (...args: unknown[]) => void>;
	q?: unknown[];
};

type CalWindow = Window & {
	Cal?: CalApi;
	gtag?: (...args: unknown[]) => void;
};

// Cal.com's official inline-embed loader (from their embed snippet): defines
// a queueing window.Cal and injects embed.js once.
function loadCal(w: CalWindow) {
	if (w.Cal) return;
	const d = w.document;
	const push = (api: { q: unknown[] }, args: unknown) => api.q.push(args);
	const cal = function (this: unknown, ...args: unknown[]) {
		const c = w.Cal as CalApi & { q: unknown[] };
		if (!c.loaded) {
			c.ns = {};
			c.q = c.q || [];
			d.head.appendChild(d.createElement("script")).src =
				"https://app.cal.com/embed/embed.js";
			c.loaded = true;
		}
		if (args[0] === "init") {
			const api = function (...apiArgs: unknown[]) {
				push(api as unknown as { q: unknown[] }, apiArgs);
			} as unknown as ((...a: unknown[]) => void) & { q: unknown[] };
			api.q = api.q || [];
			const namespace = args[1];
			if (typeof namespace === "string") {
				c.ns[namespace] = c.ns[namespace] || api;
				push(c.ns[namespace] as unknown as { q: unknown[] }, args);
				push(c, ["initNamespace", namespace]);
			} else push(c, args);
			return;
		}
		push(c, args);
	} as unknown as CalApi;
	w.Cal = cal;
}

type CalInlineEmbedProps = {
	/** Cal.com link: "username/event-slug". */
	calLink: string;
	/** Analytics event fired when a booking completes (only sent if the
	 * visitor has accepted analytics, since gtag only exists then). */
	conversionEvent?: string;
	/** Booking form fields to fill in ahead, e.g. { notes: "..." } for
	 * Cal's default "Additional notes" field. The visitor can still edit. */
	prefill?: Record<string, string>;
	className?: string;
};

// Cal.com booking calendar rendered inline on the page. Uses the official
// embed (not a bare iframe) because it reports a completed booking, which
// we pass on to Google Analytics / Ads as a conversion.
export default function CalInlineEmbed({
	calLink,
	conversionEvent = "book_free_review",
	prefill,
	className = "",
}: CalInlineEmbedProps) {
	const elementId = `cal-inline-${useId().replace(/:/g, "")}`;
	const namespace = calLink.split("/").pop() ?? "booking";
	// Stable dependency for the effect (a new object each render otherwise).
	const prefillKey = JSON.stringify(prefill ?? {});

	useEffect(() => {
		const w = window as CalWindow;
		loadCal(w);
		const Cal = w.Cal as CalApi;
		Cal("init", namespace, { origin: "https://cal.com" });
		const api = Cal.ns[namespace];
		api("inline", {
			elementOrSelector: `#${elementId}`,
			calLink,
			config: {
				layout: "month_view",
				theme: "dark",
				...JSON.parse(prefillKey),
			},
		});
		api("ui", {
			theme: "dark",
			layout: "month_view",
			// The page's own intro covers what the call is; hiding Cal's
			// details column also keeps its layout within the page width.
			hideEventTypeDetails: true,
			cssVarsPerTheme: { dark: { "cal-brand": "#c6ff00" } },
		});
		api("on", {
			action: "bookingSuccessful",
			callback: () => w.gtag?.("event", conversionEvent),
		});
	}, [calLink, conversionEvent, elementId, namespace, prefillKey]);

	return (
		<div className={className}>
			<div id={elementId} className="min-h-[560px] w-full overflow-auto" />
			<noscript>
				<a href={`https://cal.com/${calLink}`} className="underline">
					Open the booking calendar
				</a>
			</noscript>
		</div>
	);
}
