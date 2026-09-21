import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
	parseBlocks,
	readingTimeFor,
	type ContentBlock,
	type SectionVariant,
} from "./contentBlocks";

export type { ContentBlock, SectionVariant };

const POSTS_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
	slug: string;
	title: string;
	description: string;
	date: string;
	readingTime: string;
};

export type Post = PostMeta & { blocks: ContentBlock[] };

function readPostFile(slug: string): { meta: PostMeta; content: string } {
	const file = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
	const { data, content } = matter(file);

	return {
		meta: {
			slug,
			title: data.title,
			description: data.description,
			date: data.date,
			readingTime: readingTimeFor(content),
		},
		content,
	};
}

export function getAllPosts(): PostMeta[] {
	return fs
		.readdirSync(POSTS_DIR)
		.filter((file) => file.endsWith(".md"))
		.map((file) => readPostFile(file.replace(/\.md$/, "")).meta)
		.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): Post | null {
	try {
		const { meta, content } = readPostFile(slug);
		return { ...meta, blocks: parseBlocks(content) };
	} catch {
		return null;
	}
}

export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString("en-GB", {
		day: "numeric",
		month: "long",
		year: "numeric",
	});
}
