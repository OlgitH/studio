import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { parseBlocks, type ContentBlock } from "./contentBlocks";

const CASE_STUDIES_DIR = path.join(process.cwd(), "content/case-studies");

export type CaseStudyMeta = {
	slug: string;
	title: string;
	category: string;
	summary: string;
	image: string;
	imageAlt: string;
	liveUrl: string;
	date: string;
};

export type CaseStudy = CaseStudyMeta & { blocks: ContentBlock[] };

function readCaseStudyFile(slug: string): {
	meta: CaseStudyMeta;
	content: string;
} {
	const file = fs.readFileSync(
		path.join(CASE_STUDIES_DIR, `${slug}.md`),
		"utf8",
	);
	const { data, content } = matter(file);

	return {
		meta: {
			slug,
			title: data.title,
			category: data.category,
			summary: data.summary,
			image: data.image,
			imageAlt: data.imageAlt ?? data.title,
			liveUrl: data.liveUrl,
			date: data.date,
		},
		content,
	};
}

export function getAllCaseStudies(): CaseStudyMeta[] {
	return fs
		.readdirSync(CASE_STUDIES_DIR)
		.filter((file) => file.endsWith(".md"))
		.map((file) => readCaseStudyFile(file.replace(/\.md$/, "")).meta)
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCaseStudyBySlug(slug: string): CaseStudy | null {
	try {
		const { meta, content } = readCaseStudyFile(slug);
		return { ...meta, blocks: parseBlocks(content) };
	} catch {
		return null;
	}
}
