import type { SectionVariant } from "../lib/posts";
import ContentSection from "./ContentSection";

// Renders one ::: standard | white | lime ... ::: block from a blog post's
// markdown (parsed in src/app/lib/posts.ts) inside the shared ContentSection
// band.
export default function BlogSection({
	variant,
	html,
}: {
	variant: SectionVariant;
	html: string;
}) {
	const proseClassName =
		variant === "standard" ? "blog-prose" : "blog-prose blog-prose--on-light";

	return (
		<ContentSection variant={variant}>
			<div
				className={proseClassName}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</ContentSection>
	);
}
