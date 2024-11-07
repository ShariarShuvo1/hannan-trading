"use client";
import React, { useState } from "react";
import { useAuth, useSignIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { Spin } from "antd";
import Link from "next/link";

const ForgotPasswordPage: NextPage = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [code, setCode] = useState("");
	const [successfulCreation, setSuccessfulCreation] = useState(false);
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);

	const router = useRouter();
	const { isSignedIn } = useAuth();
	const { isLoaded, signIn, setActive } = useSignIn();

	if (!isLoaded) {
		return null;
	}

	if (isSignedIn) {
		router.push("/dashboard");
	}

	async function create(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		await signIn
			?.create({
				strategy: "reset_password_email_code",
				identifier: email,
			})
			.then((_) => {
				setSuccessfulCreation(true);
			})
			.catch((err) => {
				toast.error(err.errors[0].longMessage);
			});
		setLoading(false);
	}

	async function reset(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		await signIn
			?.attemptFirstFactor({
				strategy: "reset_password_email_code",
				code,
				password,
			})
			.then((result) => {
				if (result.status === "complete") {
					setActive({ session: result.createdSessionId });
					setSuccess(true);
				} else {
					toast.success(result.status);
				}
			})
			.catch((err) => {
				toast.error(err.errors[0].longMessage);
			});
		setLoading(false);
	}

	return (
		<div className="w-full px-2 h-screen  flex justify-center gap-y-[2rem] pt-16">
			<div className="flex flex-col items-center gap-6 w-full max-w-md p-8">
				<div className="flex flex-col items-center gap-y-[2rem]">
					<div className="bg-white border p-[14px] rounded-[12px] ">
						<Image
							src={`${
								success
									? "/assets/Icons/check-circle.svg"
									: successfulCreation
									? "/assets/Icons/lock-01.svg"
									: "/assets/Icons/key-01.svg"
							}`}
							width={28}
							height={28}
							alt="mail"
						/>
					</div>
					<div className="flex flex-col gap-y-[0.75rem]">
						<h2 className="text-[1.875rem] text-[#181D27] font-semibold text-center leading-tight">
							{success
								? "Password reset"
								: successfulCreation
								? "Set new password"
								: "Forgot password?"}
						</h2>
						<h2 className="text-center text-[#535862]">
							{success
								? "Your password has been successfully reset. Click below to log in magically."
								: successfulCreation
								? "Your new password must be different to previously used passwords."
								: "No worries, we'll send you reset instructions."}
						</h2>
					</div>
				</div>

				<form className="space-y-4 w-full">
					{!successfulCreation && (
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<input
								type="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="mt-1 block w-full rounded-md p-2 border border-gray-300  focus:border-indigo-500 focus:ring-indigo-500"
								placeholder="Enter your email"
								required
							/>
						</div>
					)}

					{successfulCreation && !success && (
						<>
							<div>
								<label className="block text-[#414651] font-[500] text-sm">
									Password
								</label>
								<input
									type="password"
									placeholder="Enter your password"
									className="w-full px-[14px] py-[10px] text-[16px] border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								/>
							</div>
							<div>
								<label className="block text-[#414651] font-[500] text-sm">
									Confirm Password
								</label>
								<input
									type="password"
									placeholder="Confirm your password"
									className="w-full px-[14px] py-[10px] text-[16px] border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
									value={confirmPassword}
									onChange={(e) =>
										setConfirmPassword(e.target.value)
									}
								/>
							</div>
							<div>
								<label className="block text-[#414651] font-[500] text-sm">
									Enter the code sent to your{" "}
									<span className="text-orange-500">
										email
									</span>
								</label>
								<input
									type="text"
									placeholder="Enter the code"
									className="w-full px-[14px] py-[10px] text-[16px] border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
									value={code}
									onChange={(e) => setCode(e.target.value)}
								/>
							</div>
						</>
					)}
					{loading ? (
						<div className="text-center">
							<Spin />
						</div>
					) : (
						<>
							{!successfulCreation && (
								<button
									onClick={create}
									className="w-full p-[10px] font-semibold bg-[#7F56D9] text-white rounded-md  hover:bg-[#6947b1]"
								>
									Reset password
								</button>
							)}
							{successfulCreation && !success && (
								<button
									onClick={reset}
									className="w-full p-[10px] font-semibold bg-[#7F56D9] text-white rounded-md  hover:bg-[#6947b1]"
								>
									Reset password
								</button>
							)}
							{success && (
								<button
									onClick={() => router.push("/dashboard")}
									className="w-full p-[10px] font-semibold bg-[#7F56D9] text-white rounded-md  hover:bg-[#6947b1]"
								>
									Continue
								</button>
							)}
						</>
					)}
				</form>
				<Link
					href="/login"
					className="flex justify-center gap-[6px] cursor-pointer"
				>
					<Image
						src="/assets/Icons/arrow-left.svg"
						width={20}
						height={20}
						alt="arrow"
					/>
					<div className="text-[#535862] hover:text-[#373a41] font-semibold">
						Back to log in
					</div>
				</Link>
			</div>
		</div>
	);
};

export default ForgotPasswordPage;
