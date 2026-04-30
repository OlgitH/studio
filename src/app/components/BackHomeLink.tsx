import Image from "next/image";
import Link from "next/link";

export default function BackHomeLink() {
  return (
    <Link href="/" className="back-home-link" aria-label="Back home">
      <Image
        src="/bird-icon.svg"
        alt="Greencrown mark"
        width={160}
        height={94}
        priority
      />
      <span>back home</span>
    </Link>
  );
}