"use client";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { useUser, useClerk } from "@clerk/nextjs";
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
	const [profileShow, setProfileShow] = useState(false);
	const { signOut } = useClerk();

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
										router.push("/dashboard/admin/home")
									}
									className={`flex cursor-pointer rounded-lg p-2 flex-row items-center gap-2 ${
										pathname.startsWith(
											"/dashboard/admin/home"
										)
											? "bg-[#FAFAFA]"
											: ""
									}`}
								>
									<Image
										src="/assets/Icons/home-line.svg"
										width={24}
										height={24}
										alt="Home"
									/>
									<span className="text-[16px] text-[#252B37] hover:text-[#384153] font-semibold">
										Home
									</span>
								</div>
							</li>
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
							<li className="mb-2">
								<div
									onClick={() =>
										router.push("/dashboard/admin/funds")
									}
									className={`flex cursor-pointer rounded-lg p-2 flex-row items-center gap-2 ${
										pathname.startsWith(
											"/dashboard/admin/funds"
										)
											? "bg-[#FAFAFA]"
											: ""
									}`}
								>
									<Image
										src="/assets/Icons/wallet-02.svg"
										width={24}
										height={24}
										alt="Funds"
									/>
									<span className="text-[16px] text-[#252B37] hover:text-[#384153] font-semibold">
										Funds
									</span>
								</div>
							</li>
							<li className="mb-2">
								<div
									onClick={() =>
										router.push("/dashboard/admin/agents")
									}
									className={`flex cursor-pointer rounded-lg p-2 flex-row items-center gap-2 ${
										pathname.startsWith(
											"/dashboard/admin/agents"
										)
											? "bg-[#FAFAFA]"
											: ""
									}`}
								>
									<Image
										src="/assets/Icons/users-01.svg"
										width={24}
										height={24}
										alt="Agents"
									/>
									<span className="text-[16px] text-[#252B37] hover:text-[#384153] font-semibold">
										Agents
									</span>
								</div>
							</li>
							<li className="mb-2">
								<div
									onClick={() =>
										router.push(
											"/dashboard/admin/investors"
										)
									}
									className={`flex cursor-pointer rounded-lg p-2 flex-row items-center gap-2 ${
										pathname.startsWith(
											"/dashboard/admin/investors"
										)
											? "bg-[#FAFAFA]"
											: ""
									}`}
								>
									<Image
										src="/assets/Icons/users-01.svg"
										width={24}
										height={24}
										alt="Events"
									/>
									<span className="text-[16px] text-[#252B37] hover:text-[#384153] font-semibold">
										Co-Investors
									</span>
								</div>
							</li>
						</ul>
					</div>
					<div className="w-full border p-2 bg-white rounded-lg">
						{profile && (
							<div className="w-full justify-between flex items-start">
								<div className="flex items-center gap-2">
									<img
										src={profile.profile_picture}
										alt="Profile Picture"
										width={40}
										height={40}
										className="rounded-full aspect-square"
									/>
									<div>
										<p className="text-[#252B37] font-semibold">
											{profile.fullname}
										</p>
										<p className="text-[#6B7280] text-[14px]">
											Super Admin
										</p>
									</div>
								</div>
								<div className="">
									<div className="relative">
										{profileShow && (
											<div className="absolute -left-52 lg:left-10 lg:bottom-0 bottom-10 border rounded-lg shadow-lg">
												<ul>
													<li className=" w-full flex flex-col items-start">
														<div className=" rounded-lg border-b bg-white">
															<div className="text-[#535862] px-4 py-2 font-semibold text-[12px] text-nowrap">
																Switch Account
															</div>
															<div
																onClick={() => {
																	router.push(
																		"/dashboard/agent/home"
																	);
																}}
																className="flex justify-between px-4 py-2 cursor-pointer hover:bg-slate-50 w-64"
															>
																<div className="flex">
																	<img
																		src={
																			profile.profile_picture
																		}
																		alt="Profile Picture"
																		width={
																			40
																		}
																		height={
																			40
																		}
																		className="rounded-full h-[40px] w-[40px] aspect-square"
																	/>

																	<div className="flex text-nowrap flex-col ml-2 h-full w-full items-start justify-between">
																		<div className="text-[#252B37] font-semibold">
																			{
																				profile.fullname
																			}
																		</div>
																		<div className="text-[#6B7280] text-[14px]">
																			Agent
																		</div>
																	</div>
																</div>
																<div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
																	<div className="w-2 h-2 bg-white rounded-full"></div>
																</div>
															</div>
															{profile.role.includes(
																"admin"
															) && (
																<div className="flex px-4 py-2 cursor-default justify-between bg-slate-50 w-64">
																	<div className="flex">
																		<img
																			src={
																				profile.profile_picture
																			}
																			alt="Profile Picture"
																			width={
																				40
																			}
																			height={
																				40
																			}
																			className="rounded-full h-[40px] w-[40px] aspect-square"
																		/>

																		<div className="flex text-nowrap flex-col ml-2 h-full w-full items-start justify-between">
																			<div className="text-[#252B37] font-semibold">
																				{
																					profile.fullname
																				}
																			</div>
																			<div className="text-[#6B7280] text-[14px]">
																				Super
																				Admin
																			</div>
																		</div>
																	</div>

																	<div className="w-4 h-4 rounded-full border bg-violet-600 border-gray-400 flex items-center justify-center">
																		<div className="w-2 h-2 bg-white rounded-full"></div>
																	</div>
																</div>
															)}
														</div>
														<div
															onClick={() => {
																signOut();
																router.push(
																	"/"
																);
															}}
															className="bg-[#FAFAFA] cursor-pointer hover:bg-slate-100 w-full rounded-b-lg px-4 flex "
														>
															<Image
																src="/assets/Icons/log-out-01.svg"
																width={24}
																height={24}
																alt="Logout"
																className="cursor-pointer hover:bg-slate-50 rounded-lg"
															/>
															<div className="text-[#414651] text-[14px] font-semibold p-2">
																Sign Out
															</div>
														</div>
													</li>
												</ul>
											</div>
										)}
										<Image
											src="/assets/Icons/chevron-selector-vertical2.svg"
											width={24}
											height={24}
											alt="Dropdown"
											className="cursor-pointer hover:bg-slate-50 rounded-lg"
											onClick={() =>
												setProfileShow(!profileShow)
											}
										/>
									</div>
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
