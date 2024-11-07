"use client";
import toast from "react-hot-toast";
import Image from "next/image";
import {
	Home,
	LayoutDashboard,
	Calendar,
	BarChart,
	Users,
	LifeBuoy,
	Settings,
	Search,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	const success = () => {
		toast.success("Thank you for participating in this event!");
	};
	const route = useRouter();
	return (
		<div className="flex">
			<aside className="w-64 h-screen p-4 bg-white border-r flex flex-col ">
				<Image
					src="/assets/logo.svg"
					alt="Logo"
					width={150}
					height={43}
					className="cursor-pointer"
					onClick={() => route.push("/")}
				/>
				<div className="relative mt-4">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
					<input
						type="text"
						placeholder="Search"
						className="w-full pl-10 pr-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300"
					/>
				</div>

				<nav className="space-y-4 mt-4 w-full font-semibold">
					<a
						href="#"
						className="flex items-center py-2 text-gray-700 hover:bg-purple-100 rounded-lg"
					>
						<Home className="w-5 h-5" />
						<span className="ml-2">Home</span>
					</a>
					<a
						href="#"
						className="flex items-center py-2 text-gray-700 hover:bg-purple-100 rounded-lg"
					>
						<LayoutDashboard className="w-5 h-5" />
						<span className="ml-2">Dashboard</span>
					</a>
					<a
						href="#"
						className="flex items-center py-2 text-gray-700 hover:bg-purple-100 rounded-lg"
					>
						<Calendar className="w-5 h-5" />
						<span className="ml-2">Events</span>
					</a>
					<a
						href="#"
						className="flex items-center py-2 text-gray-700 hover:bg-purple-100 rounded-lg"
					>
						<BarChart className="w-5 h-5" />
						<span className="ml-2">Reporting</span>
					</a>
					<a
						href="#"
						className="flex items-center py-2 text-gray-700 hover:bg-purple-100 rounded-lg"
					>
						<Users className="w-5 h-5" />
						<span className="ml-2">Users</span>
					</a>
				</nav>
				<div className="mt-auto space-y-4 w-full">
					<a
						href="#"
						className="flex items-center py-2 text-gray-700 hover:bg-purple-100 rounded-lg"
					>
						<LifeBuoy className="w-5 h-5" />
						<span className="ml-2">Support</span>
					</a>
					<a
						href="#"
						className="flex items-center py-2 text-gray-700 hover:bg-purple-100 rounded-lg"
					>
						<Settings className="w-5 h-5" />
						<span className="ml-2">Settings</span>
					</a>
				</div>
				<div className="mt-4 flex items-center space-x-2 px-4 py-2 bg-white rounded-xl border">
					<User className="w-5 h-5" />
					<div>
						<div className="text-sm font-semibold">Olivia Rhye</div>
						<div className="text-xs text-gray-500">
							olivia@untitledui.com
						</div>
					</div>
				</div>
			</aside>
			<main className="flex-1 p-6 bg-white">
				<h1 className="text-2xl font-bold mb-4 border-b">Events</h1>
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
					<div className=" rounded-lg p-4">
						<Image
							src="/assets/images/p1.jpg"
							width={528}
							height={240}
							className="rounded-lg w-full max-h-[240px] items-cover"
							alt="Event Image"
						/>
						<div className="mt-4 text-sm text-gray-500">
							Olivia Rhye • 20 Jan 2025
						</div>
						<h2 className="text-xl font-semibold mt-2">
							Event Name
						</h2>
						<p className="text-gray-600 mt-1">
							How do you create compelling presentations that wow
							your colleagues and impress your managers?
						</p>
						<div className="flex space-x-2 mt-4">
							<span className="px-2 py-1 border text-xs rounded flex gap-1 items-center">
								<div className="rounded-full bg-[#7F56D9] text-white px-1 h-fit py-1 text-xs"></div>
								70% ROI
							</span>
							<span className="px-2 py-1 border text-xs rounded flex gap-1 items-center">
								<div className="rounded-full bg-[#2d1eaf] text-white px-1 h-fit py-1 text-xs"></div>
								Min. Invest 10k BDT
							</span>
						</div>
						<button
							onClick={success}
							className="mt-4 px-[14px] py-2 bg-[#7F56D9] text-white text-sm rounded-lg"
						>
							+ Participate in this Event
						</button>
					</div>
					<div className="rounded-lg p-4">
						<Image
							src="/assets/images/p2.jpg"
							width={528}
							height={240}
							className="rounded-lg w-full max-h-[240px] items-cover"
							alt="Event Image"
						/>
						<div className="mt-4 text-sm text-gray-500">
							Olivia Rhye • 20 Jan 2025
						</div>
						<h2 className="text-xl font-semibold mt-2">
							Event Name
						</h2>
						<p className="text-gray-600 mt-1">
							How do you create compelling presentations that wow
							your colleagues and impress your managers?
						</p>
						<div className="flex space-x-2 mt-4">
							<span className="px-2 py-1 border text-xs rounded flex gap-1 items-center">
								<div className="rounded-full bg-[#7F56D9] text-white px-1 h-fit py-1 text-xs"></div>
								70% ROI
							</span>
							<span className="px-2 py-1 border text-xs rounded flex gap-1 items-center">
								<div className="rounded-full bg-[#2d1eaf] text-white px-1 h-fit py-1 text-xs"></div>
								Min. Invest 10k BDT
							</span>
						</div>
						<button
							onClick={success}
							className="mt-4 px-[14px] py-2 bg-[#7F56D9] text-white text-sm rounded-lg"
						>
							+ Participate in this Event
						</button>
					</div>
					<div className="rounded-lg p-4">
						<Image
							src="/assets/images/p1.jpg"
							width={528}
							height={240}
							className="rounded-lg w-full max-h-[240px] items-cover"
							alt="Event Image"
						/>
						<div className="mt-4 text-sm text-gray-500">
							Olivia Rhye • 20 Jan 2025
						</div>
						<h2 className="text-xl font-semibold mt-2">
							Event Name
						</h2>
						<p className="text-gray-600 mt-1">
							How do you create compelling presentations that wow
							your colleagues and impress your managers?
						</p>
						<div className="flex space-x-2 mt-4">
							<span className="px-2 py-1 border text-xs rounded flex gap-1 items-center">
								<div className="rounded-full bg-[#7F56D9] text-white px-1 h-fit py-1 text-xs"></div>
								70% ROI
							</span>
							<span className="px-2 py-1 border text-xs rounded flex gap-1 items-center">
								<div className="rounded-full bg-[#2d1eaf] text-white px-1 h-fit py-1 text-xs"></div>
								Min. Invest 10k BDT
							</span>
						</div>
						<button
							onClick={success}
							className="mt-4 px-[14px] py-2 bg-[#7F56D9] text-white text-sm rounded-lg"
						>
							+ Participate in this Event
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
