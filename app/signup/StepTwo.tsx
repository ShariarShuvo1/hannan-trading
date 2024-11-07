"use client";
import { useState } from "react";
import Image from "next/image";
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
		<div className="w-full max-w-md mx-auto flex flex-col justify-center gap-y-[2rem] pt-16">
			<div className="flex flex-col items-center gap-y-[2rem]">
				<div className="bg-white border p-[14px] rounded-[12px] ">
					<Image
						src="/assets/Icons/key-01.svg"
						width={28}
						height={28}
						alt="mail"
					/>
				</div>
				<div className="flex flex-col gap-y-[0.75rem]">
					<h2 className="text-[1.875rem] text-[#181D27] font-semibold text-center leading-tight">
						Choose a password
					</h2>
					<h2 className="text-center text-[#535862]">
						Must be at least 8 characters.
					</h2>
				</div>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<input
						type="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="mt-1 block w-full rounded-md border-gray-300  p-[10px] border focus:border-indigo-500 focus:ring-indigo-500"
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
						className="mt-1 block w-full rounded-md border-gray-300  p-[10px] text-[16px] border focus:border-indigo-500 focus:ring-indigo-500"
						placeholder="Confirm password"
						required
					/>
				</div>

				<button className="w-full p-[10px] font-semibold bg-[#7F56D9] text-white rounded-md  hover:bg-[#6947b1]">
					Continue
				</button>
			</form>
			<div className="flex gap-[1rem] w-full justify-center mt-8">
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#7F56D9] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
			</div>
		</div>
	);
}
