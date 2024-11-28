"use client";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Spin } from "antd";
import { Check, Hourglass, CheckCheck } from "lucide-react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";

interface Investor {
	name: string;
	nid: string;
	nominee_name: string;
	nominee_nid: string;
	payment_method: string;
	amount: string;
	percentage: string;
}

interface Event {
	_id: string;
	name: string;
	banner: string;
}

interface User {
	_id: string;
	fullname: string;
	email: string;
	phone: string;
	profile_picture: string;
}

interface Transaction {
	_id: string;
	amount: number;
	created_at: Date;
	user: User;
	picture: string;
	event: Event;
	agent_bank_info: {
		bank_account_number: string;
		bank_name: string;
		bank_account_holder_name: string;
		bank_district: string;
		bank_branch: string;
		routing_number: string;
	};
	admin_bank_info: {
		bank_account_number: string;
		bank_name: string;
		bank_account_holder_name: string;
		bank_district: string;
		bank_branch: string;
		routing_number: string;
	};
	investors: Investor[];
	is_approved: boolean;
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
	const [itemsPerPage, setItemsPerPage] = useState(10);

	useEffect(() => {
		if (transactions.length <= 0) return;

		const dateAmountMap = transactions.reduce<Record<string, number>>(
			(acc, transaction) => {
				const dateKey = new Date(
					transaction.created_at
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

	const fetchInvestment = async () => {
		setLoading(true);
		const response = await fetch("/api/admin/get-investment", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				page,
				days,
				itemsPerPage,
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
		fetchInvestment();
	}, [page, days, search_trigger, itemsPerPage]);

	async function handleSearch() {
		setPage(1);
		setSearchTrigger(!search_trigger);
	}

	return (
		<div className="py-[32px] bg-white h-full overflow-y-auto px-[24px]  w-full flex flex-col gap-[24px]">
			<TopTitle router={router} />

			<div className="border p-4 rounded-lg">
				<div className="w-full text-[#181D27] text-[18px] font-semibold">
					মোট বিনিয়োগ
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
									`৳${value}`,
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
			<div className="border rounded-lg w-full pb-4 flex flex-col gap-[24px]">
				<div>
					<SearchBar
						itemsPerPage={itemsPerPage}
						setItemsPerPage={setItemsPerPage}
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
	const [loading, setLoading] = useState(false);

	async function handleApprove() {
		setLoading(true);
		const response = await fetch("/api/admin/get-investment", {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				transaction_id: transaction._id,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			setTransactions(
				transactions.map((t) =>
					t._id === transaction._id ? { ...t, is_approved: true } : t
				)
			);
			toast.success("লেনদেন অনুমোদিত হয়েছে");
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}

	return (
		<div
			className={`w-full grid lg:grid-cols-8 space-y-4 lg:space-y-0 p-[12px] items-center border-b justify-between ${
				index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
			}`}
		>
			<div
				onClick={() =>
					router.push(
						`/dashboard/agent/events/${transaction.event._id}`
					)
				}
				className="flex cursor-pointer hover:opacity-70 w-full items-center gap-[12px]"
			>
				<img
					src={transaction.event.banner}
					alt={transaction.event.name}
					width={40}
					height={40}
					className="rounded-full aspect-square object-cover"
				/>
				<div className="text-[#181D27] text-wrap font-[500] text-[14px]">
					<span className="lg:hidden">
						{transaction.event.name.slice(0, 10) +
							(transaction.event.name.length > 10 ? "..." : "")}
					</span>
					<span className="hidden lg:flex">
						{transaction.event.name}
					</span>
				</div>
			</div>
			<div className="text-[#717680] w-full">৳{transaction.amount}</div>
			<div className="text-[#717680] w-full">
				{new Date(transaction.created_at).toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})}
			</div>
			<div
				className="text-[#717680] w-full flex flex-col"
				title={`
                Acc Holder: ${transaction.admin_bank_info.bank_account_holder_name}
                District: ${transaction.admin_bank_info.bank_district}
                Branch: ${transaction.admin_bank_info.bank_branch}
                Routing Number: ${transaction.admin_bank_info.routing_number}`}
			>
				<div className="font-semibold text-black">
					{transaction.admin_bank_info.bank_account_number}
				</div>
				<div>{transaction.admin_bank_info.bank_name}</div>
			</div>
			<div
				className="text-[#717680] w-full flex flex-col"
				title={`
                Acc Holder: ${transaction.agent_bank_info.bank_account_holder_name}
                District: ${transaction.agent_bank_info.bank_district}
                Branch: ${transaction.agent_bank_info.bank_branch}
                Routing Number: ${transaction.agent_bank_info.routing_number}
                `}
			>
				<div className="font-semibold text-black">
					{transaction.agent_bank_info.bank_account_number}
				</div>
				<div>{transaction.agent_bank_info.bank_name}</div>
			</div>
			<div className="text-[#717680] h-full w-full items-center flex gap-2">
				<img
					src={transaction.user.profile_picture}
					alt={transaction.user.fullname}
					width={40}
					height={40}
					className="rounded-full h-fit aspect-square object-fill"
				/>
				<div>
					<div className="text-wrap">{transaction.user.fullname}</div>
					<div className="text-wrap">{transaction.user.phone}</div>
				</div>
			</div>
			<ImageModal transaction={transaction} />
			{loading ? (
				<div className=" w-full flex items-center gap-2">
					<Spin size="large" />
				</div>
			) : (
				<div>
					{transaction.is_approved ? (
						<div className="text-green-500 w-full flex items-center gap-2">
							<CheckCheck size={20} />
							<div>অনুমোদিত</div>
						</div>
					) : (
						<div
							onClick={handleApprove}
							className="text-violet-600 cursor-pointer hover:text-violet-700 w-full flex items-center gap-2"
						>
							<Check size={20} />
							<div>অনুমোদন দিন</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
}

const ImageModal = ({ transaction }: { transaction: { picture: string } }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	return (
		<div className="w-full">
			<img
				src={transaction.picture}
				alt="receipt"
				className="max-h-[50px] border-2 rounded-lg border-black max-w-[80px] w-full h-full object-fill cursor-pointer"
				onClick={openModal}
			/>

			{isModalOpen && (
				<div
					className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
					onClick={closeModal}
				>
					<img
						src={transaction.picture}
						alt="receipt"
						className="max-w-[1000px] max-h-[1000px] w-auto h-auto object-contain"
						onClick={(e) => e.stopPropagation()}
					/>
				</div>
			)}
		</div>
	);
};

function TopTitle({ router }: { router: AppRouterInstance }) {
	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#535862] text-[24px]">
					স্বাগতম এডমিন
				</div>
			</div>
			<div className="flex gap-[12px] flex-col md:flex-row">
				<button
					onClick={() =>
						router.push(`/dashboard/admin/home/add-bank`)
					}
					className="border-[1px] h-fit w-full lg:w-fit font-semibold hover:bg-slate-50 justify-center items-center flex gap-1 border-[#D5D7DA] rounded-[8px] py-[10px] px-[14px] "
				>
					<Image
						src="/assets/Icons/wallet-02.svg"
						alt="search"
						width={20}
						height={20}
						className=""
					/>
					<span>নতুন ব্যাংক অ্যাকাউন্ট যোগ করুন</span>
				</button>
				<button
					onClick={() => router.push("/dashboard/admin/events")}
					className="bg-[#7F56D9] hover:bg-[#764fc9] flex items-center gap-1 text-white h-fit font-semibold py-[10px] px-[14px] rounded-[8px]"
				>
					<Image
						src="/assets/Icons/announcement-02.svg"
						alt="cloud"
						width={20}
						height={20}
					/>
					নতুন ইভেন্টগুলি দেখুন
				</button>
			</div>
		</div>
	);
}

function SearchBar({
	itemsPerPage,
	setItemsPerPage,
	search_text,
	setSearchText,
	handleSearch,
	transactions,
	days,
	setDays,
}: {
	itemsPerPage: number;
	setItemsPerPage: (itemsPerPage: number) => void;
	search_text: string;
	setSearchText: (text: string) => void;
	handleSearch: () => void;
	transactions: Transaction[];
	days: number;
	setDays: (days: number) => void;
}) {
	async function handleExcelDownload() {
		const data: { [key: string]: string | number }[] = [];

		transactions.forEach((transaction) => {
			data.push({
				ইভেন্ট: transaction.event.name,
				পরিমাণ: transaction.amount,
				তারিখ: new Date(transaction.created_at).toLocaleDateString(
					"en-US",
					{
						month: "short",
						day: "numeric",
						year: "numeric",
					}
				),
				"প্রাপকের ব্যাংক নাম": transaction.admin_bank_info.bank_name,
				"প্রাপকের অ্যাকাউন্ট নম্বর":
					transaction.admin_bank_info.bank_account_number,
				"প্রাপকের অ্যাকাউন্ট হোল্ডার নাম":
					transaction.admin_bank_info.bank_account_holder_name,
				"প্রাপকের জেলা": transaction.admin_bank_info.bank_district,
				"প্রাপকের শাখা": transaction.admin_bank_info.bank_branch,
				"প্রাপকের রাউটিং নম্বর":
					transaction.admin_bank_info.routing_number,
				"প্রেরকের ব্যাংক নাম": transaction.agent_bank_info.bank_name,
				"প্রেরকের অ্যাকাউন্ট নম্বর":
					transaction.agent_bank_info.bank_account_number,
				"প্রেরকের অ্যাকাউন্ট হোল্ডার নাম":
					transaction.agent_bank_info.bank_account_holder_name,
				"প্রেরকের জেলা": transaction.agent_bank_info.bank_district,
				"প্রেরকের শাখা": transaction.agent_bank_info.bank_branch,
				"প্রেরকের রাউটিং নম্বর":
					transaction.agent_bank_info.routing_number,
				স্ট্যাটাস: transaction.is_approved ? "অনুমোদিত" : "অপেক্ষাধীন",
			});

			transaction.investors.forEach((investor, index) => {
				data.push({
					ইভেন্ট: index === 0 ? "→ কো-ইনভেস্টর" : "",
					"ইনভেস্টর নাম": investor.name,
					"ইনভেস্টর NID": investor.nid,
					"নমিনি নাম": investor.nominee_name,
					"নমিনি NID": investor.nominee_nid,
					"পেমেন্ট পদ্ধতি": investor.payment_method,
					পরিমাণ: investor.amount,
					"শেয়ার শতাংশ": investor.percentage,
				});
			});
		});

		const ws = XLSX.utils.json_to_sheet(data);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Transactions");
		XLSX.writeFile(wb, "transactions_with_investors.xlsx");
	}

	return (
		<div className="flex flex-col">
			<div className="w-full px-4 pb-2 border-b mt-2 flex md:flex-row flex-col justify-between items-center gap-[20px]">
				<div className="w-full font-semibold text-[#181D27] text-[18px]">
					সাম্প্রতিক বিনিয়োগ
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
				<div className="border w-full lg:w-fit justify-center flex gap-0 items-center rounded-lg">
					<input
						type="number"
						placeholder="Custom"
						name="days"
						value={itemsPerPage}
						onChange={(e) =>
							setItemsPerPage(parseInt(e.target.value))
						}
						min={1}
						className="h-full w-full pe-1 border-r bg-slate-100 hover:bg-slate-200 py-[7px] font-bold outline-none rounded-l-lg text-center lg:w-[60px]"
					/>
					<div className="h-full w-full lg:w-fit px-1 py-[6px] select-none">
						টি এন্ট্রি দেখুন
					</div>
				</div>
				<div className="relative w-full lg:w-fit">
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
		<div className="w-full text-[12px] font-semibold text-nowrap p-[12px] text-[#717680] bg-[#FAFAFA] hidden lg:grid lg:grid-cols-8 gap-2">
			<div className="w-full">ইভেন্ট</div>
			<div className="w-full">পরিমাণ</div>
			<div className="w-full">তারিখ</div>
			<div className="w-full">প্রাপকের ব্যাংক</div>
			<div className="w-full">প্রেরকের ব্যাংক</div>
			<div className="w-full">এজেন্ট</div>
			<div className="w-full">রিসিপ্ট</div>
			<div className="w-full">স্ট্যাটাস</div>
		</div>
	);
}
