import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-[#0C0E12] text-[#94979C] py-10">
			<div className="flex flex-col items-center space-y-4 px-2 md:px-[112px]">
				<Image
					src="/assets/logo-white.svg"
					alt="Hannan Trading Logo"
					width={150}
					height={43}
				/>
				<nav className="space-x-6 flex flex-col md:flex-row text-sm mb-16">
					<div className="space-x-6">
						<Link href="/events" className="hover:text-gray-200">
							Events
						</Link>
						<Link href="/investors" className="hover:text-gray-200">
							Investors
						</Link>
						<Link href="/resources" className="hover:text-gray-200">
							Resources
						</Link>
					</div>
					<div className="space-x-6">
						<Link href="/about" className="hover:text-gray-200">
							About
						</Link>
						<Link href="/help" className="hover:text-gray-200">
							Help
						</Link>
						<Link href="/privacy" className="hover:text-gray-200">
							Privacy
						</Link>
					</div>
				</nav>
				<div className="flex flex-col md:flex-row items-center md:justify-around w-full border-t border-gray-700 pt-8">
					<div className="text-sm text-gray-500 text-center">
						© 2024 Hannan Trading. <br className="md:hidden" /> All
						rights reserved.
					</div>
					<div className="flex space-x-4 text-sm">
						<Link href="/terms" className="hover:text-gray-200">
							Terms
						</Link>
						<Link href="/privacy" className="hover:text-gray-200">
							Privacy
						</Link>
						<Link href="/cookies" className="hover:text-gray-200">
							Cookies
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
}
