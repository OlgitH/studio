import type { ReactNode } from "react";

export default function PageMain({ children }: { children: ReactNode }) {
	return (
		<main className="mx-auto flex w-full min-h-dvh max-w-4xl flex-col justify-end overflow-hidden px-6 pb-8 pt-40 md:min-h-0 md:justify-start md:overflow-visible md:px-8 md:pb-8">
			{children}
		</main>
	);
}
