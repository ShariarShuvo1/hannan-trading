"use client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { X } from "lucide-react";
import "./styles.css";

interface Bank {
	_id: string;
	bank_account_number: string;
	bank_account_holder_name: string;
	bank_name: string;
	bank_district: string;
	bank_branch: string;
	routing_number: string;
}

interface Event {
	_id: string;
	name: string;
	tagline: string;
	banner: string;
	roi: number;
	minimum_deposit: number;
	maximum_deposit: number;
	duration: number;
	start_date: Date;
}

interface Investor {
	name: string;
	nid: string;
	nominee_name: string;
	nominee_nid: string;
	payment_method: string;
	date: Date;
	amount: number;
	percentage: number;
}

interface Transaction {
	event: Event;
	agent_bank_info: Bank;
	admin_bank_info: Bank;
	amount: number;
	picture: string;
	investors: Investor[];
}

export default function Page() {
	const router = useRouter();
	const { eventId } = useParams();
	const [loading, setLoading] = useState(false);
	const [banks, setBanks] = useState<Bank[]>([]);
	const [adminBanks, setAdminBanks] = useState<Bank[]>([]);
	const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
	const [selectedAgentBank, setSelectedAgentBank] = useState<Bank | null>(
		null
	);
	const [investors, setInvestors] = useState<Investor[]>([]);
	const [event, setEvent] = useState<Event | null>(null);
	const [currentlySelectedMode, setCurrentlySelectedMode] =
		useState<string>("transaction");

	useEffect(() => {
		async function fetchEvent() {
			try {
				setLoading(true);
				const res = await fetch(`/api/agent/get-trans`);
				const data = await res.json();
				if (res.ok) {
					setBanks(data);
					setSelectedAgentBank(data[0]);
				} else {
					toast.error(data.message);
				}
			} catch (error) {
				toast.error("Failed to fetch event");
			}
			setLoading(false);
		}
		fetchEvent();
	}, [eventId]);

	useEffect(() => {
		async function fetchEvent() {
			try {
				setLoading(true);
				const res = await fetch(`/api/agent/get-admin-bank`);
				const data = await res.json();
				if (res.ok) {
					setAdminBanks(data);
					setSelectedBank(data[0]);
				} else {
					toast.error(data.message);
				}
			} catch (error) {
				toast.error("Failed to fetch event");
			}
			setLoading(false);
		}
		fetchEvent();
	}, [eventId]);

	useEffect(() => {
		async function fetchEvent() {
			try {
				setLoading(true);
				const res = await fetch(`/api/agent/events/${eventId}`);
				const data = await res.json();
				setEvent(data);
				setLoading(false);
			} catch (error) {
				toast.error("Failed to fetch event");
			}
		}
		fetchEvent();
	}, [eventId]);

	return (
		<div className="py-[32px] bg-white h-full overflow-y-auto px-[24px] w-full flex flex-col gap-[24px]">
			{loading && <Spin fullscreen size="large" />}
			<Navigation router={router} event={event} />
			{currentlySelectedMode === "transaction" && <TopTitle />}
			{currentlySelectedMode === "investor" && <TopTitleTwo />}

			<div className="flex flex-col gap-4 w-full lg:flex-row items-start justify-start lg:justify-between">
				{currentlySelectedMode === "transaction" && (
					<div className="w-full flex flex-col gap-[12px]">
						{adminBanks.map((adminBank) => (
							<BankCard
								key={adminBank._id}
								bank={adminBank}
								selectedBank={selectedBank}
								setSelectedBank={setSelectedBank}
								event={event}
							/>
						))}
					</div>
				)}

				{currentlySelectedMode === "investor" && (
					<AddInvestor
						setCurrentlySelectedMode={setCurrentlySelectedMode}
						investors={investors}
						setInvestors={setInvestors}
					/>
				)}

				<div className="w-full lg:w-96">
					<AddAmount
						currentlySelectedMode={currentlySelectedMode}
						setCurrentlySelectedMode={setCurrentlySelectedMode}
						selectedAgentBank={selectedAgentBank}
						setSelectedAgentBank={setSelectedAgentBank}
						investors={investors}
						setInvestors={setInvestors}
						selectedBank={selectedBank}
						setSelectedBank={setSelectedBank}
						router={router}
						eventId={eventId}
						event={event}
						banks={banks}
					/>
				</div>
			</div>
		</div>
	);
}

