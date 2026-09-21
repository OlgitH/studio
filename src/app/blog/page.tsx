import type { Metadata } from "next";
import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";
import PageBlog from "../components/PageBlog";
import { getAllPosts, formatDate } from "../lib/posts";

export const metadata: Metadata = {
  title: "Blog | Greencrown Studio",
  description:
    "Practical, jargon-free guides on websites, SEO and digital marketing for small businesses, from Greencrown Studio.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <BackHomeLink />
      <PageBlog>
        <section
          className="content-container font-light"
          aria-labelledby="blog-heading"
        >
          <h1 id="blog-heading" className="text-3xl font-bold mb-4">
            Blog
          </h1>
          <p className="mb-8 body-text">
            Practical, jargon-free guides on websites, SEO and digital
            marketing for small businesses.
          </p>
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug} className="border-b border-white/10 pb-6">
                <h2 className="text-xl font-bold mb-1">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="underline decoration-[var(--color-highlight)] underline-offset-2 hover:text-[var(--color-highlight)]"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="mb-2 text-sm text-white/60">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                  {" · "}
                  {post.readingTime}
                </p>
                <p className="body-text">{post.description}</p>
              </li>
            ))}
          </ul>
        </section>
      </PageBlog>
    </>
  );
}
