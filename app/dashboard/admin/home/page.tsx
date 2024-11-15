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

interface Transaction {
	event_id: string;
	event_name: string;
	event_banner: string;
	event_status: boolean;
	amount: number;
	bank_account_number: string;
	bank_name: string;
	transaction_created_at: Date;
	transaction_id: string;
	agent_name: string;
	agent_id: string;
	agent_email: string;
	agent_profile_picture: string;
}

export default function Events() {
	const router = useRouter();
	const [search_text, setSearchText] = useState("");
	const [page, setPage] = useState(1);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const [search_trigger, setSearchTrigger] = useState(false);
	const [total_invested, setTotalInvested] = useState(0);
	const [all_date_and_amount, setAllDateAndAmount] = useState<
		{ date: string; totalAmount: number }[]
	>([]);
	const [days, setDays] = useState(7);

	useEffect(() => {
		if (transactions.length <= 0) return;

		const dateAmountMap = transactions.reduce<Record<string, number>>(
			(acc, transaction) => {
				const dateKey = new Date(
					transaction.transaction_created_at
				).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				});
				acc[dateKey] = (acc[dateKey] || 0) + transaction.amount;
				return acc;
			},
			{}
		);

		const dateAndAmountArray = Object.entries(dateAmountMap).map(
			([date, totalAmount]) => ({
				date,
				totalAmount,
			})
		);

		setAllDateAndAmount(dateAndAmountArray);
		setTotalInvested(
			transactions.reduce(
				(acc, transaction) => acc + transaction.amount,
				0
			)
		);
	}, [transactions]);

	const fetchEvents = async () => {
		setLoading(true);
		const response = await fetch("/api/admin/get-investment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				page,
				days,
				search_text,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			setTransactions(data.results);
			setTotalPages(data.totalPages);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	};

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

			<div className="border p-4 rounded-lg">
				<div className="w-full text-[#181D27] text-[18px] font-semibold">
					Total Invested
				</div>
				<div className="w-full text-[#181D27] text-[30px] font-semibold">
					৳{total_invested}
				</div>
				<div className="w-full h-64">
					<ResponsiveContainer width="100%" height="100%">
						<LineChart
							data={all_date_and_amount}
							margin={{
								top: 20,
								right: 30,
								left: 20,
								bottom: 5,
							}}
						>
							<CartesianGrid
								strokeDasharray="3 3"
								stroke="#444"
							/>
							<XAxis dataKey="date" stroke="#ddd" />
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
									"Total Amount",
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
			<div className="border rounded-lg w-full pb-4 flex flex-col gap-[24px]">
				<div>
					<SearchBar
						search_text={search_text}
						setSearchText={setSearchText}
						handleSearch={handleSearch}
						transactions={transactions}
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
							transactions &&
							transactions.map((transaction, index) => (
								<RowCard
									key={index}
									transaction={transaction}
									index={index}
									router={router}
									transactions={transactions}
									setTransactions={setTransactions}
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
				<span className="hidden lg:flex">Previous</span>
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
				<span className="hidden lg:flex">Next</span>
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

function RowCard({
	transaction,
	index,
	router,
	transactions,
	setTransactions,
}: {
	transaction: Transaction;
	index: number;
	router: AppRouterInstance;
	transactions: Transaction[];
	setTransactions: (transactions: Transaction[]) => void;
}) {
	return (
		<div
			className={`w-full flex p-[12px]  items-center border-b justify-between ${
				index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
			}`}
		>
			<div
				onClick={() =>
					router.push(
						`/dashboard/agent/events/${transaction.event_id}`
					)
				}
				className="lg:flex hidden cursor-pointer hover:opacity-70 w-full items-center gap-[12px]"
			>
				<img
					src={transaction.event_banner}
					alt={transaction.event_name}
					width={40}
					height={40}
					className="rounded-full aspect-square object-cover"
				/>
				<div className="text-[#181D27] text-wrap font-[500] text-[14px]">
					<span className="lg:hidden">
						{transaction.event_name.slice(0, 10) +
							(transaction.event_name.length > 10 ? "..." : "")}
					</span>
					<span className="hidden lg:flex">
						{transaction.event_name}
					</span>
				</div>
			</div>

			<div className="w-full flex px-[12px] items-center  justify-start">
				<div className="flex text-[#535862] text-[14px] items-center justify-between w-full ">
					৳{transaction.amount}
				</div>
				<div className="lg:flex hidden text-[#535862] text-[14px] items-center justify-between w-full ">
					{new Date(
						transaction.transaction_created_at
					).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</div>
				<div className="lg:flex hidden text-[#535862] text-[14px] items-center justify-between w-full ">
					{transaction.event_status ? (
						<Badge text="Event Ongoing" color="Ongoing" />
					) : (
						<Badge text="Event Completed" color="Completed" />
					)}
				</div>
			</div>
			<div className="w-full items-center flex lg:justify-between justify-end">
				<div className=" w-full max-h-[40px] items-center gap-2 flex flex-row text-start">
					<img
						src={transaction.agent_profile_picture}
						alt={transaction.agent_name}
						width={40}
						height={40}
						className="rounded-full aspect-square object-cover"
					/>
					<div className="flex flex-col text-start">
						<div className="text-[#181D27] font-[500]">
							{transaction.agent_name}
						</div>
						<div className="text-[#535862] hidden lg:flex">
							{transaction.agent_email}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

function Badge({ text, color }: { text: string; color?: string }) {
	return (
		<div
			className={`rounded-full px-[8px] border flex gap-[4px] items-center px[6px] py-[2px] text-[#414651] font-[500] ${
				color === "Ongoing"
					? `bg-[#ECFDF3] border-[#ABEFC6]`
					: "bg-[#EFF8FF] border-[#B2DDFF]"
			} text-[12px]`}
		>
			<div
				className={`h-[8px] w-[8px] ${
					color === "Ongoing" ? `bg-[#17B26A]` : "bg-[#2E90FA]"
				} rounded-full`}
			></div>
			<div
				className={`${
					color === "Ongoing" ? `text-[#067647]` : "text-[#175CD3]"
				}`}
			>
				{text}
			</div>
		</div>
	);
}

function TopTitle({ router }: { router: AppRouterInstance }) {
	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#535862] text-[24px]">
					Welcome back
				</div>
			</div>
			<div className="flex gap-[12px] flex-col md:flex-row">
				<button
					onClick={() => router.push("/dashboard/agent/events")}
					className="bg-[#7F56D9] hover:bg-[#764fc9] flex items-center gap-1 text-white h-fit font-semibold py-[10px] px-[14px] rounded-[8px]"
				>
					<Image
						src="/assets/Icons/announcement-02.svg"
						alt="cloud"
						width={20}
						height={20}
					/>
					Latest Events
				</button>
			</div>
		</div>
	);
}

function SearchBar({
	search_text,
	setSearchText,
	handleSearch,
	transactions,
	days,
	setDays,
}: {
	search_text: string;
	setSearchText: (text: string) => void;
	handleSearch: () => void;
	transactions: Transaction[];
	days: number;
	setDays: (days: number) => void;
}) {
	async function handleExcelDownload() {
		const data = transactions.map((transaction) => ({
			"Event Name": transaction.event_name,
			"Event Status": transaction.event_status ? "Active" : "Inactive",
			Amount: transaction.amount,
			"Bank Account Number": transaction.bank_account_number,
			"Bank Name": transaction.bank_name,
		}));

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

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
		a.download = `transactions_${new Date().toISOString()}.xlsx`;
		a.click();
		window.URL.revokeObjectURL(url);
	}
	return (
		<div className="flex flex-col">
			<div className="w-full px-4 pb-2 border-b mt-2 flex md:flex-row flex-col justify-between items-center gap-[20px]">
				<div className="w-full font-semibold text-[#181D27] text-[18px]">
					Recent Investments
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
					<span>Download</span>
				</button>
			</div>
			<div className="w-full px-4 pb-2 border-b mt-2 flex md:flex-row flex-col justify-between items-center gap-[20px]">
				<div className="w-full h-full items-center lg:w-fit flex border font-[500] rounded-lg text-[#414651] text-[14px]">
					<button
						onClick={() => setDays(365)}
						className="px-[12px] py-[8px] w-full hover:bg-slate-50 text-nowrap h-full border-r"
					>
						12 months
					</button>
					<button
						onClick={() => setDays(30)}
						className="px-[12px] py-[8px] text-nowrap hover:bg-slate-50 w-full h-full border-r"
					>
						30 days
					</button>
					<button
						onClick={() => setDays(7)}
						className="px-[12px] py-[8px] w-full hover:bg-slate-50 h-full border-r"
					>
						7 days
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
						placeholder="Search"
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
			<div className="w-full hidden lg:flex font-semibold ">
				Transaction
			</div>
			<div className="w-full flex px-[12px] items-center  justify-start">
				<div className="w-full font-semibold ">Amount</div>
				<div className="w-full hidden lg:flex font-semibold ">Date</div>
				<div className="w-full hidden lg:flex font-semibold ">
					Event Status
				</div>
			</div>
			<div className="w-full font-semibold hidden lg:flex">Agent</div>
			<div className="w-full font-semibold lg:hidden">Agent</div>
		</div>
	);
}
