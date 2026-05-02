import Link from "next/link";
import BackHomeLink from "../components/BackHomeLink";

export default function AboutPage() {
	return (
		<>
			<BackHomeLink />
			<main className="mx-auto flex min-h-dvh max-w-4xl flex-col justify-end overflow-hidden p-6 pb-8 pt-24 md:min-h-0 md:justify-start md:overflow-visible md:p-8">
				<h1 className="text-3xl font-bold mb-4">About</h1>
				<p className="mb-8 max-w-2xl font-light">
					Greencrown Studio is can be your personalised creative department. We like to work with small to medium companies, or individuals, from all industries - including artists, architects, engineering and manufacturing.  We can help you simplify your tech and make it work for you, instead of bringing noise and headaches. 

                    <Link href="https://www.oliverberman.net" className="underline" target="_blank" rel="noopener noreferrer">Oliver Berman</Link> is the founder of Greencrown Studio. He has a background in web development and design, working mainly in universities. Whilst designing and building websites and brands is part of what we do, what excites us most is visualising and bringing meaning to data, and working out ways to make it more engaging and accessible. 
				</p>

			</main>
		</>
	);
}
