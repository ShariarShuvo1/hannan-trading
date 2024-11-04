"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Auth() {
	const [currentTab, setCurrentTab] = useState<"login" | "signup">("login");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState("");
	const route = useRouter();

	async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const response = await fetch("/api/login", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email, password }),
		});
		const data = await response.json();
		if (response.ok) {
			localStorage.setItem("userId", data.id);
			route.push("/dashboard");
			toast.success("Welcome back!");
		} else {
			console.error(data.message);
			toast.error(data.message);
		}
	}

	async function handleSignup(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		const response = await fetch("/api/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ name, email, password }),
		});
		const data = await response.json();
		if (response.ok) {
			localStorage.setItem("userId", data.id);
			route.push("/dashboard");
			toast.success("Welcome to the app!");
		} else {
			console.error(data.message);
			toast.error(data.message);
		}
	}

	return (
		<div className="flex flex-col items-center h-screen bg-gray-50">
			<div className="flex flex-col items-center gap-6 w-full max-w-md p-8">
				<Image
					src="/assets/logo.svg"
					alt="Logo"
					width={150}
					height={43}
					className="mt-16"
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
				<div className="flex border border-gray-300 font-semibold rounded-md bg-gray-100 w-full">
					<button
						className={`w-1/2 py-2 rounded-l-md ${
							currentTab === "signup"
								? "bg-white text-gray-900 border-r border-gray-300"
								: "text-gray-500"
						}`}
						onClick={() => route.push("/signup")}
					>
						Sign up
					</button>
					<button
						className={`w-1/2 py-2 rounded-r-md ${
							currentTab === "login"
								? "bg-white text-gray-900 border-l border-gray-300"
								: "text-gray-500"
						}`}
						onClick={() => setCurrentTab("login")}
					>
						Log in
					</button>
				</div>

				{currentTab === "login" ? (
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
						<button
							type="button"
							className="w-full flex items-center justify-center gap-2 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
						>
							<Image
								src="/assets/Icons/google-icon.svg"
								alt="Google Icon"
								width={20}
								height={20}
							/>
							Sign in with Google
						</button>
						<p className="text-center text-sm text-gray-600">
							Don’t have an account?{" "}
							<button
								type="button"
								className="text-indigo-600"
								onClick={() => setCurrentTab("signup")}
							>
								Sign up
							</button>
						</p>
					</form>
				) : (
					<form
						className="flex flex-col gap-4 w-full"
						onSubmit={handleSignup}
					>
						<div>
							<label className="block text-gray-700 text-sm">
								Name
							</label>
							<input
								type="text"
								placeholder="Enter your name"
								className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-gray-700 text-sm">
								Email
							</label>
							<input
								type="email"
								placeholder="Enter your email"
								className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label className="block text-gray-700 text-sm">
								Password
							</label>
							<input
								type="password"
								placeholder="Create a password"
								className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<p className="text-xs text-gray-500 mt-1">
								Must be at least 8 characters and contain one
								special character.
							</p>
						</div>
						<button
							type="submit"
							className="w-full py-2 bg-[#7F56D9] text-white rounded-md hover:bg-indigo-700"
						>
							Get started
						</button>
						<button
							type="button"
							className="w-full flex items-center justify-center gap-2 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
						>
							<Image
								src="/assets/Icons/google-icon.svg"
								alt="Google Icon"
								width={20}
								height={20}
							/>
							Sign up with Google
						</button>
						<p className="text-center text-sm text-gray-600">
							Already have an account?{" "}
							<button
								type="button"
								className="text-indigo-600"
								onClick={() => setCurrentTab("login")}
							>
								Log in
							</button>
						</p>
					</form>
				)}
			</div>
		</div>
	);
}
