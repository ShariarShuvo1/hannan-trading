"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

import districtsData from "../../public/data/district.json";
import User from "@/interfaces/User";
import toast from "react-hot-toast";

export default function StepOne({
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
		fullName: "",
		fatherName: "",
		motherName: "",
		email: "",
		phoneNumber: "",
		houseNumber: "",
		village: "",
		po: "",
		ps: "",
		district: "Dhaka",
		agree: false,
	});

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type, checked } = e.target as HTMLInputElement;
		setFormData({
			...formData,
			[name]: type === "checkbox" ? checked : value,
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!formData.agree) {
			toast.error("You must agree to our privacy policy to continue.");
			return;
		}
		const tempUser: User | null = { ...user };
		tempUser.fullname = formData.fullName;
		tempUser.fathername = formData.fatherName;
		tempUser.mothername = formData.motherName;
		tempUser.email = formData.email;
		tempUser.phone = formData.phoneNumber;
		tempUser.house_no = formData.houseNumber;
		tempUser.village = formData.village;
		tempUser.po = formData.po;
		tempUser.ps = formData.ps;
		tempUser.district = formData.district;
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
					Your Personal Information
				</h2>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Full Name *
					</label>
					<input
						type="text"
						name="fullName"
						value={formData.fullName}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Full Name"
						required
					/>
				</div>

				<div className="flex space-x-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700">
							Father&apos;s Name *
						</label>
						<input
							type="text"
							name="fatherName"
							value={formData.fatherName}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md border-gray-300 p-2 border shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="First name"
							required
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700">
							Mother&apos;s Name *
						</label>
						<input
							type="text"
							name="motherName"
							value={formData.motherName}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Last name"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Email *
					</label>
					<input
						type="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="you@company.com"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Phone number
					</label>
					<input
						type="tel"
						name="phoneNumber"
						value={formData.phoneNumber}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="+880 000-0000"
					/>
				</div>

				<div className="flex space-x-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700">
							House/Holding No. *
						</label>
						<input
							type="text"
							name="houseNumber"
							value={formData.houseNumber}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="House No."
							required
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700">
							Village *
						</label>
						<input
							type="text"
							name="village"
							value={formData.village}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Village"
							required
						/>
					</div>
				</div>

				<div className="flex space-x-4">
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700">
							P:O *
						</label>
						<input
							type="text"
							name="po"
							value={formData.po}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="House No."
							required
						/>
					</div>
					<div className="flex-1">
						<label className="block text-sm font-medium text-gray-700">
							P:S *
						</label>
						<input
							type="text"
							name="ps"
							value={formData.ps}
							onChange={handleChange}
							className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Village"
							required
						/>
					</div>
				</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						District
					</label>
					<select
						name="district"
						title="district"
						value={formData.district}
						onChange={handleChange}
						className="mt-1 block w-full rounded-md p-2 border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
					>
						{districtsData.districts.map((district) => (
							<option key={district.id} value={district.name}>
								{district.name}
							</option>
						))}
					</select>
				</div>

				<div className="flex items-center">
					<input
						type="checkbox"
						title="agree"
						name="agree"
						checked={formData.agree}
						onChange={handleChange}
						className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
					/>
					<label className="ml-2 text-sm text-gray-700">
						You agree to our friendly{" "}
						<a href="#" className="text-indigo-600 underline">
							privacy policy
						</a>
						.
					</label>
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