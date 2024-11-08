"use client";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
	const { isSignedIn } = useUser();
	const { signOut } = useClerk();
	const [isOpen, setIsOpen] = useState(false);

	return (
		<header className="flex relative items-center z-50 justify-between py-4 px-6 md:px-[112px] font-semibold w-full">
			<div className=" md:flex md:items-center md:space-x-8">
				<Image
					src="/assets/logo.svg"
					alt="Hannan Trading Logo"
					width={150}
					height={43}
				/>
				<nav className="hidden md:flex space-x-6">
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

			<div className="hidden md:flex space-x-4">
				{!isSignedIn ? (
					<>
						<Link
							href="/login"
							className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
						>
							Log in
						</Link>
						<Link
							href="/signup"
							className="px-4 py-2 text-white bg-[#7F56D9] rounded-lg hover:bg-[#6846b1]"
						>
							Sign up
						</Link>
					</>
				) : (
					<button
						onClick={() => signOut()}
						className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
					>
						Logout
					</button>
				)}
			</div>

			<div className="md:hidden">
				<button onClick={() => setIsOpen(!isOpen)}>
					{isOpen ? (
						<X className="w-6 h-6 text-gray-700" />
					) : (
						<Menu className="w-6 h-6 text-gray-700" />
					)}
				</button>
			</div>

			{isOpen && (
				<div className="absolute top-full w-full bg-white left-0 p-2  border-t border-gray-200 flex flex-col items-center md:hidden">
					<nav className="flex flex-col w-full space-y-4 py-4">
						<Link
							href="/events"
							className="text-gray-700 hover:text-purple-600"
							onClick={() => setIsOpen(false)}
						>
							Events
						</Link>
						<hr />
						<Link
							href="/investors"
							className="text-gray-700 hover:text-purple-600"
							onClick={() => setIsOpen(false)}
						>
							Investors
						</Link>
						<hr />
						<Link
							href="/resources"
							className="text-gray-700 hover:text-purple-600"
							onClick={() => setIsOpen(false)}
						>
							Resources
						</Link>
						<hr />
						<Link
							href="/about"
							className="text-gray-700 hover:text-purple-600"
							onClick={() => setIsOpen(false)}
						>
							About
						</Link>
						<hr />
					</nav>
					<div className="flex flex-row w-full gap-2">
						{!isSignedIn ? (
							<>
								<Link
									href="/login"
									className="px-4 py-2 text-gray-700 w-full border border-gray-300 rounded-lg hover:bg-gray-100"
									onClick={() => setIsOpen(false)}
								>
									Log in
								</Link>
								<Link
									href="/signup"
									className="px-4 py-2 text-white w-full bg-[#7F56D9] rounded-lg hover:bg-[#6846b1]"
									onClick={() => setIsOpen(false)}
								>
									Sign up
								</Link>
							</>
						) : (
							<button
								onClick={() => {
									signOut();
									setIsOpen(false);
								}}
								className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700"
							>
								Logout
							</button>
						)}
					</div>
				</div>
			)}
		</header>
	);
}
