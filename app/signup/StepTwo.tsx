"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

import User from "@/interfaces/User";
import toast from "react-hot-toast";

export default function StepTwo({
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
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (password.length < 8) {
			toast.error("Password must be at least 8 characters long.");
			return;
		}
		if (password !== confirmPassword) {
			toast.error("Passwords do not match.");
			return;
		}
		const tempUser: User | null = { ...user };
		tempUser.password = password;
		setUser(tempUser);
		setCurrentStep(currentStep + 1);
	}
	return (
		<div className="bg-white w-full max-w-md mx-auto p-6 flex flex-col justify-center">
			<div className="flex flex-col items-center mb-6">
				<div className="bg-gray-200 p-4 rounded-full">
					<Upload className="w-8 h-8 text-gray-500" />
				</div>
				<h2 className="text-2xl font-semibold text-center">
					Choose a password
				</h2>
				<h2 className="text-center">Must be at least 8 characters.</h2>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Choose a password"
						required
					/>
				</div>
				<div>
					<input
						type="password"
						name="confirm password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Confirm password"
						required
					/>
				</div>

				<button className="w-full py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
					Continue
				</button>
			</form>
		</div>
	);
}
