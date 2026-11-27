"use client";

import { useSyncExternalStore } from "react";

// How many pixels at the bottom of the layout viewport are currently hidden
// from view, e.g. behind a mobile browser's toolbar.
//
// position: fixed; bottom: 0 is measured from the layout viewport, which on
// iPhone browsers isn't always what's visible: Chrome on iOS overlays its
// bottom toolbar on the page, and Safari animates its toolbars in and out as
// you scroll. The Visual Viewport API reports the area actually on screen,
// so lifting a bottom-pinned element by this amount keeps it visible on
// every browser. It's 0 on desktop and wherever the two already match.
function getInset() {
	const vv = window.visualViewport;
	if (!vv) return 0;
	const hidden = window.innerHeight - (vv.height + vv.offsetTop);
	return Math.max(0, Math.round(hidden));
}

function subscribe(onChange: () => void) {
	const vv = window.visualViewport;
	vv?.addEventListener("resize", onChange);
	vv?.addEventListener("scroll", onChange);
	window.addEventListener("resize", onChange);
	window.addEventListener("scroll", onChange, { passive: true });
	return () => {
		vv?.removeEventListener("resize", onChange);
		vv?.removeEventListener("scroll", onChange);
		window.removeEventListener("resize", onChange);
		window.removeEventListener("scroll", onChange);
	};
}

export function useVisibleBottomInset() {
	return useSyncExternalStore(subscribe, getInset, () => 0);
}
