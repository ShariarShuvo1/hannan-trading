"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Spin } from "antd";
import { writeFile, utils } from "xlsx";

interface Investor {
	_id: string;
	name: string;
	nid: string;
	nominee_name: string;
	nominee_nid: string;
	payment_method: string;
	amount: number;
	percentage: number;
	date: Date;
}

export default function Events() {
	const router = useRouter();
	const [search_text, setSearchText] = useState("");
	const [page, setPage] = useState(1);
	const [investors, setInvestors] = useState<Investor[]>([]);
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const [search_trigger, setSearchTrigger] = useState(false);
	const [itemsPerPage, setItemsPerPage] = useState(10);

	const fetchEvents = async () => {
		setLoading(true);
		const response = await fetch("/api/agent/get-investors", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				page,
				search_text,
				itemsPerPage,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			setInvestors(data.investors);
			setTotalPages(data.totalInvestors);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchEvents();
	}, [page, search_trigger, itemsPerPage]);

	async function handleSearch() {
		setPage(1);
		setSearchTrigger(!search_trigger);
	}

	return (
		<div className="py-[32px] bg-white h-full overflow-y-auto px-[24px]  w-full flex flex-col gap-[18px]">
			<TopTitle
				router={router}
				search_trigger={search_trigger}
				setSearchTrigger={setSearchTrigger}
				investors={investors}
			/>

			<SearchBar
				search_text={search_text}
				setSearchText={setSearchText}
				itemsPerPage={itemsPerPage}
				setItemsPerPage={setItemsPerPage}
				handleSearch={handleSearch}
			/>
			<SortingBar />

			<div className="w-full">
				{loading && (
					<div className="w-full flex justify-center items-center">
						<Spin size="large" />
					</div>
				)}
				{!loading &&
					investors &&
					investors.map((investor, index) => (
						<RowCard
							key={index}
							investor={investor}
							index={index}
							router={router}
							investors={investors}
							setInvestors={setInvestors}
						/>
					))}
			</div>

			{!loading && (
				<Pagination
					page={page}
					setPage={setPage}
					totalPages={totalPages}
				/>
			)}
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
		<div className="w-full flex justify-between items-center gap-4">
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
	investor,
	index,
	router,
	investors,
	setInvestors,
}: {
	investor: Investor;
	index: number;
	router: AppRouterInstance;
	investors: Investor[];
	setInvestors: (investors: Investor[]) => void;
}) {
	return (
		<div className="w-full flex flex-col border-b">
			<div
				className={`w-full grid lg:grid-cols-8 space-y-2 lg:space-y-0 p-[12px] items-center justify-between ${
					index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
				}`}
			>
				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#181D27] text-wrap font-[500] text-[14px]">
						{investor.name}
					</div>
				</div>
				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#535862] text-wrap text-[14px]">
						{investor.nid}
					</div>
				</div>
				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#535862] text-wrap text-[14px]">
						{investor.nominee_name}
					</div>
				</div>

				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#535862] text-wrap text-[14px]">
						{investor.nominee_nid}
					</div>
				</div>

				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#535862] text-wrap text-[14px]">
						{investor.payment_method}
					</div>
				</div>

				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#535862] text-wrap text-[14px]">
						{investor.amount}
					</div>
				</div>

				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#535862] text-wrap text-[14px]">
						{investor.percentage} %
					</div>
				</div>

				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#535862] text-wrap text-[14px]">
						{new Date(investor.date).toLocaleDateString("en-GB", {
							day: "numeric",
							month: "short",
							year: "numeric",
						})}
					</div>
				</div>
			</div>
		</div>
	);
}

function TopTitle({
	router,
	search_trigger,
	setSearchTrigger,
	investors,
}: {
	router: AppRouterInstance;
	search_trigger: boolean;
	setSearchTrigger: (trigger: boolean) => void;
	investors: Investor[];
}) {
	async function createExcelSheet() {
		const sheetData = [
			[
				"নং",
				"নাম",
				"জাতীয় পরিচয় পত্র নং",
				"নমিনির নাম",
				"নমিনির জাতীয় পরিচয় পত্র নং",
				"পেমেন্ট মেথড",
				"পরিমাণ",
				"শতকরা",
				"তারিখ",
			],
		];

		investors.forEach((investor, index) => {
			sheetData.push([
				(index + 1).toString(),
				investor.name,
				investor.nid,
				investor.nominee_name,
				investor.nominee_nid,
				investor.payment_method,
				investor.amount.toString(),
				investor.percentage.toString(),
				new Date(investor.date).toLocaleDateString(),
			]);
		});

		const ws = utils.aoa_to_sheet(sheetData);
		const wb = utils.book_new();
		utils.book_append_sheet(wb, ws, "Investors");

		writeFile(wb, "Investor_Report.xlsx");
	}

	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#535862] text-[24px]">
					কো-ইনভেস্টর
				</div>
			</div>
			<div className="flex gap-[12px] flex-col md:flex-row">
				<div
					className="border flex gap-1 items-center justify-center hover:bg-slate-50 h-fit font-semibold py-[10px] px-[14px] rounded-[8px] cursor-pointer"
					onClick={createExcelSheet}
				>
					<Image
						src="/assets/Icons/download-cloud-01.svg"
						alt="upload"
						width={20}
						height={20}
					/>
					<div>ডাউনলোড</div>
				</div>
			</div>
		</div>
	);
}

function SearchBar({
	search_text,
	setSearchText,
	itemsPerPage,
	setItemsPerPage,
	handleSearch,
}: {
	search_text: string;
	setSearchText: (text: string) => void;
	itemsPerPage: number;
	setItemsPerPage: (itemsPerPage: number) => void;
	handleSearch: () => void;
}) {
	return (
		<div className="w-full flex lg:flex-row flex-col h-fit justify-between gap-[20px]">
			<div className="w-full font-semibold text-[#181D27] text-[18px]">
				লিস্ট
			</div>
			<div className="border w-full lg:w-fit justify-center flex gap-0 items-center rounded-lg">
				<input
					type="number"
					placeholder="Custom"
					name="days"
					value={itemsPerPage}
					onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
					min={1}
					className="h-full w-full pe-1 border-r bg-slate-100 hover:bg-slate-200 py-[7px] font-bold outline-none rounded-l-lg text-center lg:w-[60px]"
				/>
				<div className="h-full text-nowrap w-full lg:w-fit px-1 py-[6px] select-none">
					টি এন্ট্রি দেখুন
				</div>
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
	);
}

function SortingBar() {
	return (
		<div className="w-full lg:grid hidden lg:grid-cols-8 rounded-[12px] p-[12px]  text-[12px] font-semibold text-[#717680] bg-[#FAFAFA]">
			<div className="w-full ">নাম</div>
			<div className="w-full ">NID</div>
			<div className="w-full ">নমিনির নাম</div>
			<div className="w-full ">নমিনির NID</div>
			<div className="w-full ">পেমেন্ট মেথড</div>
			<div className="w-full ">পরিমাণ</div>
			<div className="w-full ">শতকরা</div>
			<div className="w-full ">তারিখ</div>
		</div>
	);
}
