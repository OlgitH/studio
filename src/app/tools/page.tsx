import type { Metadata } from "next";
import BackHomeLink from "../components/BackHomeLink";
import PageMain from "../components/PageMain";
import CtaButton from "../components/CtaButton";
import PageBgImage from "../components/PageBgImage";
import PageContainer from "../components/PageContainer";

// Private, password-protected (see src/proxy.ts) and kept out of search.
export const metadata: Metadata = {
	title: "Tools | Greencrown Studio",
	robots: { index: false, follow: false, nocache: true },
};

export default function ToolsPage() {
	return (
		<>
			<BackHomeLink />
			<PageMain
				bgImage={
					<PageBgImage
						src="/bird-blur-3.png"
						width={2000}
						height={1000}
						opacityClassName="opacity-40"
						maxWidthClassName="max-w-4xl"
					/>
				}
			>
				<PageContainer className="z-10">
					<h1 className="text-3xl font-bold mb-4">Tools</h1>

					<p className="mb-8 body-text">
						Private tools we use for client projects. They run in your
						browser, so nothing is uploaded or stored on our servers.
					</p>

					<section className="mb-8 max-w-2xl" aria-labelledby="task-board-heading">
						<h2 id="task-board-heading" className="text-xl font-semibold mb-2">
							Task board
						</h2>
						<p className="body-text mb-4">
							A simple kanban board for website projects and client checklists,
							with To do, Needs Review and Done columns and a notes list. Import
							a checklist from a CSV, export it back, share a
							passphrase-protected link, or save a tidy PDF to send round.
						</p>
						<CtaButton href="/tools/task-board">Open the task board</CtaButton>
					</section>
				</PageContainer>
			</PageMain>
		</>
	);
}
