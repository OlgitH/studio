import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BackHomeLink from "../../components/BackHomeLink";
import PageBlog from "../../components/PageBlog";
import BlogSection from "../../components/BlogSection";
import CtaButton from "../../components/CtaButton";
import { getAllPosts, getPostBySlug, formatDate } from "../../lib/posts";

const SITE_URL = "https://www.greencrown.studio";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | Greencrown Studio`,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "Greencrown Studio" },
    publisher: { "@type": "Organization", name: "Greencrown Studio" },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  };

  return (
    <>
      <BackHomeLink />
      <PageBlog>
        <article className="font-light">
          <header className="content-container mb-4">
            <p className="mb-4">
              <Link href="/blog" className="text-sm underline">
                &larr; Back to blog
              </Link>
            </p>
            <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
            <p className="text-sm text-white/60">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {" · "}
              {post.readingTime}
            </p>
          </header>

          {post.blocks.map((block, index) =>
            block.kind === "section" ? (
              <BlogSection key={index} variant={block.variant} html={block.html} />
            ) : (
              // Not wrapped in a named section: spans full width with no
              // centred container, by design — a visible nudge to wrap
              // ordinary body copy in a ::: standard ::: block instead.
              <div
                key={index}
                className="blog-prose w-full px-6 md:px-8"
                dangerouslySetInnerHTML={{ __html: block.html }}
              />
            ),
          )}

          <p className="content-container mt-6 body-text">
            <CtaButton href="/contact">
              Talk to us about your website
            </CtaButton>
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
