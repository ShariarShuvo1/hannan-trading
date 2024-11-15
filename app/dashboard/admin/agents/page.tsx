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
	const [days, setDays] = useState(365);

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

	useEffect(() => {
		fetchEvents();
	}, [page, search_trigger]);

	async function handleSearch() {
		setPage(1);
		setSearchTrigger(!search_trigger);
	}

	return (
		<div className="py-[32px] bg-white h-full overflow-y-auto px-[24px]  w-full flex flex-col gap-[24px]">
			<TopTitle router={router} />

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
									agents={agents}
									setAgents={setAgents}
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
	agent,
	agents,
	setAgents,
	index,
}: {
	agent: Agent;
	index: number;
	agents: Agent[];
	setAgents: (agents: Agent[]) => void;
}) {
	const [loading, setLoading] = useState(false);
	async function handleDelete() {
		setLoading(true);
		const response = await fetch("/api/admin/funds/get-agents", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				agentId: agent._id,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			toast.success(data.message);
			const temp = [...agents];
			temp.splice(index, 1);
			setAgents(temp);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}
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

			{loading ? (
				<Spin size="large" />
			) : (
				<button
					onClick={handleDelete}
					className=" hover:opacity-70 h-[20px] w-full justify-end flex items-center gap-1 font-semibold rounded-[8px]"
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
	);
}

function TopTitle({ router }: { router: AppRouterInstance }) {
	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#535862] text-[24px]">
					Agents
				</div>
				<div className=" text-[#535862] text-[16px]">
					Manage All the Agents Investing With You.
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
					Agents
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
			<div className="w-full justify-between lg:justify-end px-4 pb-2 border-b mt-2 flex md:flex-row flex-col  items-center gap-[20px]">
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
			<div className="w-full font-semibold ">Agents</div>
			<div className="w-full hidden lg:flex font-semibold ">Email</div>
			<div className="w-full font-semibold text-end ">Action</div>
		</div>
	);
}
