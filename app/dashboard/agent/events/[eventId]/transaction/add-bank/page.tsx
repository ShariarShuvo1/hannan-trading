"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Spin } from "antd";

export default function AddBankPage() {
	const [bank_account_number, setBankAccountNumber] = useState("");
	const [routing_number, setRoutingNumber] = useState("");
	const [bank_account_holder_name, setBankAccountHolderName] = useState("");
	const [bank_name, setBankName] = useState("");
	const [bank_district, setBankDistrict] = useState("");
	const [bank_branch, setBankBranch] = useState("");
	const router = useRouter();
	const [loading, setLoading] = useState(false);

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
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}

	return (
		<div className="h-full w-full flex justify-center items-center">
			{loading && <Spin size="large" fullscreen />}
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div className="text-[16px] font-[500]">Bank Details</div>

				<div>
					<label className="block text-sm font-medium text-gray-700">
						Account Number *
					</label>
					<input
						type="text"
						name="bank_account_number"
						value={bank_account_number}
						onChange={(e) => setBankAccountNumber(e.target.value)}
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
						value={routing_number}
						onChange={(e) => setRoutingNumber(e.target.value)}
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
						value={bank_account_holder_name}
						onChange={(e) =>
							setBankAccountHolderName(e.target.value)
						}
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
						value={bank_name}
						onChange={(e) => setBankName(e.target.value)}
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
							value={bank_district}
							onChange={(e) => setBankDistrict(e.target.value)}
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
							value={bank_branch}
							onChange={(e) => setBankBranch(e.target.value)}
							className="mt-1 block w-full rounded-md p-2 border border-gray-300  focus:border-indigo-500 focus:ring-indigo-500"
							placeholder="Branch Name"
							required
						/>
					</div>
				</div>
				<div className="py-2 flex w-full gap-4">
					<button
						onClick={() => router.back()}
						className="w-full p-[10px] font-semibold border bg-white hover:bg-slate-50 text-black rounded-md "
					>
						Cancel
					</button>
					<button
						type="submit"
						className="w-full p-[10px] font-semibold bg-[#7F56D9] text-white rounded-md  hover:bg-[#6947b1]"
					>
						Add
					</button>
				</div>
			</form>
		</div>
	);
}
