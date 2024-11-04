"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

import districtsData from "../../public/data/district.json";
import User from "@/interfaces/User";
import toast from "react-hot-toast";

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
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			!formData.nid_number ||
			!formData.bank_account_number ||
			!formData.bank_account_holder_name ||
			!formData.bank_name ||
			!formData.bank_district ||
			!formData.bank_branch
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
		setUser(tempUser);
		setCurrentStep(currentStep + 1);
	};

	return (
		<div className="bg-white w-full max-w-md mx-auto p-6 flex flex-col justify-center">
			<div className="flex flex-col items-center mb-6">
				<div className="bg-gray-200 p-4 rounded-full">
					<Upload className="w-8 h-8 text-gray-500" />
				</div>
				<h2 className="text-2xl font-semibold text-center">
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
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="NID Number"
						required
					/>
				</div>

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
						className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Account Number"
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
						className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
						className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
							className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
							className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Branch Name"
							required
						/>
					</div>
				</div>

				<button
					type="submit"
					className="w-full py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
				>
					Continue
				</button>
			</form>
		</div>
	);
}
