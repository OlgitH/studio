"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";

const HIDDEN_ON = ["/contact"];

export default function ConditionalFooter() {
	const pathname = usePathname();
	if (HIDDEN_ON.includes(pathname)) return null;

	return <Footer />;
}
