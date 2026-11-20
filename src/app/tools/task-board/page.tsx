import type { Metadata } from "next";
import BackHomeLink from "../../components/BackHomeLink";
import TaskBoard from "./TaskBoard";

const TITLE = "Free Website Task Board & Checklist Tool | Greencrown Studio";
const DESCRIPTION =
	"Free, private kanban board for website changes and client checklists. Import or export CSV, save a PDF, or share a protected link. Nothing stored online.";

export const metadata: Metadata = {
	title: TITLE,
	description: DESCRIPTION,
	// Share links add ?for=… to this URL; point search engines at the plain page.
	alternates: { canonical: "/tools/task-board" },
	openGraph: {
		title: TITLE,
		description: DESCRIPTION,
		url: "/tools/task-board",
		type: "website",
	},
};

export default function TaskBoardPage() {
	return (
		<>
			<BackHomeLink dark />
			<TaskBoard />
		</>
	);
}
