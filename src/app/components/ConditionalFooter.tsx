"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import { isLandingPage } from "../lib/landingPages";

const HIDDEN_ON = ["/contact"];

export default function ConditionalFooter() {
	const pathname = usePathname();
	if (HIDDEN_ON.includes(pathname) || isLandingPage(pathname)) return null;

	return <Footer />;
}
