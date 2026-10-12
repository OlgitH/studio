import Image from "next/image";
import Link from "next/link";
import ContentSection from "./ContentSection";
import { getAllCaseStudies } from "../lib/caseStudies";

export default function HomeCaseStudies() {
	const caseStudies = getAllCaseStudies().slice(0, 3);

	return (
		<ContentSection
			variant="mauve"
			width="wide"
			className="py-20 md:py-28"
		>
			<h2 className="mb-4 text-3xl font-bold">Case studies</h2>
			<p className="mb-10 max-w-2xl text-pretty font-light">
				A look at recent websites and brands we&apos;ve designed and built for
				small businesses.
			</p>

			<div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
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
								sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
								className="object-cover transition-transform duration-500 group-hover:scale-105"
							/>
						</div>
						<div className="flex flex-1 flex-col gap-2 p-5">
							<h3 className="text-lg font-bold">{study.title}</h3>
							<p className="flex-1 text-sm font-light opacity-80">
								{study.summary}
							</p>
							<span className="mt-2 text-sm font-bold underline-offset-2 group-hover:underline">
								Read the case study &rarr;
							</span>
						</div>
					</Link>
				))}
			</div>

			<p className="mt-10">
				<Link href="/case-studies" className="font-bold underline">
					See all case studies
				</Link>
			</p>
		</ContentSection>
	);
}
