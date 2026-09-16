import Image from "next/image";
import Link from "next/link";
import FadeInOnView from "./FadeInOnView";

type ServiceSplashVariant = "black" | "lime" | "white";

type ServiceSplashImage = {
	src: string;
	alt?: string;
};

type ServiceSplashProps = {
	variant: ServiceSplashVariant;
	heading: string;
	description: string;
	href: string;
	linkLabel?: string;
	image?: ServiceSplashImage;
	shapeImage?: ServiceSplashImage;
	reverse?: boolean;
};

const VARIANT_STYLES: Record<
	ServiceSplashVariant,
	{ section: string; cta: string; imageOpacity: string }
> = {
	black: {
		section: "bg-background text-foreground",
		cta: "bg-white text-black hover:bg-white",
		imageOpacity: "opacity-90",
	},
	lime: {
		section: "bg-[var(--color-highlight)] text-black",
		cta: "bg-black text-white hover:bg-white hover:text-black",
		imageOpacity: "opacity-80",
	},
	white: {
		section: "bg-white text-black",
		cta: "bg-black text-white hover:bg-[var(--color-highlight)] hover:text-black",
		imageOpacity: "opacity-90",
	},
};

// Fades the photo's edges into the section's background colour instead of a
// hard rectangular crop, so it reads as bleeding off the section.
const BLEED_MASK_IMAGE =
	"radial-gradient(ellipse 90% 90% at 100% 50%, white 45%, transparent 88%)";
const BLEED_MASK_STYLE = {
	WebkitMaskImage: BLEED_MASK_IMAGE,
	maskImage: BLEED_MASK_IMAGE,
};

export default function ServiceSplash({
	variant,
	heading,
	description,
	href,
	linkLabel = "Find out more",
	image,
	shapeImage,
	reverse = false,
}: ServiceSplashProps) {
	const styles = VARIANT_STYLES[variant];

	return (
		<section
			className={`relative flex w-full items-center overflow-hidden py-20 md:py-28 ${styles.section}`}
		>
			{image && (
				<div
					className="pointer-events-none absolute inset-y-0 right-0 w-full overflow-hidden md:w-4/5 xl:w-3/5"
					style={BLEED_MASK_STYLE}
					aria-hidden="true"
				>
					<div
						className={`splash-bg-motion absolute inset-0 ${styles.imageOpacity}`}
					>
						<Image
							src={image.src}
							alt={image.alt ?? ""}
							fill
							quality={60}
							sizes="(max-width: 768px) 100vw, 50vw"
							className="object-cover"
						/>
					</div>
				</div>
			)}
			<FadeInOnView className="relative z-10 mx-auto flex w-full flex-col items-center gap-8 p-[20px] md:flex-row md:items-center md:justify-between xl:w-[1080px]">
				{shapeImage && (
					<div
						className={`w-full max-w-[240px] md:w-2/5 md:max-w-none ${reverse ? "md:order-1" : "md:order-2"}`}
					>
						<Image
							src={shapeImage.src}
							alt={shapeImage.alt ?? ""}
							width={505}
							height={492}
							className="h-auto w-full"
						/>
					</div>
				)}
				<div
					className={`flex w-full flex-col items-start gap-4 md:flex-1 ${reverse ? "md:order-2" : "md:order-1"}`}
				>
					<h2 className="text-2xl font-bold sm:text-2xl">{heading}</h2>
					<p className="max-w-[50ch] text-lg font-light">{description}</p>
					<Link
						href={href}
						className={`mt-4 inline-block rounded-full px-6 py-2 font-bold no-underline transition-colors ${styles.cta}`}
					>
						{linkLabel}
					</Link>
				</div>
			</FadeInOnView>
		</section>
	);
}
