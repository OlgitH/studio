import type { Metadata } from "next";
import TaskBoard from "./TaskBoard";

export const metadata: Metadata = {
	title: "Task board | Greencrown Studio",
	robots: { index: false, follow: false },
};

export default function TaskBoardPage() {
	return <TaskBoard />;
}
