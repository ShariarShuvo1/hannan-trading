"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSignIn, useAuth } from "@clerk/nextjs";

export default function Auth() {
	const [currentTab, _setCurrentTab] = useState<"login" | "signup">("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const route = useRouter();
	const { signIn, isLoaded } = useSignIn();
	const { isSignedIn } = useAuth();

	if (isSignedIn) {
		route.push("/dashboard");
	}

	useEffect(() => {
		if (isSignedIn) {
			route.push("/dashboard");
		}
	}, [isSignedIn]);

	async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!email || !password) {
			return toast.error("Please fill in all fields");
		}
		if (!isLoaded) return;
		try {
			const result = await signIn.create({ identifier: email, password });
			if (result.status === "complete") {
				toast.success("Welcome back!");
				window.location.href = "/dashboard";
			} else {
				toast.error("Sign-in process was not completed");
			}
		} catch (err) {
			toast.error("Invalid email or password");
		}
	}

	return (
		<div className="flex flex-col items-center h-screen">
			<div className="flex flex-col items-center gap-6 w-full max-w-md p-8">
				<Image
					src="/assets/logo.svg"
					alt="Logo"
					width={150}
					height={43}
					className="mt-16 cursor-pointer"
					onClick={() => route.push("/")}
				/>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold text-gray-900">
						{currentTab === "login"
							? "Log in to your account"
							: "Create an account"}
					</h1>
					{currentTab === "login" && (
						<p className="text-gray-600">
							Welcome back! Please enter your details.
						</p>
					)}
				</div>

				{currentTab === "login" && (
					<form
						className="flex flex-col gap-4 w-full"
						onSubmit={handleLogin}
					>
						<div>
							<label className="block text-[#414651] font-[500] text-sm">
								Email
							</label>
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full px-[14px] py-[10px] text-[16px] border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-[#414651] font-[500] text-sm">
								Password
							</label>
							<input
								type="password"
								placeholder="Enter your password"
								className="w-full px-[14px] py-[10px] text-[16px] border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
						<div className="flex items-center justify-between text-sm">
							<label className="flex items-center gap-1 text-gray-600">
								<input
									type="checkbox"
									className="border-gray-300"
								/>
								Remember for 30 days
							</label>
							<a
								href="#"
								className="text-[#6941C6] font-semibold"
							>
								Forgot password
							</a>
						</div>
						<button
							type="submit"
							className="w-full py-2 bg-[#6941C6] text-white rounded-md hover:bg-indigo-700"
						>
							Sign in
						</button>

						<p className="text-center text-sm text-gray-600">
							Don’t have an account?{" "}
							<Link className="text-indigo-600" href="/signup">
								Sign up
							</Link>
						</p>
					</form>
				)}
			</div>
		</div>
	);
}
