"use client";
import { useState } from "react";
import { Upload } from "lucide-react";

import User from "@/interfaces/User";
import toast from "react-hot-toast";
import ImageUpload from "@/components/imageUpload/ImageUpload";
import SignatureUpload from "@/components/imageUpload/SignatureUpload";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function StepFour({ user }: { user: User | null }) {
	const [profile_picture, setProfilePicture] = useState<string | null>(null);
	const [signature, setSignature] = useState<string | null>(null);
	const route = useRouter();
	const [loading, setLoading] = useState(false);

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!profile_picture || !signature) {
			toast.error("Please upload both photo and signature");
			return;
		}

		const tempUser: User | null = { ...user };
		tempUser.profile_picture = profile_picture;
		tempUser.signature = signature;
		setLoading(true);
		const res = await fetch("/api/signup", {
			method: "POST",
			body: JSON.stringify({ tempUser }),
		});
		const data = await res.json();
		setLoading(false);
		if (res.status === 201) {
			toast.success(data.message);
			localStorage.setItem("userId", data.id);
			route.push("/dashboard");
		} else {
			toast.error(data.message);
		}
	}

	if (loading) {
		return <Spin fullscreen={true} />;
	}

	return (
		<div className="bg-white w-full max-w-md mx-auto p-6 flex flex-col justify-center">
			<div className="flex flex-col items-center mb-6">
				<div className="bg-gray-200 p-4 rounded-full">
					<Upload className="w-8 h-8 text-gray-500" />
				</div>
				<h2 className="text-2xl font-semibold text-center">
					Upload your photo/signature
				</h2>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Photo *
					</label>
					<ImageUpload
						onChange={(url) => {
							setProfilePicture(url);
						}}
					/>
					{profile_picture && (
						<div className="w-full flex items-center justify-center m-4">
							<Image
								src={profile_picture}
								width={400}
								height={400}
								alt="Profile Picture"
								className="border border-gray-200 rounded-md"
							/>
						</div>
					)}
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Signature *
					</label>
					<SignatureUpload
						onChange={(url) => {
							setSignature(url);
						}}
					/>
					{signature && (
						<div className="w-full flex items-center m-4 justify-center">
							<Image
								src={signature}
								width={400}
								height={400}
								alt="Signature"
								className="border border-gray-200 rounded-md"
							/>
						</div>
					)}
				</div>

				<button className="w-full py-2 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
					Submit
				</button>
			</form>
		</div>
	);
}
