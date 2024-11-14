"use client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { useUser } from "@clerk/nextjs";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { X } from "lucide-react";

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
	duration: number;
	start_date: Date;
}

export default function Page() {
	const router = useRouter();
	const { eventId } = useParams();
	const [loading, setLoading] = useState(false);
	const [banks, setBanks] = useState<Bank[]>([]);
	const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
	const { user } = useUser();
	const [event, setEvent] = useState<Event | null>(null);

	useEffect(() => {
		async function fetchEvent() {
			try {
				setLoading(true);
				const id = user?.id;
				const res = await fetch(`/api/agent/get-trans`);
				const data = await res.json();
				if (res.ok) {
					setBanks(data);
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
			<TopTitle router={router} />
			<div className="flex flex-col gap-4 w-full lg:flex-row items-start justify-start lg:justify-between">
				<div className="w-full flex flex-col gap-[12px]">
					{banks.map((bank) => (
						<BankCard
							key={bank._id}
							bank={bank}
							selectedBank={selectedBank}
							setSelectedBank={setSelectedBank}
							event={event}
						/>
					))}
				</div>
				<div className="w-full lg:w-96">
					<AddAmount
						selectedBank={selectedBank}
						router={router}
						eventId={eventId}
						event={event}
					/>
				</div>
			</div>
		</div>
	);
}

function AddAmount({
	selectedBank,
	router,
	eventId,
	event,
}: {
	selectedBank: Bank | null;
	router: AppRouterInstance;
	eventId: any;
	event: Event | null;
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
			toast.error("Amount is required");
			return;
		}

		if (
			event?.minimum_deposit !== undefined &&
			parseInt(amount) < event.minimum_deposit
		) {
			toast.error("Minimum deposit is required");
			return;
		}

		if (!profile_picture) {
			toast.error("Image is required");
			return;
		}
		if (!selectedBank) {
			toast.error("Bank is required");
			return;
		}

		setLoading(true);
		const response = await fetch("/api/agent/get-trans", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				amount,
				picture: profile_picture_url,
				bank_account_number: selectedBank.bank_account_number,
				routing_number: selectedBank.routing_number,
				bank_account_holder_name: selectedBank.bank_account_holder_name,
				bank_name: selectedBank.bank_name,
				bank_district: selectedBank.bank_district,
				bank_branch: selectedBank.bank_branch,
				eventId,
			}),
		});
		const data = await response.json();
		if (response.ok) {
			toast.success("Transaction successful");
			setAmount("");
			setProfilePicture(undefined);
			setProfilePictureUrl(undefined);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}

	return (
		<div className="h-full flex flex-col rounded-lg border">
			<div className="flex p-[14px] border-b h-full flex-col gap-[18px]">
				<>
					<div className="text-[#414651] font-[500]">Amount *</div>
					<div className="text-[#414651] border-2 h-full font-[500] flex items-center rounded-lg">
						<div className="text-2xl px-[14px] py-[4px] h-full border-r-2 font-bold">
							৳
						</div>
						<div className="h-full w-full">
							<input
								type="number"
								className="w-full h-full px-4 py-2 outline-none focus:ring-2 focus:ring-[#414651]"
								placeholder="Enter amount"
								value={amount}
								onChange={(e) => setAmount(e.target.value)}
							/>
						</div>
					</div>
				</>

				<div className="border-2 border-[#6941C6] rounded-lg p-2 flex flex-col gap-1">
					<div className="text-[#414651] font-[500]">
						Account : {selectedBank?.bank_account_number}
					</div>
					<div className="text-[#535862]">
						Routing : {selectedBank?.routing_number}
					</div>
					<div className="text-[#414651] font-semibold">
						{selectedBank?.bank_name}
					</div>
				</div>
				<div
					onClick={() =>
						router.push(
							`/dashboard/agent/events/${eventId}/transaction/add-bank`
						)
					}
					className="text-[#535862] cursor-pointer hover:text-[#6c7380] font-semibold"
				>
					+ Add new Bank Account
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
					: "border-[#E0E0E0]"
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
							<div>Account Holder</div>
							<div>Routing Number</div>
							<div>Account Number</div>
							<div>Branch Name</div>
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
							toast.success("Copied to clipboard");
						}}
						className="text-[#6941C6] flex gap-1 cursor-pointer py-2 font-semibold hover:text-[#5a38aa]"
					>
						<Image
							src="/assets/Icons/copy-07.svg"
							width={20}
							height={20}
							alt="Copy"
						/>
						<div>Copy Info</div>
					</div>
				</div>
				<div className="flex flex-col w-full lg:max-w-32">
					<div className="text-[#717680] w-full text-[14px] font-semibold">
						Min. Investment
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

function TopTitle({ router }: { router: AppRouterInstance }) {
	return (
		<div className="w-full flex md:flex-row flex-col justify-between gap-[20px]">
			<div className="pb-[20px]">
				<div className="font-semibold text-[#181D27] text-[24px]">
					Transaction
				</div>
				<div className=" text-[#535862] text-[16px]">
					You can choose any of the bank accounts below to send your
					investment
				</div>
			</div>
		</div>
	);
}
