"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Spin } from "antd";

interface Event {
	_id: string;
	name: string;
	tagline: string;
	banner: string;
	roi: number;
	minimum_deposit: number;
	duration: number;
	start_date: Date;
}

export default function Events() {
	const router = useRouter();
	const [search_text, setSearchText] = useState("");
	const [page, setPage] = useState(1);
	const [roi_based_sorting, setRoiBasedSorting] = useState("asc");
	const [date_based_sorting, setDateBasedSorting] = useState("desc");
	const [events, setEvents] = useState<Event[]>([]);
	const [loading, setLoading] = useState(false);
	const [totalPages, setTotalPages] = useState(0);
	const [search_trigger, setSearchTrigger] = useState(false);

	const fetchEvents = async () => {
		setLoading(true);
		const response = await fetch("/api/admin/events/get-all-events", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				page,
				roi_based_sorting,
				date_based_sorting,
				search_text,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			setEvents(data.events);
			setTotalPages(data.totalPages);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		fetchEvents();
	}, [page, roi_based_sorting, date_based_sorting, search_trigger]);

	async function handleSearch() {
		setPage(1);
		setSearchTrigger(!search_trigger);
	}

	return (
		<div className="py-[32px] bg-white h-full overflow-y-auto px-[24px] pb-4 w-full flex flex-col gap-[32px]">
			<TopTitle router={router} />
			<SearchBar
				search_text={search_text}
				setSearchText={setSearchText}
				handleSearch={handleSearch}
			/>
			<SortingBar
				roi_based_sorting={roi_based_sorting}
				setRoiBasedSorting={setRoiBasedSorting}
				date_based_sorting={date_based_sorting}
				setDateBasedSorting={setDateBasedSorting}
			/>

			<div className="w-full">
				{loading && (
					<div className="w-full flex justify-center items-center">
						<Spin size="large" />
					</div>
				)}
				{!loading &&
					events &&
					events.map((event, index) => (
						<RowCard
							key={index}
							event={event}
							index={index}
							router={router}
							events={events}
							setEvents={setEvents}
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
	event,
	index,
	router,
	events,
	setEvents,
}: {
	event: Event;
	index: number;
	router: AppRouterInstance;
	events: Event[];
	setEvents: (events: Event[]) => void;
}) {
	const [loading, setLoading] = useState(false);
	async function handleDelete() {
		setLoading(true);
		const response = await fetch("/api/admin/events/create-event", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				eventId: event._id,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			toast.success(data.message);
			const temp = [...events];
			temp.splice(index, 1);
			setEvents(temp);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}
	return (
		<div
			className={`w-full flex p-[12px] items-center border-b justify-between ${
				index % 2 === 0 ? "bg-white" : "bg-[#FAFAFA]"
			}`}
		>
			<div className="flex w-full items-center gap-[12px]">
				<img
					src={event.banner}
					alt={event.name}
					width={40}
					height={40}
					className="rounded-full aspect-square object-cover"
				/>
				<div className="text-[#181D27] text-wrap font-[500] text-[14px]">
					{event.name}
				</div>
			</div>
			<div className="md:flex hidden w-full items-center gap-[4px]">
				<Badge text={event.roi.toString() + "% ROI"} />
				<Badge
					text={`Min. Amount: ৳` + event.minimum_deposit.toString()}
					color="#2E90FA"
				/>
				<Badge
					text={"Duration: " + event.duration.toString() + " Months"}
					color="#17B26A"
				/>
			</div>

			<div className="flex items-center justify-between w-full ">
				<div className="text-[#535862] text-[14px]">
					{new Date(event.start_date).toLocaleDateString("en-US", {
						month: "short",
						day: "numeric",
						year: "numeric",
					})}
				</div>

				<div className="flex items-center gap-[32px]">
					<Image
						src="/assets/Icons/edit-04.svg"
						alt="edit"
						width={20}
						height={20}
						className="cursor-pointer hover:opacity-70"
						onClick={() =>
							router.push(
								`/dashboard/admin/events/edit-event/${event._id}`
							)
						}
					/>
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
			</div>
		</div>
	);
}

function Badge({ text, color }: { text: string; color?: string }) {
	return (
		<div
			className={`rounded-[8px] px-[8px] border border-[#D5D7DA] flex gap-[4px] items-center px[6px] py-[2px] text-[#414651] font-[500] text-[12px]`}
		>
			<div
				className={`h-[8px] w-[8px] ${
					color ? `bg-[${color}]` : "bg-violet-500"
				} rounded-full`}
			></div>
			<div>{text}</div>
		</div>
	);
}

function TopTitle({ router }: { router: AppRouterInstance }) {
	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#535862] text-[24px]">
					Events
				</div>
				<div className="text-[#535862]">Manage All of Your Events.</div>
			</div>
			<button
				onClick={() =>
					router.push("/dashboard/admin/events/create-event")
				}
				className="bg-[#7F56D9] text-white h-fit font-semibold py-[10px] px-[14px] rounded-[8px]"
			>
				+ Create Event
			</button>
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
				All Events
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

function SortingBar({
	roi_based_sorting,
	setRoiBasedSorting,
	date_based_sorting,
	setDateBasedSorting,
}: {
	roi_based_sorting: string;
	setRoiBasedSorting: (value: string) => void;
	date_based_sorting: string;
	setDateBasedSorting: (value: string) => void;
}) {
	return (
		<div className="w-full flex rounded-[12px] p-[12px] items-center bg-[#FAFAFA]  justify-between">
			<div className="w-full text-[12px] font-semibold text-[#6941C6]">
				Event Name
			</div>
			<div
				className={`w-full hidden text-[12px] items-center font-semibold md:flex gap-[4px] ${
					roi_based_sorting === "asc"
						? "text-[#6941C6]"
						: "text-[#717680]"
				} `}
				title={`Sort by ${
					roi_based_sorting === "asc" ? "descending" : "ascending"
				}`}
			>
				<div>Investment Factors</div>
				<Image
					src="/assets/Icons/chevron-selector-vertical.svg"
					alt="search"
					width={12}
					height={12}
					onClick={() => {
						setRoiBasedSorting(
							roi_based_sorting === "asc" ? "desc" : "asc"
						);
						setDateBasedSorting("asc");
					}}
					className="cursor-pointer"
				/>
			</div>
			<div
				className={`w-full hidden text-[12px] items-center font-semibold md:flex gap-[4px] ${
					date_based_sorting === "asc"
						? "text-[#6941C6]"
						: "text-[#717680]"
				}`}
				title={`Sort by ${
					date_based_sorting === "asc" ? "descending" : "ascending"
				}`}
			>
				<div>Date added</div>
				<Image
					src="/assets/Icons/chevron-selector-vertical.svg"
					alt="search"
					width={12}
					height={12}
					onClick={() => {
						setDateBasedSorting(
							date_based_sorting === "asc" ? "desc" : "asc"
						);
						setRoiBasedSorting("asc");
					}}
					className="cursor-pointer"
				/>
			</div>
		</div>
	);
}
