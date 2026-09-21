import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

marked.use({ gfm: true });

const POSTS_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: string;
};

// A post's body is authored as a sequence of ::: variant ... ::: blocks
// (see parseBlocks below). "standard" gets a centred column with the
// page's default background; "white"/"lime"/"mauve" get a full-width
// coloured band with a centred column inside it. Anything left outside a
// fence falls through as "loose" — full width, no centred container —
// which acts as a deliberate nudge to always name a section.
export type SectionVariant = "standard" | "white" | "lime" | "mauve";

export type ContentBlock =
  | { kind: "loose"; html: string }
  | { kind: "section"; variant: SectionVariant; html: string };

export type Post = PostMeta & { blocks: ContentBlock[] };

const FENCE_OPEN = /^:::\s*(standard|white|lime|mauve)\s*$/;
const FENCE_CLOSE = /^:::\s*$/;

function parseBlocks(markdown: string): ContentBlock[] {
  const lines = markdown.split("\n");
  const blocks: ContentBlock[] = [];
  let looseLines: string[] = [];

  const flushLoose = () => {
    const text = looseLines.join("\n").trim();
    if (text) blocks.push({ kind: "loose", html: marked.parse(text) as string });
    looseLines = [];
  };

  for (let i = 0; i < lines.length; i++) {
    const openMatch = lines[i].match(FENCE_OPEN);
    if (!openMatch) {
      looseLines.push(lines[i]);
      continue;
    }

    flushLoose();
    const variant = openMatch[1] as SectionVariant;
    const sectionLines: string[] = [];
    i++;
    while (i < lines.length && !FENCE_CLOSE.test(lines[i])) {
      sectionLines.push(lines[i]);
      i++;
    }
    blocks.push({
      kind: "section",
      variant,
      html: marked.parse(sectionLines.join("\n").trim()) as string,
    });
  }
  flushLoose();

  return blocks;
}

function readingTimeFor(content: string): string {
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

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
