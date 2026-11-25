// Single source of truth for the studio's social profiles. Every
// SocialLinks instance (hero, sticky header, footer, contact page) reads
// from here, so a handle only ever needs changing in one place.
export const SOCIAL_LINKS = [
	{
		id: "instagram",
		label: "Instagram",
		href: "https://www.instagram.com/greencrownstudio",
	},
	{
		id: "linkedin",
		label: "LinkedIn",
		href: "https://www.linkedin.com/company/greencrown-studio",
	},
	{
		id: "facebook",
		label: "Facebook",
		href: "https://www.facebook.com/greencrownstudio",
	},
] as const;

export type SocialId = (typeof SOCIAL_LINKS)[number]["id"];
