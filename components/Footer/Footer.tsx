import Image from "next/image";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-gray-900 text-gray-400 py-10">
			<div className="flex flex-col items-center space-y-4">
				<Image
					src="/assets/logo.svg"
					alt="Hannan Trading Logo"
					width={150}
					height={43}
				/>
				<nav className="space-x-6 text-sm mb-16">
					<Link href="/events" className="hover:text-gray-200">
						Events
					</Link>
					<Link href="/investors" className="hover:text-gray-200">
						Investors
					</Link>
					<Link href="/resources" className="hover:text-gray-200">
						Resources
					</Link>
					<Link href="/about" className="hover:text-gray-200">
						About
					</Link>
					<Link href="/help" className="hover:text-gray-200">
						Help
					</Link>
					<Link href="/privacy" className="hover:text-gray-200">
						Privacy
					</Link>
				</nav>
				<div className="flex justify-around w-full border-t border-gray-700 pt-8">
					<div className="text-sm text-gray-500 text-center">
						© 2077 Untitled UI. All rights reserved.
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
