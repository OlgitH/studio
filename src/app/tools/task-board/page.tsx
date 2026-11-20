import type { Metadata } from "next";
import BackHomeLink from "../../components/BackHomeLink";
import TaskBoard from "./TaskBoard";

// Private, password-protected (see src/proxy.ts) and kept out of search.
export const metadata: Metadata = {
	title: "Task board | Greencrown Studio",
	robots: { index: false, follow: false, nocache: true },
};

export default function TaskBoardPage() {
	return (
		<>
			<BackHomeLink dark />
			<TaskBoard />
		</>
	);
}
