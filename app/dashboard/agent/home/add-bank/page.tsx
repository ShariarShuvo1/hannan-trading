"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Spin } from "antd";
import Image from "next/image";

interface BankInfo {
	bank_account_number: string;
	bank_account_holder_name: string;
	bank_name: string;
	bank_district: string;
	bank_branch: string;
	routing_number: string;
	_id: string;
}

export default function AddBankPage() {
	const [bank_account_number, setBankAccountNumber] = useState("");
	const [routing_number, setRoutingNumber] = useState("");
	const [bank_account_holder_name, setBankAccountHolderName] = useState("");
	const [bank_name, setBankName] = useState("");
	const [bank_district, setBankDistrict] = useState("");
	const [bank_branch, setBankBranch] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [bankInfo, setBankInfo] = useState<BankInfo[]>([]);
	const [selectedBanks, setSelectedBanks] = useState<BankInfo[]>([]);
	const [data_loading, setDataLoading] = useState(false);

	useEffect(() => {
		async function fetchData() {
			setDataLoading(true);
			const response = await fetch("/api/agent/events/add-bank");
			const data = await response.json();
			if (response.ok) {
				setBankInfo(data);
			} else {
				toast.error(data.message);
			}
			setDataLoading(false);
		}

		fetchData();
	}, []);

	async function handleSubmit(e: any) {
		e.preventDefault();
		if (
			!bank_account_number ||
			!routing_number ||
			!bank_account_holder_name ||
			!bank_name ||
			!bank_district ||
			!bank_branch
		) {
			toast.error("All fields are required");
			return;
		}
		setLoading(true);
		const response = await fetch("/api/agent/events/add-bank", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				bank_account_number,
				routing_number,
				bank_account_holder_name,
				bank_name,
				bank_district,
				bank_branch,
			}),
		});
		const data = await response.json();

		if (response.ok) {
			toast.success(data.message);
			setBankAccountNumber("");
			setRoutingNumber("");
			setBankAccountHolderName("");
			setBankName("");
			setBankDistrict("");
			setBankBranch("");
			setSelectedBanks([]);

			setBankInfo((prev) => [...prev, data.bank]);
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}

	async function handleDelete() {
		setDataLoading(true);
		const response = await fetch("/api/agent/events/add-bank", {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ selectedBanks: selectedBanks }),
		});
		const data = await response.json();
		if (response.ok) {
			toast.success(data.message);
			setBankInfo((prev) =>
				prev.filter(
					(bank) =>
						selectedBanks.findIndex(
							(selectedBank) => selectedBank._id === bank._id
						) === -1
				)
			);
			setSelectedBanks([]);
		} else {
			toast.error(data.message);
		}
		setDataLoading(false);
	}

	return (
		<div className="py-[32px] bg-white px-8 w-full flex flex-col overflow-y-auto gap-[32px]">
			{loading && <Spin fullscreen size="large" />}
			<div className="lg:flex hidden gap-[8px] items-center">
				<Image
					src="/assets/Icons/rows-01.svg"
					width={20}
					height={20}
					alt="Event"
					onClick={() => router.back()}
					className="cursor-pointer"
				/>
				<Image
					src="/assets/Icons/chevron-right.svg"
					width={20}
					height={20}
					alt="Event"
				/>
				<div className="font-semibold text-[#6941C6]">
					Add Bank Account
				</div>
			</div>
			<div className="w-full flex flex-col gap-[20px]">
				<div className="border-b pb-[20px]">
					<div className="font-semibold text-[#181D27] text-[18px]">
						ব্যাংক একাউন্ট যোগ করুন
					</div>
					<div className="text-[#535862]">
						আপনার ব্যাংক একাউন্ট যোগ করুন যাতে আপনি আপনার ইভেন্ট
						থেকে আমানত গ্রহণ করতে পারেন।
					</div>
				</div>
				<div className="items-center flex flex-row gap-[12px]">
					<div className="font-[600] text-[16px] text-nowrap text-[#414651]">
						ব্যাংকের বিবরণ
					</div>
				</div>
				<div className="items-start flex flex-col gap-[6px]">
					<div className="font-[500] text-[14px] text-nowrap text-[#414651]">
						একাউন্ট নম্বর *
					</div>
					<input
						type="text"
						placeholder="একাউন্ট নম্বর দিন"
						value={bank_account_number}
						onChange={(e) => setBankAccountNumber(e.target.value)}
						className="border-[1px] border-[#E0E0E0] rounded-lg px-[14px] py-[10px]  w-full"
					/>
				</div>
				<div className="items-start flex flex-col gap-[6px]">
					<div className="font-[500] text-[14px] text-nowrap text-[#414651]">
						রাউটিং নম্বর *
					</div>
					<input
						type="text"
						placeholder="রাউটিং নম্বর দিন"
						value={routing_number}
						onChange={(e) => setRoutingNumber(e.target.value)}
						className="border-[1px] border-[#E0E0E0] rounded-lg px-[14px] py-[10px]  w-full"
					/>
				</div>
				<div className="items-start flex flex-col gap-[6px]">
					<div className="font-[500] text-[14px] text-nowrap text-[#414651]">
						একাউন্ট ধারকের নাম *
					</div>
					<input
						type="text"
						placeholder="একাউন্ট ধারকের নাম দিন"
						value={bank_account_holder_name}
						onChange={(e) =>
							setBankAccountHolderName(e.target.value)
						}
						className="border-[1px] border-[#E0E0E0] rounded-lg px-[14px] py-[10px]  w-full"
					/>
				</div>
				<div className="items-start flex flex-col gap-[6px]">
					<div className="font-[500] text-[14px] text-nowrap text-[#414651]">
						ব্যাংকের নাম *
					</div>
					<input
						type="text"
						placeholder="ব্যাংকের নাম দিন"
						value={bank_name}
						onChange={(e) => setBankName(e.target.value)}
						className="border-[1px] border-[#E0E0E0] rounded-lg px-[14px] py-[10px]  w-full"
					/>
				</div>
				<div className="flex flex-col lg:flex-row gap-4 items-center w-full">
					<div className="items-start flex w-full flex-col gap-[6px]">
						<div className="font-[500] text-[14px] text-nowrap text-[#414651]">
							জেলার নাম *
						</div>
						<input
							type="text"
							placeholder="জেলার নাম দিন"
							value={bank_district}
							onChange={(e) => setBankDistrict(e.target.value)}
							className="border-[1px] border-[#E0E0E0] rounded-lg px-[14px] py-[10px]  w-full"
						/>
					</div>
					<div className="items-start w-full flex flex-col gap-[6px]">
						<div className="font-[500] text-[14px] text-nowrap text-[#414651]">
							ব্রাঞ্চের নাম *
						</div>
						<input
							type="text"
							placeholder="ব্রাঞ্চের নাম দিন"
							value={bank_branch}
							onChange={(e) => setBankBranch(e.target.value)}
							className="border-[1px] border-[#E0E0E0] rounded-lg px-[14px] py-[10px]  w-full"
						/>
					</div>
				</div>
			</div>
			<div className="w-full border-t justify-end flex gap-4 pt-8">
				{loading ? (
					<Spin />
				) : (
					<>
						<button
							onClick={() => {
								router.back();
							}}
							className="bg-white hover:bg-gray-100 text-black border rounded-lg px-[14px] py-[10px] font-semibold"
						>
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							className="bg-[#7F56D9] hover:bg-[#6d49b9] text-white rounded-lg px-[14px] py-[10px] font-semibold"
						>
							Add
						</button>
					</>
				)}
			</div>
			<div className="w-full flex flex-col pb-4 gap-[20px]">
				<div className="border-b pb-[20px]">
					<div className="font-semibold text-[#181D27] text-[18px]">
						ব্যাংক একাউন্টের বিবরণ
					</div>
					<div className="text-[#535862]">
						আপনার ব্যাংক একাউন্টের বিস্তারিত তথ্য
					</div>
				</div>
				{data_loading ? (
					<Spin size="large" />
				) : (
					<div className="grid gap-4 lg:grid-cols-2">
						{bankInfo.map((bank, index) => (
							<Card
								key={index}
								bankInfo={bank}
								setSelectedBanks={setSelectedBanks}
								selectedBanks={selectedBanks}
							/>
						))}
					</div>
				)}
				{selectedBanks.length > 0 && (
					<div className="flex flex-col lg:flex-row w-full justify-center items-center lg:justify-end gap-4">
						<div className="font-semibold text-[#535862] text-[14px]">
							Are your sure you want to stop receive funds into
							the selected bank account?
						</div>
						<div className="flex w-full lg:w-fit gap-4">
							<button
								onClick={() => {
									setSelectedBanks([]);
								}}
								className="bg-white w-full lg:w-fit hover:bg-gray-100 text-black border rounded-lg px-[14px] py-[10px] font-semibold"
							>
								Cancel
							</button>
							<button
								onClick={handleDelete}
								className="bg-[#D92D20] w-full lg:w-fit hover:bg-[#ad241a] text-white rounded-lg px-[14px] py-[10px] font-semibold"
							>
								Delete
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

function Card({
	bankInfo,
	setSelectedBanks,
	selectedBanks,
}: {
	bankInfo: BankInfo;
	setSelectedBanks: any;
	selectedBanks: BankInfo[];
}) {
	const handleClick = () => {
		const index = selectedBanks.findIndex(
			(bank) => bank._id === bankInfo._id
		);
		if (index === -1) {
			setSelectedBanks([...selectedBanks, bankInfo]);
		} else {
			setSelectedBanks(
				selectedBanks.filter((bank) => bank._id !== bankInfo._id)
			);
		}
	};

	return (
		<div
			className={`flex gap-4 items-start hover:bg-gray-100 p-4 border-2 select-none rounded-lg cursor-pointer ${
				selectedBanks.findIndex((bank) => bank._id === bankInfo._id) !==
				-1
					? "border-[#7F56D9]"
					: "border-[#E0E0E0]"
			}`}
			onClick={handleClick}
		>
			<div className="flex flex-col">
				<div className="text-[#181D27] text-[16px]">
					একাউন্ট নম্বরঃ {bankInfo.bank_account_number}
				</div>
				<div className="text-[#535862] text-[14px]">
					রাউটিং নম্বরঃ {bankInfo.routing_number}
				</div>
				<div className="text-[#181D27] font-semibold mt-1 text-[16px]">
					{bankInfo.bank_name}
				</div>
			</div>
			<div className="flex-1 flex justify-end items-center">
				<input
					type="checkbox"
					checked={
						selectedBanks.findIndex(
							(bank) => bank._id === bankInfo._id
						) !== -1
					}
					onChange={handleClick}
					className="cursor-pointer"
					title="Select"
				/>
			</div>
		</div>
	);
}
