// WordPress care plans shown as cards (CarePlanCards) and confirmed on the
// "Plan your website" page. Figures match the "greencrown studio – Care
// Plans" PDF, with ad-hoc work at £60/hour.

export type CarePlan = {
	/** Used in links: /plan-your-website?plan=<slug> */
	slug: string;
	name: string;
	price: string;
	priceNote: string;
	features: string[];
	featured?: boolean;
	/** Card colour: lime when featured; otherwise light grey or white. */
	grey?: boolean;
	cta: string;
};

export const CARE_PLANS: CarePlan[] = [
	{
		slug: "care",
		grey: true,
		name: "Care",
		price: "£60",
		priceNote: "per month",
		features: [
			"Hosting, weekly backups and security updates",
			"Plugin updates kept on top of",
			"Restored from backup if it breaks or is hacked",
			"1 hour of changes a month",
		],
		cta: "Get started",
	},
	{
		slug: "growth",
		name: "Growth",
		price: "£240",
		priceNote: "per month",
		features: [
			"Everything in Care",
			"7 hours a month",
			"Design changes and new features",
			"SEO content to help customers find you",
		],
		featured: true,
		cta: "Get started",
	},
	{
		slug: "pro",
		grey: true,
		name: "Pro",
		price: "£450",
		priceNote: "per month",
		features: [
			"Everything in Growth",
			"14 hours a month",
			"Priority turnaround, within 2 working days",
			"A monthly check-in call",
		],
		cta: "Get started",
	},
	{
		slug: "tailored",
		name: "Tailored",
		price: "Let's talk",
		priceNote: "",
		features: [
			"Custom-built sites and other platforms",
			"Moving off Wix, Squarespace or Ionos",
			"Larger builds, content or SEO programmes",
			"A plan shaped to what you need",
		],
		cta: "Talk to us",
	},
];

export const getCarePlan = (slug: string | undefined) =>
	CARE_PLANS.find((plan) => plan.slug === slug);
