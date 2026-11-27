// Booking landing pages (the ad page and the plan call page). These hide the
// site-wide burger menu and footer so the only things to do are book, call,
// or look at the work: every other link is a way to leave without converting.
export const LANDING_PAGES = ["/free-website-review", "/plan-your-website"];

export const isLandingPage = (pathname: string) =>
	LANDING_PAGES.includes(pathname);
