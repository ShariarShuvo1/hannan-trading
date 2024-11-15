"use client";
import * as XLSX from "xlsx";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Spin } from "antd";

interface Deposit {
	amount: number;
	date: Date;
}

interface Investor {
	_id: string;
	name?: string;
	phone: string;
	deposits: Deposit[];
	address?: string;
}

export default function Events() {
	const router = useRouter();
	const [search_text, setSearchText] = useState("");
	const [page, setPage] = useState(1);
	const [investors, setInvestors] = useState<Investor[]>([]);
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const [search_trigger, setSearchTrigger] = useState(false);

	const fetchEvents = async () => {
		setLoading(true);
		const response = await fetch("/api/admin/get-investors", {
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
			setInvestors(data.investors);
			setTotalPages(data.totalInvestors);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchEvents();
	}, [page, search_trigger]);

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
			/>

			<SearchBar
				search_text={search_text}
				setSearchText={setSearchText}
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
	const [clicked, setClicked] = useState(false);
	const [loading, setLoading] = useState(false);
	async function handleDelete() {
		setLoading(true);
		const response = await fetch("/api/admin/delete-investor", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				_id: investor._id,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			toast.success(data.message);
			const temp = [...investors];
			temp.splice(index, 1);
			setInvestors(temp);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}
	return (
		<div className="w-full flex flex-col border-b">
			<div
				className={`w-full  hover:bg-[#f0f0f0] flex p-[12px] items-center justify-between ${
					index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
				}`}
			>
				<div
					onClick={() => {
						setClicked(!clicked);
					}}
					className="lg:flex cursor-pointer hidden w-full items-center gap-[12px]"
				>
					<div className="text-[#181D27] text-wrap font-[500] text-[14px]">
						{investor.name || "N/A"}
					</div>
				</div>
				<div
					onClick={() => {
						setClicked(!clicked);
					}}
					className="flex w-full cursor-pointer items-center gap-[12px]"
				>
					<div className="text-[#535862] text-wrap text-[14px]">
						{investor.phone}
					</div>
				</div>

				<div className="flex w-full items-center gap-[12px]">
					<div className="text-[#535862] text-wrap  text-[14px]">
						{investor.deposits.reduce(
							(acc, deposit) => acc + deposit.amount,
							0
						)}
					</div>
				</div>
				<div className="flex items-center justify-end lg:justify-between w-full gap-[12px]">
					<div className="text-[#535862] text-wrap hidden lg:flex text-[14px]">
						{investor.address || "N/A"}
					</div>
					{loading ? (
						<Spin size="large" />
					) : (
						<button
							onClick={handleDelete}
							className=" hover:opacity-70 h-[20px] w-[20px] flex items-center gap-1 font-semibold rounded-[8px]"
							name="Delete"
							title="Delete"
						>
							<Image
								src="/assets/Icons/trash-01.svg"
								alt="delete"
								width={20}
								height={20}
							/>
						</button>
					)}
				</div>
			</div>
			{clicked &&
				investor.deposits.map((deposit, idx) => (
					<div
						className={`w-full ${
							index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
						} flex p-[12px] hover:bg-slate-50 border-t border-x items-center justify-start `}
						key={idx}
					>
						<div className="flex w-full items-center gap-[12px]">
							<div className="text-[#535862] text-wrap text-[14px]">
								{new Date(deposit.date).toLocaleDateString()}
							</div>
						</div>
						<div className="flex items-center gap-[12px]">
							<div className="text-[#181D27] text-wrap text-[14px]">
								{deposit.amount}
							</div>
						</div>
					</div>
				))}
		</div>
	);
}

interface Person {
	name?: string;
	phone: string;
	deposits: number[];
	address?: string;
}

function TopTitle({
	router,
	search_trigger,
	setSearchTrigger,
}: {
	router: AppRouterInstance;
	search_trigger: boolean;
	setSearchTrigger: (trigger: boolean) => void;
}) {
	const [investors, setInvestors] = useState<Person[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (investors.length <= 0) {
			return;
		}

		async function addInvestors() {
			setLoading(true);
			const response = await fetch("/api/agent/add-investors", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					persons: investors,
				}),
			});
			const data = await response.json();
			if (response.ok) {
				toast.success(data.message);
				setInvestors([]);
				setSearchTrigger(!search_trigger);
			} else {
				toast.error(data.message);
			}
			setLoading(false);
		}

		addInvestors();
	}, [investors]);

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const data = new Uint8Array(e.target?.result as ArrayBuffer);
				const workbook = XLSX.read(data, { type: "array" });
				const sheetName = workbook.SheetNames[0];
				const sheet = workbook.Sheets[sheetName];
				const rows: any[] = XLSX.utils.sheet_to_json(sheet);

				const updatedInvestors: { [phone: string]: Person } = {};

				rows.forEach((row) => {
					const phone = row.phone
						?.toString()
						.replace(/^.*?(0)/, "$1");
					const deposit =
						row.deposit && !isNaN(row.deposit)
							? Number(row.deposit)
							: null;

					if (phone && deposit !== null) {
						if (!updatedInvestors[phone]) {
							updatedInvestors[phone] = {
								name: row.name || "",
								phone,
								deposits: [deposit],
								address: row.address || "",
							};
						} else {
							updatedInvestors[phone].deposits.push(deposit);
						}
					}
				});

				setInvestors(Object.values(updatedInvestors));
			};
			reader.readAsArrayBuffer(file);
		}
	};

	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#535862] text-[24px]">
					Co-Investors
				</div>
			</div>
			{loading && (
				<div className="flex gap-[12px] flex-col md:flex-row">
					<Spin size="large" />
				</div>
			)}
			{!loading && (
				<div className="flex gap-[12px] flex-col md:flex-row">
					<input
						type="file"
						accept=".xlsx"
						onChange={handleFileUpload}
						className="hidden"
						id="file-upload"
					/>
					<label
						htmlFor="file-upload"
						className="border flex gap-1 items-center justify-center hover:bg-slate-50 h-fit font-semibold py-[10px] px-[14px] rounded-[8px] cursor-pointer"
					>
						<Image
							src="/assets/Icons/upload-cloud-02.svg"
							alt="upload"
							width={20}
							height={20}
						/>
						<div>Import Co-Investor List</div>
					</label>
				</div>
			)}
		</div>
	);
}

function SearchBar({
	search_text,
	setSearchText,
	handleSearch,
}: {
	search_text: string;
	setSearchText: (text: string) => void;
	handleSearch: () => void;
}) {
	return (
		<div className="w-full flex md:flex-row flex-col h-fit justify-between gap-[20px]">
			<div className="w-full font-semibold text-[#181D27] text-[18px]">
				List
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
	);
}

function SortingBar() {
	return (
		<div className="w-full flex rounded-[12px] p-[12px] items-center bg-[#FAFAFA] justify-between">
			<div className="w-full hidden lg:flex text-[12px] font-semibold text-[#717680]">
				Name
			</div>
			<div
				className={`w-full text-[#717680] text-[12px] items-center font-semibold `}
			>
				Phone
			</div>
			<div
				className={`w-full  text-[#717680] text-[12px] items-center font-semibold  `}
			>
				Deposit
			</div>
			<div
				className={`w-full lg:hidden text-[#717680] text-end justify-end text-[12px] items-center font-semibold  `}
			>
				Action
			</div>
			<div
				className={`w-full hidden lg:flex text-[#717680] text-[12px] items-center  font-semibold  `}
			>
				Address
			</div>
		</div>
	);
}
