import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";

export default function AboutPage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-end overflow-hidden p-6 pb-8 pt-24 md:min-h-0 md:justify-start md:overflow-visible md:p-8">
				<h1 className="text-3xl font-bold mb-4">About</h1>
				<p className="mb-8 max-w-2xl">
					Greencrown Studio favours human interaction and values this over pure automation. We would much rather meet in person. Whilst understanding the need for AI, we try to make it work for us, not the other way around.

                    <Link href="https://www.oliverberman.net">Oliver Berman</Link> is the founder of Greencrown Studio. He has a background web development and design, working mainly in universities. Whilst designing and building websites and brands is part of what we do, what excites us most is visualising and bringing meaning to data, and working out ways to make it more engaging and accessible. 
				</p>

			</main>
		</>
	);
}
