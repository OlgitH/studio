import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import PageContainer from "../components/PageContainer";
import { getAllCaseStudies } from "../lib/caseStudies";

export const metadata: Metadata = {
	title: "Case Studies — Greencrown Studio",
	description:
		"A look at recent website design and development projects from Greencrown Studio.",
};

export default function CaseStudiesPage() {
	const caseStudies = getAllCaseStudies();

	return (
		<>
			<BackHomeLink />
			<PageMain>
				<PageContainer className="font-light pb-16">
					<h1 className="text-3xl font-bold mb-4">Case studies</h1>
					<p className="mb-10 max-w-2xl text-pretty body-text">
						A selection of recent website design and development projects — from
						brand identity through to a fully custom, self-managed site.
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
									{/* <p className="text-xs tracking-wide uppercase opacity-60">
										{study.category}
									</p> */}
									<h2 className="text-lg font-bold">{study.title}</h2>
									<p className="body-text flex-1 text-sm opacity-80">
										{study.summary}
									</p>
									<span className="mt-2 inline-flex items-center gap-1 text-sm font-bold hover:underline decoration-[var(--color-highlight)] underline-offset-2 ">
										Read the case study
										<svg
											className="h-4 w-4"
											viewBox="0 0 20 20"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
											aria-hidden="true"
										>
											<path d="M7.5 5L12.5 10L7.5 15" />
										</svg>
									</span>
								</div>
							</Link>
						))}
					</div>
				</PageContainer>
			</PageMain>
		</>
	);
}
