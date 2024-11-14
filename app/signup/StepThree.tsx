"use client";
import { useState } from "react";
import Image from "next/image";
import User from "@/interfaces/User";
import toast from "react-hot-toast";
import "./style.css";

export default function StepThree({
	user,
	setUser,
	currentStep,
	setCurrentStep,
}: {
	user: User | null;
	setUser: any;
	currentStep: number;
	setCurrentStep: any;
}) {
	const [formData, setFormData] = useState({
		nid_number: "",
		bank_account_number: "",
		bank_account_holder_name: "",
		bank_name: "",
		bank_district: "",
		bank_branch: "",
		routing_number: "",
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			!formData.nid_number ||
			!formData.bank_account_number ||
			!formData.bank_account_holder_name ||
			!formData.bank_name ||
			!formData.bank_district ||
			!formData.bank_branch ||
            !formData.routing_number
		) {
			toast.error("Please fill all the fields");
			return;
		}
		const tempUser = { ...user };
		tempUser.nid_number = formData.nid_number;
		tempUser.bank_account_number = formData.bank_account_number;
		tempUser.bank_account_holder_name = formData.bank_account_holder_name;
		tempUser.bank_name = formData.bank_name;
		tempUser.bank_district = formData.bank_district;
		tempUser.bank_branch = formData.bank_branch;
        tempUser.routing_number = formData.routing_number;
		setUser(tempUser);
		setCurrentStep(currentStep + 1);
	};

	return (
		<div className=" w-full h-full container-class overflow-y-scroll max-w-md mx-auto p-6 flex flex-col justify-center gap-y-[32px] pt-16">
			<div className="flex flex-col items-center gap-y-[32px]">
				<div className="bg-white border p-[14px] rounded-[12px] ">
					<Image
						src="/assets/Icons/wallet-02.svg"
						width={28}
						height={28}
						alt="mail"
					/>
				</div>
				<h2 className="text-[1.875rem] text-[#181D27] font-semibold text-center">
					Provide your NID & Bank Details
				</h2>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						NID Number*
					</label>
					<input
						type="text"
						name="nid_number"
						value={formData.nid_number}
						onChange={(e) =>
							setFormData({
								...formData,
								nid_number: e.target.value,
							})
						}
						className="mt-1 block w-full rounded-md border-gray-300  p-2 border focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="NID Number"
						required
					/>
				</div>

				<div className="text-[16px] font-[500]">Bank Details</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Account Number *
					</label>
					<input
						type="text"
						name="bank_account_number"
						value={formData.bank_account_number}
						onChange={(e) => {
							setFormData({
								...formData,
								bank_account_number: e.target.value,
							});
						}}
						className="mt-1 block w-full rounded-md border-gray-300 p-2 border  focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Account Number"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Routing Number *
					</label>
					<input
						type="text"
						name="routing_number"
						value={formData.routing_number}
						onChange={(e) => {
							setFormData({
								...formData,
								routing_number: e.target.value,
							});
						}}
						className="mt-1 block w-full rounded-md border-gray-300 p-2 border  focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Routing Number"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Account Holder Name *
					</label>
					<input
						type="text"
						name="bank_account_holder_name"
						value={formData.bank_account_holder_name}
						onChange={(e) => {
							setFormData({
								...formData,
								bank_account_holder_name: e.target.value,
							});
						}}
						className="mt-1 block w-full rounded-md p-2 border border-gray-300  focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Account Holder Name"
						required
					/>
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Bank Name *
					</label>
					<input
						type="text"
						name="bank_name"
						value={formData.bank_name}
						onChange={(e) => {
							setFormData({
								...formData,
								bank_name: e.target.value,
							});
						}}
						className="mt-1 block w-full rounded-md p-2 border border-gray-300  focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Bank Name"
						required
					/>
				</div>
				<div className="flex gap-4">
					<div>
						<label className="block text-sm font-medium text-gray-700">
							District Name *
						</label>
						<input
							type="text"
							name="district"
							value={formData.bank_district}
							onChange={(e) => {
								setFormData({
									...formData,
									bank_district: e.target.value,
								});
							}}
							className="mt-1 block w-full rounded-md p-2 border border-gray-300  focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="District Name"
							required
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Branch Name *
						</label>
						<input
							type="text"
							name="branch"
							value={formData.bank_branch}
							onChange={(e) => {
								setFormData({
									...formData,
									bank_branch: e.target.value,
								});
							}}
							className="mt-1 block w-full rounded-md p-2 border border-gray-300  focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Branch Name"
							required
						/>
					</div>
				</div>
				<div className="py-2">
					<button
						type="submit"
						className="w-full p-[10px] font-semibold bg-[#7F56D9] text-white rounded-md  hover:bg-[#6947b1]"
					>
						Continue
					</button>
				</div>
			</form>
			<div className="flex gap-[1rem] w-full justify-center mt-8">
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#7F56D9] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
			</div>
		</div>
	);
}