function AddInvestor({
	setCurrentlySelectedMode,
	investors,
	setInvestors,
}: {
	setCurrentlySelectedMode: (mode: string) => void;
	investors: Investor[];
	setInvestors: (investors: Investor[]) => void;
}) {
	const [name, setName] = useState<string>("");
	const [nid, setNid] = useState<string>("");
	const [nominee_name, setNomineeName] = useState<string>("");
	const [nominee_nid, setNomineeNid] = useState<string>("");
	const [payment_method, setPaymentMethod] = useState<string>("bank");
	const [date, setDate] = useState<Date>(new Date());
	const [amount, setAmount] = useState<string>("");
	const [percentage, setPercentage] = useState<string>("");

	function add_investor() {
		if (
			!name ||
			!nid ||
			!nominee_name ||
			!nominee_nid ||
			!payment_method ||
			!date ||
			!amount ||
			!percentage
		) {
			toast.error("সব কয়টি বক্স পূরণ করুন");
			return;
		}
		if (payment_method !== "bank" && payment_method !== "bkash") {
			toast.error("ভুল পেমেন্ট মেথড");
			return;
		}
		const newInvestor = {
			name,
			nid,
			nominee_name,
			nominee_nid,
			payment_method,
			date,
			amount: parseInt(amount),
			percentage: parseInt(percentage),
		};
		setInvestors([...investors, newInvestor]);
		setName("");
		setNid("");
		setNomineeName("");
		setNomineeNid("");
		setPaymentMethod("bank");
		setDate(new Date());
		setAmount("");
		setPercentage("");
	}

	return (
		<div className="h-full flex-col space-y-[20px] overflow-y-auto w-full">
			<div className="flex flex-col gap-[20px]">
				<div className="flex flex-col gap-[6px]">
					<div className="text-[#414651]">কো-ইনভেস্টরের নাম *</div>
					<input
						type="text"
						className="border border-[#D5D7DA] rounded-lg px-[14px] py-[10px]"
						placeholder="ইনভেস্টরের নাম দিন"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-[6px]">
					<div className="text-[#414651]">
						জাতীয় পরিচয় পত্র নং *
					</div>
					<input
						type="text"
						className="border border-[#D5D7DA] rounded-lg px-[14px] py-[10px]"
						placeholder="জাতীয় পরিচয় পত্র নং দিন"
						value={nid}
						onChange={(e) => setNid(e.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-[6px]">
					<div className="text-[#414651]">নমিনির নাম *</div>
					<input
						type="text"
						className="border border-[#D5D7DA] rounded-lg px-[14px] py-[10px]"
						placeholder="নমিনির নাম দিন"
						value={nominee_name}
						onChange={(e) => setNomineeName(e.target.value)}
					/>
				</div>

				<div className="flex flex-col gap-[6px]">
					<div className="text-[#414651]">
						নমিনির জাতীয় পরিচয় পত্র নং *
					</div>
					<input
						type="text"
						className="border border-[#D5D7DA] rounded-lg px-[14px] py-[10px]"
						placeholder="নমিনির জাতীয় পরিচয় পত্র নং দিন"
						value={nominee_nid}
						onChange={(e) => setNomineeNid(e.target.value)}
					/>
				</div>

				<div className="flex flex-col items-center lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
					<div className="flex w-full flex-col gap-[6px]">
						<div className="text-[#414651]">পেমেন্ট মেথড *</div>
						<select
							name="payment_method"
							title="payment_method"
							className="border border-[#D5D7DA] rounded-lg px-[14px] py-[10px]"
							value={payment_method}
							onChange={(e) => setPaymentMethod(e.target.value)}
						>
							<option value="bank">ব্যাংক</option>
							<option value="bkash">বিকাশ</option>
						</select>
					</div>

					<div className="flex w-full flex-col gap-[6px]">
						<div className="text-[#414651]">জমার তারিখ *</div>
						<input
							type="date"
							name="date"
							title="date"
							className="border border-[#D5D7DA] rounded-lg px-[14px] py-[8px]"
							value={date.toISOString().split("T")[0]}
							onChange={(e) => setDate(new Date(e.target.value))}
						/>
					</div>
				</div>
				<div className="flex flex-col items-center lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 w-full">
					<div className="flex w-full flex-col gap-[6px]">
						<div className="text-[#414651]">পরিমাণ *</div>
						<input
							type="number"
							className="border border-[#D5D7DA] rounded-lg px-[14px] py-[10px]"
							placeholder="পরিমাণ দিন"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
						/>
					</div>

					<div className="flex w-full flex-col gap-[6px]">
						<div className="text-[#414651]"> % পারছেন্টেজ *</div>
						<input
							type="number"
							className="border border-[#D5D7DA] rounded-lg px-[14px] py-[10px]"
							placeholder=" % পারছেন্টেজ দিন"
							value={percentage}
							onChange={(e) => setPercentage(e.target.value)}
						/>
					</div>
				</div>

				<div className="flex border-b justify-end gap-4 p-4">
					<button
						onClick={() => setCurrentlySelectedMode("transaction")}
						className="hover:bg-slate-50 border text-black rounded-lg px-[14px] py-[6px] font-semibold"
					>
						Cancel
					</button>
					<button
						onClick={add_investor}
						className="bg-[#6941C6] hover:bg-[#5d39af] text-white rounded-lg px-[14px] py-[6px] font-semibold"
					>
						Add
					</button>
				</div>
			</div>
			<div className="flex w-full flex-col gap-[16px]">
				<div className="w-full text-center border-b gap-4 hidden lg:grid lg:grid-cols-9">
					{[
						"নাম",
						"জাতীয় পরিচয় পত্র নং",
						"নমিনির নাম",
						"নমিনির জাতীয় পরিচয় পত্র নং",
						"পেমেন্ট মেথড",
						"জমার তারিখ",
						"পরিমাণ",
						"% পারছেন্টেজ",
						"ডিলিট",
					].map((title, index) => (
						<div
							key={index}
							className="text-[#717680] text-[12px] font-semibold"
						>
							{title}
						</div>
					))}
				</div>
				{investors.map((investor, index) => (
					<div
						key={index}
						className="w-full pb-[16px] border-b text-[14px] flex flex-col gap-4"
					>
						<div className="lg:hidden flex flex-col gap-2">
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									নাম
								</span>
								<span className="text-[#181D27] font-semibold">
									{investor.name}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									জাতীয় পরিচয় পত্র নং
								</span>
								<span className="text-[#717680] font-semibold">
									{investor.nid}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									নমিনির নাম
								</span>
								<span className="text-[#181D27] font-semibold">
									{investor.nominee_name}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									নমিনির জাতীয় পরিচয় পত্র নং
								</span>
								<span className="text-[#717680] font-semibold">
									{investor.nominee_nid}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									পেমেন্ট মেথড
								</span>
								<span className="text-[#717680] font-semibold">
									{investor.payment_method}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									জমার তারিখ
								</span>
								<span className="text-[#717680] font-semibold">
									{new Date(
										investor.date
									).toLocaleDateString()}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									পরিমাণ
								</span>
								<span className="text-[#717680] font-semibold">
									{investor.amount}
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									% পারছেন্টেজ
								</span>
								<span className="text-[#717680] font-semibold">
									{investor.percentage}%
								</span>
							</div>
							<div className="flex justify-between">
								<span className="text-[#717680] font-semibold">
									ডিলিট
								</span>
								<button
									onClick={() => {
										const newInvestors = investors.filter(
											(inv) => inv !== investor
										);
										setInvestors(newInvestors);
									}}
									className="text-[#ff2020] hover:text-[#962d2d] font-semibold"
									title="Delete"
								>
									Delete
								</button>
							</div>
						</div>
						<div className="hidden lg:text-center lg:grid lg:grid-cols-9 gap-4">
							<div className="text-[#181D27] font-semibold">
								{investor.name}
							</div>
							<div className="text-[#717680] font-semibold">
								{investor.nid}
							</div>
							<div className="text-[#181D27] font-semibold">
								{investor.nominee_name}
							</div>
							<div className="text-[#717680] font-semibold">
								{investor.nominee_nid}
							</div>
							<div className="text-[#717680] font-semibold">
								{investor.payment_method}
							</div>
							<div className="text-[#717680] font-semibold">
								{new Date(investor.date).toLocaleDateString()}
							</div>
							<div className="text-[#717680] font-semibold">
								{investor.amount}
							</div>
							<div className="text-[#717680] font-semibold">
								{investor.percentage}%
							</div>
							<button
								onClick={() => {
									const newInvestors = investors.filter(
										(inv) => inv !== investor
									);
									setInvestors(newInvestors);
								}}
								className="text-[#ff2020] hover:text-[#962d2d] font-semibold"
								title="Delete"
							>
								Delete
							</button>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

function AddAmount({
	currentlySelectedMode,
	setCurrentlySelectedMode,
	selectedAgentBank,
	setSelectedAgentBank,
	investors,
	setInvestors,
	selectedBank,
	setSelectedBank,
	router,
	eventId,
	event,
	banks,
}: {
	currentlySelectedMode: string;
	setCurrentlySelectedMode: (mode: string) => void;
	selectedAgentBank: Bank | null;
	setSelectedAgentBank: (bank: Bank | null) => void;
	investors: Investor[];
	setInvestors: (investors: Investor[]) => void;
	selectedBank: Bank | null;
	setSelectedBank: (bank: Bank | null) => void;
	router: AppRouterInstance;
	eventId: any;
	event: Event | null;
	banks: Bank[];
}) {
	const [profile_picture, setProfilePicture] = useState<File | undefined>(
		undefined
	);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [profile_picture_url, setProfilePictureUrl] = useState<
		string | undefined
	>(undefined);
	const [loadingImg, setLoadingImg] = useState(false);
	const [amount, setAmount] = useState<string>("");

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};
	const [loading, setLoading] = useState(false);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file: File | undefined = e.target.files?.[0];
		if (file) {
			setProfilePicture(file);
			setLoadingImg(true);
			const data = new FormData();
			data.append("file", file);
			data.append("upload_preset", "x3grukq5");
			const res = await fetch(`/api/imgUpload`, {
				method: "POST",
				body: data,
			});
			const imageResponse = await res.json();
			if (imageResponse.status === 200) {
				setProfilePictureUrl(imageResponse.uploadedImageData.url);
			} else {
				toast.error("Failed to upload image");
				setProfilePicture(undefined);
			}
			setLoadingImg(false);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => setIsDragging(false);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) {
			setProfilePicture(file);
		}
	};

	async function deletePP(e: React.MouseEvent<SVGElement, MouseEvent>) {
		setLoadingImg(true);
		if (!profile_picture_url) {
			toast.error("No image to delete");
			setLoadingImg(false);
			return;
		}
		const res = await fetch(`/api/imgUpload/?url=${profile_picture_url}`, {
			method: "DELETE",
		});
		const deletedImageData = await res.json();
		if (deletedImageData.status === 200) {
			setProfilePicture(undefined);
			setProfilePictureUrl(undefined);
		} else {
			toast.error("Failed to delete image");
		}
		setLoadingImg(false);
	}

	async function handleSubmit(e: any) {
		e.preventDefault();
		if (!amount) {
			toast.error("পরিমাণ দিন");
			return;
		}

		if (
			event?.minimum_deposit !== undefined &&
			parseInt(amount) < event.minimum_deposit
		) {
			toast.error(
				"আপনি সর্বনিম্ন আমানতের চেয়ে কম পরিমাণ আমানত করতে পারবেন না"
			);
			return;
		}

		if (
			event?.maximum_deposit !== undefined &&
			parseInt(amount) > event.maximum_deposit
		) {
			toast.error(
				"আপনি সর্বোচ্চ আমানতের চেয়ে বেশি পরিমাণ আমানত করতে পারবেন না"
			);
			return;
		}

		if (!profile_picture) {
			toast.error("ছবি আপলোড করুন");
			return;
		}
		if (!selectedBank) {
			toast.error("প্রাপকের একাউন্ট নির্বাচন করুন");
			return;
		}

		if (!selectedAgentBank) {
			toast.error("এজেন্টের একাউন্ট নির্বাচন করুন");
			return;
		}

		if (investors.length === 0) {
			toast.error("কমপক্ষে একজন ইনভেস্টর যোগ করুন");
			return;
		}

		if (!profile_picture_url) {
			toast.error("ছবি আপলোড করুন");
			return;
		}

		if (!event) {
			toast.error("ইভেন্ট নির্বাচন করুন");
			return;
		}

		const body: Transaction = {
			event: event,
			agent_bank_info: selectedAgentBank,
			admin_bank_info: selectedBank,
			amount: parseInt(amount),
			picture: profile_picture_url,
			investors,
		};

		setLoading(true);
		const response = await fetch("/api/agent/get-trans", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ trans: body }),
		});
		const data = await response.json();
		if (response.ok) {
			toast.success("Transaction successful");
			setAmount("");
			setSelectedAgentBank(banks[0]);
			setSelectedBank(banks[0]);
			setProfilePicture(undefined);
			setProfilePictureUrl(undefined);
			setInvestors([]);
			router.back();
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}

	return (
		<div className="h-full flex flex-col rounded-lg border">
			<div className="flex p-[14px] border-b h-full flex-col gap-[18px]">
				<div className=" h-fit ">
					<div className="text-[#414651] font-[500]">পরিমাণ *</div>
					<div className="text-[#414651] border-2 h-fit font-[500] flex items-center rounded-lg">
						<div className="text-2xl px-[14px] py-[4px] h-full border-r-2 font-bold">
							৳
						</div>
						<div className="h-fit w-full">
							<input
								type="number"
								className="w-full h-fit px-4 py-2 outline-none focus:ring-2 focus:ring-[#414651]"
								placeholder="পরিমাণ দিন"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</div>
					</div>
				</div>
				<div className="flex gap-1 flex-col">
					<div className="text-[#414651] font-[600]">
						এজেন্টের একাউন্ট *
					</div>
					<div className="max-h-64 border rounded-lg p-2 overflow-y-auto custom-scrollbar flex flex-col gap-2 select-none">
						{banks.length > 0 &&
							banks.map((bank) => (
								<div
									onClick={() => {
										setSelectedAgentBank(bank);
									}}
									className={`border-2 cursor-pointer rounded-lg p-2 flex flex-col gap-1 ${
										selectedAgentBank?._id === bank._id
											? "border-[#6941C6]"
											: "border-[#E9EAEB] hover:border-[#b29ae7]"
									}`}
									key={bank._id}
								>
									<div className="text-[#414651] font-[500]">
										একাউন্টঃ {bank?.bank_account_number}
									</div>
									<div className="text-[#535862]">
										রাউটিংঃ {bank?.routing_number}
									</div>
									<div className="text-[#414651] font-semibold">
										{bank?.bank_name}
									</div>
								</div>
							))}
					</div>
				</div>

				<div
					onClick={() =>
						router.push(`/dashboard/agent/home/add-bank`)
					}
					className="text-[#535862] cursor-pointer hover:text-[#6c7380] font-semibold"
				>
					+ নতুন ব্যাংক যোগ করুন
				</div>
				<form className="space-y-4">
					<>
						<div
							className={`flex flex-col gap-y-[12px] p-x[24] py-[16px] items-center text-[14px] text-[#535862] justify-center w-full border ${
								isDragging
									? "border-[#7F56D9]"
									: "border-[#E9EAEB]"
							} border rounded-[12px] bg-white hover:bg-gray-50 cursor-pointer ${
								profile_picture_url ? "hidden" : ""
							}`}
							onClick={handleUploadClick}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<div className="bg-white border p-[14px] rounded-[12px]">
								<Image
									src="/assets/Icons/upload-cloud-02.svg"
									width={20}
									height={20}
									alt="mail"
								/>
							</div>
							<div>
								<p className="text-center">
									<span className="text-[#6941C6] font-semibold">
										Click to upload
									</span>{" "}
									or drag and drop
								</p>
								<p className="text-center">
									A screen shot of the deposit you have made
								</p>
							</div>
						</div>
					</>
					<input
						title="profile_picture"
						type="file"
						ref={fileInputRef}
						className="hidden"
						accept=".svg, .png, .jpg, .jpeg, .gif"
						onChange={handleFileChange}
						multiple={false}
					/>
					{profile_picture && (
						<div className="flex p-[16px] items-center bg-white justify-between border rounded-[12px]">
							<div className="flex items-center gap-x-[12px]">
								<Image
									src={URL.createObjectURL(profile_picture)}
									width={50}
									height={50}
									alt="profile"
									className="h-full object-cover border "
								/>
								<div className="flex flex-col text-[14px]">
									<p className="text-[#414651] font-[500]">
										{profile_picture.name}
									</p>
									<p className="text-[#535862]">
										{(
											profile_picture.size /
											1024 /
											1024
										).toFixed(2)}{" "}
										MB
									</p>
								</div>
							</div>
							{loadingImg ? (
								<Spin />
							) : (
								<X
									onClick={deletePP}
									className="cursor-pointer text-[#7F56D9] hover:text-[#6847b1]"
									size={48}
								/>
							)}
						</div>
					)}
				</form>
				<div
					onClick={() => {
						if (currentlySelectedMode === "transaction") {
							setCurrentlySelectedMode("investor");
						} else {
							setCurrentlySelectedMode("transaction");
						}
					}}
					className={` flex gap-2 items-center justify-center h-fit rounded-lg py-[10px] px-[8px] text-center cursor-pointer font-semibold ${
						currentlySelectedMode === "transaction"
							? "bg-[#7F56D9] hover:bg-[#6746af] text-white"
							: "bg-[#56a5d9] hover:bg-[#4889b4] text-black"
					} `}
				>
					{currentlySelectedMode === "transaction" && (
						<>
							<Image
								src="/assets/Icons/plus-circle.svg"
								width={20}
								height={20}
								alt="Add"
							/>
							<div>কো-ইনভেস্টর যোগ করুন</div>
						</>
					)}
					{currentlySelectedMode === "investor" && (
						<>
							<Image
								src="/assets/Icons/wallet-02.svg"
								width={20}
								height={20}
								alt="wallet"
							/>
							<div>একাউন্ট সিলেক্ট করুন</div>
						</>
					)}
				</div>
				<div>
					ইনভেস্টর জোগ করেছেনঃ{" "}
					<span className="font-bold text-[#6941C6]">
						{investors.length}
					</span>{" "}
					জন
				</div>
			</div>
			{loading ? (
				<Spin size="large" />
			) : (
				<div className="flex justify-end gap-4 p-4">
					<button
						onClick={() =>
							router.push(`/dashboard/agent/events/${eventId}
                        `)
						}
						className="hover:bg-slate-50 border text-black rounded-lg px-[14px] py-[6px] font-semibold"
					>
						Cancel
					</button>
					<button
						onClick={handleSubmit}
						className="bg-[#6941C6] hover:bg-[#5d39af] text-white rounded-lg px-[14px] py-[6px] font-semibold"
					>
						Complete
					</button>
				</div>
			)}
		</div>
	);
}

function BankCard({
	bank,
	selectedBank,
	setSelectedBank,
	event,
}: {
	bank: Bank;
	selectedBank: Bank | null;
	setSelectedBank: (bank: Bank | null) => void;
	event: Event | null;
}) {
	return (
		<div
			className={`w-full flex flex-col border-2 rounded-lg ${
				selectedBank?._id === bank._id
					? "border-[#6941C6]"
					: "border-[#E0E0E0] hover:border-[#b29ae7]"
			}`}
			onClick={() => {
				setSelectedBank(bank);
			}}
		>
			<div
				className={`text-[#414651] ${
					selectedBank?._id === bank._id
						? "border-[#6941C6]"
						: "border-[#E0E0E0]"
				} border-b-2 select-none px-[20px] py-[12px] flex justify-between items-center font-semibold`}
			>
				<span>{bank.bank_name}</span>
				<input
					title="checkbox"
					type="checkbox"
					checked={selectedBank?._id === bank._id}
					readOnly
					className="h-[14px] w-[14px] border-2 rounded-lg"
				/>
			</div>
			<div className="px-[20px] py-4 flex flex-col justify-between lg:flex-row w-full lg:pe-12">
				<div className="flex flex-col gap-[12px] w-full">
					<div className="flex w-fit text-[#535862]">
						<div className="w-full hidden lg:flex flex-col gap-[12px] me-8">
							<div>একাউন্ট হোল্ডার</div>
							<div>রাউটিং নাম্বার</div>
							<div>একাউন্ট নাম্বার</div>
							<div>ব্রাঞ্চের নাম</div>
						</div>
						<div className=" max-w-[4px] hidden lg:flex flex-col gap-[12px] me-2">
							<div>:</div>
							<div>:</div>
							<div>:</div>
							<div>:</div>
						</div>
						<div className="flex flex-col gap-[12px]">
							<div>{bank.bank_account_holder_name}</div>
							<div>{bank.routing_number}</div>
							<div>{bank.bank_account_number}</div>
							<div>{bank.bank_branch}</div>
						</div>
					</div>
					<div
						onClick={() => {
							navigator.clipboard.writeText(
								`${bank.bank_name}\nAccount Holder: ${bank.bank_account_holder_name}\nRouting Number: ${bank.routing_number}\nAccount Number: ${bank.bank_account_number}\nBranch Name: ${bank.bank_branch}`
							);
							toast.success("কপি করা হয়েছে");
						}}
						className="text-[#6941C6] flex gap-1 w-fit cursor-pointer py-2 font-semibold hover:text-[#5a38aa]"
					>
						<Image
							src="/assets/Icons/copy-07.svg"
							width={20}
							height={20}
							alt="Copy"
						/>
						<div>কপি করুন</div>
					</div>
				</div>
				<div className="flex flex-col w-full lg:max-w-32">
					<div className="text-[#717680] w-full text-[14px] font-semibold">
						সর্বনিম্ন বিনিয়োগ
					</div>
					<div className="text-[#414651] text-[30px] font-semibold">
						৳{event?.minimum_deposit}
					</div>
				</div>
			</div>
		</div>
	);
}

function Navigation({
	router,
	event,
}: {
	router: AppRouterInstance;
	event: Event | null;
}) {
	return (
		<div className="lg:flex hidden gap-[8px] px-[8px] items-center">
			<Image
				src="/assets/Icons/rows-01.svg"
				width={20}
				height={20}
				alt="Event"
				onClick={() => router.push("/dashboard/agent/events")}
				className="cursor-pointer"
			/>
			<Image
				src="/assets/Icons/chevron-right.svg"
				width={20}
				height={20}
				alt="Event"
			/>
			<div
				className="font-semibold text-[#6941C6] cursor-pointer"
				onClick={() =>
					router.push(`/dashboard/agent/events/${event?._id}`)
				}
			>
				{event?.name}
			</div>
			<Image
				src="/assets/Icons/chevron-right.svg"
				width={20}
				height={20}
				alt="Event"
			/>
			<div className="font-semibold text-[#6941C6]">Transaction</div>
		</div>
	);
}

function TopTitle() {
	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#181D27] text-[24px]">
					ট্রান্সাকশন করুন
				</div>
				<div className=" text-[#535862] text-[16px]">
					আপনি নিচের ব্যাংক অ্যাকাউন্ট গুলিতে আপনার বিনিয়োগ পাঠাতে
					পারেন
				</div>
			</div>
		</div>
	);
}

function TopTitleTwo() {
	return (
		<div className="w-full border-b flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#181D27] text-[24px]">
					কো-ইনভেস্টর যোগ করুন
				</div>
				<div className=" text-[#535862] text-[16px]">
					আপনি আপনার কো-ইনভেস্টরদের তথ্য যোগ করতে পারেন
				</div>
			</div>
		</div>
	);
}
