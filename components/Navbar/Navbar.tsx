"use client";
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
	const { isSignedIn } = useUser();
	const { signOut } = useClerk();
	return (
		<header className="flex items-center justify-between py-4 px-16 font-semibold bg-white">
			<div className="flex items-center space-x-8">
				<Image
					src="/assets/logo.svg"
					alt="Hannan Trading Logo"
					width={150}
					height={43}
				/>
				<nav className="space-x-6">
					<Link
						href="/events"
						className="text-gray-700 hover:text-purple-600"
					>
						Events
					</Link>
					<Link
						href="/investors"
						className="text-gray-700 hover:text-purple-600"
					>
						Investors
					</Link>
					<Link
						href="/resources"
						className="text-gray-700 hover:text-purple-600"
					>
						Resources
					</Link>
					<Link
						href="/about"
						className="text-gray-700 hover:text-purple-600"
					>
						About
					</Link>
				</nav>
			</div>
			{!isSignedIn && (
				<div className="flex space-x-4">
					<Link
						href="/login"
						className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
					>
						Log in
					</Link>
					<Link
						href="/signup"
						className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
					>
						Sign up
					</Link>
				</div>
			)}
			{isSignedIn && (
				<button
					onClick={() => signOut()}
					className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
				>
					Logout
				</button>
			)}
		</header>
	);
}
