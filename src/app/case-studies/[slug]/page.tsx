import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackHomeLink from "../../components/BackHomeLink";
import PageBlog from "../../components/PageBlog";
import BlogSection from "../../components/BlogSection";
import CtaButton from "../../components/CtaButton";
import { getAllCaseStudies, getCaseStudyBySlug } from "../../lib/caseStudies";

const SITE_URL = "https://www.greencrown.studio";

export function generateStaticParams() {
	return getAllCaseStudies().map((study) => ({ slug: study.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const study = getCaseStudyBySlug(slug);
	if (!study) return {};

	const url = `${SITE_URL}/case-studies/${study.slug}`;

	return {
		title: `${study.title} — Case Study | Greencrown Studio`,
		description: study.summary,
		alternates: { canonical: url },
		openGraph: {
			title: study.title,
			description: study.summary,
			url,
			type: "article",
			images: [`${SITE_URL}${study.image}`],
		},
	};
}

export default async function CaseStudyPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const study = getCaseStudyBySlug(slug);
	if (!study) notFound();

	const structuredData = {
		"@context": "https://schema.org",
		"@type": "CreativeWork",
		name: study.title,
		description: study.summary,
		image: `${SITE_URL}${study.image}`,
		creator: { "@type": "Organization", name: "Greencrown Studio" },
		mainEntityOfPage: `${SITE_URL}/case-studies/${study.slug}`,
	};

	return (
		<>
			<BackHomeLink />
			<PageBlog>
				<article className="font-light">
					<header className="content-container mb-8">
						<p className="mb-4">
							<Link href="/case-studies" className="text-sm underline">
								&larr; Back to case studies
							</Link>
						</p>
						{/* <p className="mb-2 text-sm tracking-wide uppercase text-white/60">
							{study.category}
						</p> */}
						<h1 className="text-3xl font-bold mb-4">{study.title}</h1>
						<p className="mb-6 max-w-2xl body-text">{study.summary}</p>
						<CtaButton
							href={study.liveUrl}
							target="_blank"
							rel="noopener noreferrer"
						>
							Visit live site
						</CtaButton>
					</header>

					<div className="content-container mb-4">
						<div className="relative aspect-[16/9] w-full overflow-hidden rounded">
							<Image
								src={study.image}
								alt={study.imageAlt}
								fill
								sizes="(max-width: 768px) 100vw, 768px"
								className="object-cover"
								priority
							/>
						</div>
					</div>

					{study.blocks.map((block, index) =>
						block.kind === "section" ? (
							<BlogSection
								key={index}
								variant={block.variant}
								html={block.html}
							/>
						) : (
							<div
								key={index}
								className="blog-prose w-full px-6 md:px-8"
								dangerouslySetInnerHTML={{ __html: block.html }}
							/>
						),
					)}

					<p className="content-container mt-6 body-text">
						<CtaButton href="/case-studies">See more case studies</CtaButton>
					</p>
				</article>
				<script
					type="application/ld+json"
					dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
				/>
			</PageBlog>
		</>
	);
}
