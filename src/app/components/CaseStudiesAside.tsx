import Image from "next/image";
import Link from "next/link";
import { getAllCaseStudies } from "../lib/caseStudies";

// Bright Bee suits the redesign / "move off a website builder" visitor;
// Marnie Therapy suits the new-website one (logo and site from scratch).
const DEFAULT_FEATURED = ["bright-bee-accounting", "marnie-therapy"];

// Two case studies as supporting proof on the booking pages. An <aside>:
// related to, but not part of, the page's main task (booking a call).
export default function CaseStudiesAside({
	featured = DEFAULT_FEATURED,
	className = "",
}: {
	featured?: string[];
	className?: string;
}) {
	const caseStudies = getAllCaseStudies().filter((study) =>
		featured.includes(study.slug),
	);

	return (
		<aside className={className} aria-labelledby="work-heading">
			<h2 id="work-heading" className="mb-6 text-2xl font-bold">
				Recent work
			</h2>
			<div className="grid gap-8 sm:grid-cols-2">
				{caseStudies.map((study) => (
					<Link
						key={study.slug}
						href={`/case-studies/${study.slug}`}
						className="group flex flex-col overflow-hidden rounded-2xl bg-white text-[#120d0d] no-underline transition-transform duration-300 hover:-translate-y-1"
					>
						<div className="relative aspect-[4/3] w-full overflow-hidden">
							<Image
								src={study.image}
								alt={study.imageAlt}
								fill
								sizes="(max-width: 640px) 100vw, 540px"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div className="flex flex-1 flex-col gap-2 p-5">
							<h3 className="text-lg font-bold">{study.title}</h3>
							<p className="flex-1 text-sm opacity-80">{study.summary}</p>
						</div>
					</Link>
				))}
			</div>
		</aside>
	);
}
