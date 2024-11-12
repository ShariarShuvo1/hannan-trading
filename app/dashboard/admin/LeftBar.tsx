"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { X, Menu } from "lucide-react";

interface User {
	fullname: string;
	profile_picture: string;
	role: string[];
	_id: string;
}

export default function LeftPanel() {
	const router = useRouter();
	const pathname = usePathname();
	const { isLoaded, user } = useUser();
	const [profile, setProfile] = useState<User | null>(null);
	const [fetchingProfile, setFetchingProfile] = useState(false);
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	useEffect(() => {
		if (!isLoaded) return;
		async function fetchUser() {
			if (!user) return;
			setFetchingProfile(true);
			const res = await fetch(
				`/api/profile?email=${user.emailAddresses[0].emailAddress}`
			);
			if (res.ok) {
				const data = await res.json();
				setProfile(data);
			} else {
				toast.error("Failed to fetch user profile");
			}
			setFetchingProfile(false);
		}
		fetchUser();
	}, [isLoaded, user]);

	return (
		<>
			<div className="lg:hidden bg-white flex items-center justify-between p-4">
				<Image
					src="/assets/logo.svg"
					alt="Logo"
					width={100}
					height={100}
					className="cursor-pointer"
					onClick={() => router.push("/")}
				/>
				<Menu
					onClick={() => setIsSidebarOpen(true)}
					className="text-gray-700 cursor-pointer"
					size={24}
				/>
			</div>

			<div
				className={`fixed lg:static top-0 left-0 h-full w-[296px] max-w-[296px] bg-white border-r border-gray-200 z-50 p-5 transform ${
					isSidebarOpen ? "translate-x-0" : "-translate-x-full"
				} lg:translate-x-0 transition-transform duration-300`}
			>
				<div className="h-full flex flex-col justify-between">
					<div>
						<div className="flex justify-between">
							<Image
								src="/assets/logo.svg"
								alt="Logo"
								width={100}
								height={100}
								className="cursor-pointer"
								onClick={() => router.push("/")}
							/>
							<div className="lg:hidden flex justify-end mb-4">
								<X
									onClick={() => setIsSidebarOpen(false)}
									className="text-gray-700 cursor-pointer"
									size={24}
								/>
							</div>
						</div>
						<ul className="mt-8 px-1">
							<li className="mb-2">
								<div
									onClick={() =>
										router.push("/dashboard/admin/events")
									}
									className={`flex cursor-pointer rounded-lg p-2 flex-row items-center gap-2 ${
										pathname.startsWith(
											"/dashboard/admin/events"
										)
											? "bg-[#FAFAFA]"
											: ""
									}`}
								>
									<Image
										src="/assets/Icons/rows-01.svg"
										width={24}
										height={24}
										alt="Events"
									/>
									<span className="text-[16px] text-[#252B37] hover:text-[#384153] font-semibold">
										Events
									</span>
								</div>
							</li>
						</ul>
					</div>
					<div className="w-full border p-2 bg-white rounded-lg">
						{profile && (
							<div className="flex items-center gap-2">
								<img
									src={profile.profile_picture}
									alt="Profile Picture"
									width={40}
									height={40}
									className="rounded-full"
								/>
								<div>
									<p className="text-[#252B37] font-semibold">
										{profile.fullname}
									</p>
									<p className="text-[#6B7280] text-[14px]">
										{profile.role.includes("admin")
											? "Super Admin"
											: "Agent"}
									</p>
								</div>
							</div>
						)}
						{fetchingProfile && (
							<div className="flex items-center gap-2">
								<Spin />
							</div>
						)}
					</div>
				</div>
			</div>

			{isSidebarOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
					onClick={() => setIsSidebarOpen(false)}
				></div>
			)}
		</>
	);
}
