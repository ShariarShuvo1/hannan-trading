"use client";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Spin } from "antd";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";

interface Agent {
	_id: string;
	profile_picture: string;
	fullname: string;
	email: string;
	amount: number;
}

export default function Events() {
	const router = useRouter();
	const [search_text, setSearchText] = useState("");
	const [page, setPage] = useState(1);
	const [agents, setAgents] = useState<Agent[]>([]);
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const [search_trigger, setSearchTrigger] = useState(false);
	const [total_funds, setTotalFunds] = useState(0);
	const [all_email_and_amount, setAllEmailAndAmount] = useState<
		{ email: string; totalAmount: number }[]
	>([]);
	const [all_month_and_totalEvents, setAllMonthAndTotalEvents] = useState<
		{ month: string; totalEvents: number }[]
	>([]);
	const [days, setDays] = useState(7);
	const [currentMonthName, setCurrentMonthName] = useState("");
	const [previousMonthName, setPreviousMonthName] = useState("");

	useEffect(() => {
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		const currentMonth = new Date().getMonth();
		setCurrentMonthName(monthNames[currentMonth]);
		const previousMonth = (currentMonth - 1 + 12) % 12;
		setPreviousMonthName(monthNames[previousMonth]);
	}, []);

	useEffect(() => {
		if (agents.length <= 0) return;

		const emailAmountMap = agents.reduce<Record<string, number>>(
			(acc, agent) => {
				acc[agent.email] = agent.amount;
				return acc;
			},
			{}
		);

		const emailAndAmountArray = Object.entries(emailAmountMap).map(
			([email, totalAmount]) => ({
				email,
				totalAmount,
			})
		);

		setAllEmailAndAmount(emailAndAmountArray);
		setTotalFunds(agents.reduce((acc, agent) => acc + agent.amount, 0));
	}, [agents]);

	const fetchEvents = async () => {
		setLoading(true);
		const response = await fetch("/api/admin/funds/get-funds", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				page,
				search_text,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			setAgents(data.data);
			setTotalPages(data.totalPages);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	};

	const fetchEventsCounts = async () => {
		const response = await fetch("/api/admin/funds/get-total-events");
		const data = await response.json();
		if (response.ok) {
			setAllMonthAndTotalEvents(data);
		} else {
			toast.error(data.message);
		}
	};

	useEffect(() => {
		fetchEventsCounts();
	}, []);

	useEffect(() => {
		fetchEvents();
	}, [page, days, search_trigger]);

	async function handleSearch() {
		setPage(1);
		setSearchTrigger(!search_trigger);
	}

	return (
		<div className="py-[32px] bg-white h-full overflow-y-auto px-[24px]  w-full flex flex-col gap-[24px]">
			<TopTitle router={router} />
			<div className="flex flex-col w-full lg:flex-row gap-4">
				<div className="flex flex-col w-full border rounded-lg">
					<div className="w-full py-[12px] px-[16px] bg-[#FDFDFD] rounded-lg text-[#181D27] text-[18px] font-semibold">
						মোট ফান্ড
					</div>
					<div className="">
						<div className="w-full px-[16px] rounded-t-lg border-t text-[#181D27] text-[30px] font-semibold">
							৳{total_funds}
						</div>
						<div className="w-full h-64">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={all_email_and_amount}>
									<XAxis dataKey="email" stroke="#ddd" />
									<YAxis stroke="#ddd" />
									<Tooltip
										contentStyle={{
											backgroundColor: "#fff",
											borderColor: "#6941C6",
											borderRadius: "8px",
											color: "#fff",
										}}
										labelStyle={{ color: "#6941C6" }}
										formatter={(value: number) => [
											`$${value}`,
											"মোট পরিমাণ",
										]}
									/>
									<Line
										type="monotone"
										dataKey="totalAmount"
										stroke="#6941C6"
										strokeWidth={3}
										dot={{ r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
				<div className="flex flex-col w-full border rounded-lg">
					<div className="w-full py-[12px] px-[16px] bg-[#FDFDFD] rounded-lg text-[#181D27] text-[18px] font-semibold">
						বর্তমান ইভেন্টগুলি
					</div>
					<div className="">
						<div className="w-full rounded-t-lg items-center border-t flex gap-4  px-[16px]">
							<div className=" text-[#181D27] text-[30px] font-semibold">
								{all_month_and_totalEvents.find(
									(event) => event.month === currentMonthName
								)?.totalEvents || 0}
							</div>
							<div className="flex items-center ">
								<Image
									src="/assets/Icons/arrow-up.svg"
									alt="up"
									width={16}
									height={16}
								/>
								<span className="text-[#079455] text-[14px]">
									{}
									{(() => {
										const currentMonthEvents =
											all_month_and_totalEvents.find(
												(event) =>
													event.month ===
													currentMonthName
											)?.totalEvents || 0;
										const previousMonthEvents =
											all_month_and_totalEvents.find(
												(event) =>
													event.month ===
													previousMonthName
											)?.totalEvents || 0;
										const percentageChange =
											previousMonthEvents === 0
												? currentMonthEvents === 0
													? 0
													: 100
												: ((currentMonthEvents -
														previousMonthEvents) /
														previousMonthEvents) *
												  100;
										return `${percentageChange.toFixed(
											2
										)}%`;
									})()}
								</span>
							</div>
						</div>
						<div className="w-full h-64">
							<ResponsiveContainer width="100%" height="100%">
								<LineChart data={all_month_and_totalEvents}>
									<XAxis dataKey="month" stroke="#ddd" />
									<YAxis stroke="#ddd" />
									<Tooltip
										contentStyle={{
											backgroundColor: "#fff",
											borderColor: "#6941C6",
											borderRadius: "8px",
											color: "#fff",
										}}
										labelStyle={{ color: "#6941C6" }}
										formatter={(value: number) => [
											`${value}`,
											"মোট ইভেন্ট",
										]}
									/>
									<Line
										type="monotone"
										dataKey="totalEvents"
										stroke="#6941C6"
										strokeWidth={3}
										dot={{ r: 4 }}
									/>
								</LineChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</div>
			<div className="border rounded-lg w-full pb-4 flex flex-col gap-[24px]">
				<div>
					<SearchBar
						search_text={search_text}
						setSearchText={setSearchText}
						handleSearch={handleSearch}
						agents={agents}
						days={days}
						setDays={setDays}
					/>
					<SortingBar />
					<div className="w-full">
						{loading && (
							<div className="w-full flex justify-center items-center">
								<Spin size="large" />
							</div>
						)}
						{!loading &&
							agents &&
							agents.map((agent, index) => (
								<RowCard
									key={index}
									agent={agent}
									index={index}
								/>
							))}
					</div>
				</div>

				{!loading && (
					<Pagination
						page={page}
						setPage={setPage}
						totalPages={totalPages}
					/>
				)}
			</div>
		</div>
	);
}

function Pagination({
	page,
	setPage,
	totalPages,
}: {
	page: number;
	setPage: (page: number) => void;
	totalPages: number;
}) {
	const renderPageNumbers = () => {
		const pageNumbers = [];
		const startPage = Math.max(2, page - 1);
		const endPage = Math.min(totalPages - 1, page + 1);

		if (page > 3) {
			pageNumbers.push(1, "...");
		} else {
			pageNumbers.push(1);
		}

		for (let i = startPage; i <= endPage; i++) {
			pageNumbers.push(i);
		}

		if (page < totalPages - 2) {
			pageNumbers.push("...", totalPages);
		} else if (totalPages > 1) {
			pageNumbers.push(totalPages);
		}

		return pageNumbers.map((num, idx) =>
			typeof num === "string" ? (
				<span key={idx} className="text-[#414651] px-2">
					{num}
				</span>
			) : (
				<button
					key={idx}
					onClick={() => setPage(num)}
					className={`px-[16px] py-[8px]  font-semibold rounded-md ${
						num === page
							? "bg-[#FAFAFA] text-[#252B37]"
							: "text-[#535862]"
					}`}
				>
					{num}
				</button>
			)
		);
	};

	return (
		<div className="w-full px-4 flex justify-between items-center gap-4">
			<button
				onClick={() => {
					if (page > 1) setPage(page - 1);
				}}
				className={`text-[#414651] cursor-pointer disabled:cursor-default hover:bg-slate-50 disabled:hover:bg-white px-3 py-2 border disabled:border-[#E9EAEB] border-[#D5D7DA] flex gap-2 items-center disabled:text-[#A4A7AE] h-fit font-semibold rounded-lg`}
				disabled={page === 1}
			>
				<Image
					src="/assets/Icons/arrow-left.svg"
					alt="left"
					width={20}
					height={20}
					className="disabled:opacity-10"
				/>
				<span className="hidden lg:flex">পূর্ববর্তী</span>
			</button>
			<div className="text-[#414651] flex items-center gap-1">
				{renderPageNumbers()}
			</div>
			<button
				onClick={() => {
					if (page < totalPages) setPage(page + 1);
				}}
				className={`text-[#414651] cursor-pointer disabled:cursor-default hover:bg-slate-50 disabled:hover:bg-white px-3 py-2 border disabled:border-[#E9EAEB] border-[#D5D7DA] flex gap-2 items-center disabled:text-[#A4A7AE] h-fit font-semibold rounded-lg`}
				disabled={page === totalPages}
			>
				<span className="hidden lg:flex">পরবর্তী</span>
				<Image
					src="/assets/Icons/arrow-right.svg"
					alt="right"
					width={20}
					height={20}
					className="disabled:opacity-10"
				/>
			</button>
		</div>
	);
}

function RowCard({ agent, index }: { agent: Agent; index: number }) {
	return (
		<div
			className={`w-full flex p-[12px]  items-center border-b justify-between ${
				index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
			}`}
		>
			<div className="flex w-full items-center gap-[12px]">
				<img
					src={agent.profile_picture}
					alt={agent.fullname}
					width={40}
					height={40}
					className="rounded-full aspect-square object-cover"
				/>
				<div className="text-[#181D27] text-wrap font-[500] text-[14px]">
					<span className="">{agent.fullname}</span>
				</div>
			</div>
			<div className="text-[#535862] hidden lg:flex w-full text-wrap text-[14px]">
				<span className="">{agent.email}</span>
			</div>

			<div className="w-full flex px-[12px] items-center  justify-start">
				<div className="flex text-[#535862] text-[14px] items-center justify-between w-full ">
					৳{agent.amount}
				</div>
			</div>
		</div>
	);
}

function TopTitle({ router }: { router: AppRouterInstance }) {
	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#535862] text-[24px]">
					ফান্ড ম্যানেজমেন্ট
				</div>
				<div className=" text-[#535862] text-[16px]">
					আপনার এজেন্টদের থেকে প্রাপ্ত সমস্ত তহবিল পরিচালনা করুন।
				</div>
			</div>
		</div>
	);
}

function SearchBar({
	search_text,
	setSearchText,
	handleSearch,
	agents,
	days,
	setDays,
}: {
	search_text: string;
	setSearchText: (text: string) => void;
	handleSearch: () => void;
	agents: Agent[];
	days: number;
	setDays: (days: number) => void;
}) {
	async function handleExcelDownload() {
		const data = agents.map((agent) => ({
			Name: agent.fullname,
			Email: agent.email,
			Amount: agent.amount,
		}));

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Agents");

		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});
		const blob = new Blob([excelBuffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `agents${new Date().toISOString()}.xlsx`;
		a.click();
		window.URL.revokeObjectURL(url);
	}
	return (
		<div className="flex flex-col">
			<div className="w-full px-4 pb-2 border-b mt-2 flex md:flex-row flex-col justify-between items-center gap-[20px]">
				<div className="w-full font-semibold text-[#181D27] text-[18px]">
					এজেন্ট
				</div>
				<button
					onClick={handleExcelDownload}
					className="border-[1px] w-full lg:w-fit hover:bg-slate-50 justify-center items-center flex gap-1 border-[#D5D7DA] rounded-[8px] py-[8px] px-[14px] "
				>
					<Image
						src="/assets/Icons/download-cloud-01.svg"
						alt="search"
						width={20}
						height={20}
						className=""
					/>
					<span>ডাউনলোড</span>
				</button>
			</div>
			<div className="w-full px-4 pb-2 border-b mt-2 flex md:flex-row flex-col justify-between items-center gap-[20px]">
				<div className="w-full h-full items-center lg:w-fit flex border font-[500] rounded-lg text-[#414651] text-[14px]">
					<button
						onClick={() => setDays(365)}
						className="px-[12px] py-[8px] w-full hover:bg-slate-50 text-nowrap h-full border-r"
					>
						12 মাস
					</button>
					<button
						onClick={() => setDays(30)}
						className="px-[12px] py-[8px] text-nowrap hover:bg-slate-50 w-full h-full border-r"
					>
						30 দিন
					</button>
					<button
						onClick={() => setDays(7)}
						className="px-[12px] py-[8px] w-full hover:bg-slate-50 h-full border-r"
					>
						7 দিন
					</button>
					<input
						type="number"
						placeholder="Custom"
						name="days"
						value={days}
						onChange={(e) => setDays(parseInt(e.target.value))}
						className="h-full px-[12px] py-[8px] hover:bg-slate-50 rounded-r-lg text-center w-[80px]"
					/>
				</div>
				<div className="relative ">
					<Image
						src="/assets/Icons/search-lg.svg"
						alt="search"
						width={20}
						height={20}
						className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
					/>
					<input
						type="text"
						placeholder="অনুসন্ধান করুন"
						name="search"
						value={search_text}
						onChange={(e) => setSearchText(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") handleSearch();
						}}
						className="border-[1px] border-[#D5D7DA] rounded-[8px] h-[40px] pl-[40px] pr-[12px] w-full md:min-w-[320px]"
					/>
				</div>
			</div>
		</div>
	);
}

function SortingBar() {
	return (
		<div className="w-full flex text-[12px] p-[12px] items-center text-[#717680] bg-[#FAFAFA]  justify-between">
			<div className="w-full font-semibold ">এজেন্ট</div>
			<div className="w-full hidden lg:flex font-semibold ">ইমেইল</div>
			<div className="w-full font-semibold ">পরিমাণ</div>
		</div>
	);
}
