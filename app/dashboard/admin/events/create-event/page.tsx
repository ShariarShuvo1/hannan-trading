"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import { Spin } from "antd";
import { useRouter } from "next/navigation";

export default function CreateEvent() {
	const [name, setName] = useState("");
	const [tagline, setTagline] = useState("");
	const [banner, setBanner] = useState<File | undefined>(undefined);
	const [bannerUrl, setBannerUrl] = useState<string | undefined>(undefined);
	const [roi, setRoi] = useState("");
	const [minimum_deposit, setMinimumDeposit] = useState("");
	const [maximum_deposit, setMaximumDeposit] = useState("");
	const [duration, setDuration] = useState("");
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [loading, setLoading] = useState(false);
	const [loadingImg, setLoadingImg] = useState(false);
	const router = useRouter();

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file: File | undefined = e.target.files?.[0];
		if (file) {
			setBanner(file);
			const data = new FormData();
			data.append("file", file);
			data.append("upload_preset", "banner");
			setLoadingImg(true);
			const res = await fetch(`/api/imgUpload`, {
				method: "POST",
				body: data,
			});
			const imageResponse = await res.json();
			if (imageResponse.status === 200) {
				setBannerUrl(imageResponse.uploadedImageData.url);
			} else {
				toast.error("Failed to upload image");
				setBanner(undefined);
			}
			setLoadingImg(false);
		}
	};

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = () => setIsDragging(false);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) {
			setBanner(file);
		}
	};

	async function deletePP(e: React.MouseEvent<SVGElement, MouseEvent>) {
		if (!bannerUrl) {
			toast.error("No image to delete");
			return;
		}
		setLoadingImg(true);
		const res = await fetch(`/api/imgUpload/?url=${bannerUrl}`, {
			method: "DELETE",
		});
		const deletedImageData = await res.json();
		if (deletedImageData.status === 200) {
			setBanner(undefined);
			setBannerUrl(undefined);
		} else {
			toast.error("Failed to delete image");
		}
		setLoadingImg(false);
	}

	async function handleSubmit() {
		if (
			!name ||
			!tagline ||
			!roi ||
			!minimum_deposit ||
			!maximum_deposit ||
			!duration
		) {
			toast.error("Please fill all the fields");
			return;
		}

		if (!banner) {
			toast.error("Please upload an image");
			return;
		}
		if (!bannerUrl) {
			toast.error("Please wait for the images to upload");
			return;
		}

		setLoading(true);

		const response = await fetch("/api/admin/events/create-event", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name,
				tagline,
				banner: bannerUrl,
				roi,
				minimum_deposit,
				duration,
				maximum_deposit,
			}),
		});

		const data = await response.json();
		if (response.ok) {
			toast.success(data.message);
			setName("");
			setTagline("");
			setBanner(undefined);
			setBannerUrl(undefined);
			setRoi("");
			setMinimumDeposit("");
			setDuration("");
			setMaximumDeposit("");
			router.push("/dashboard/admin/events");
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}

	return (
		<div className="py-[32px] bg-white px-8 w-full flex flex-col gap-[32px]">
			<div className="lg:flex hidden gap-[8px] items-center">
				<Image
					src="/assets/Icons/rows-01.svg"
					width={20}
					height={20}
					alt="Event"
					onClick={() => router.push("/dashboard/admin/events")}
					className="cursor-pointer"
				/>
				<Image
					src="/assets/Icons/chevron-right.svg"
					width={20}
					height={20}
					alt="Event"
				/>
				<div className="font-semibold text-[#6941C6]">Create Event</div>
			</div>
			<div className="w-full flex flex-col gap-[20px]">
				<div className="border-b pb-[20px]">
					<div className="font-semibold text-[#181D27] text-[18px]">
						নতুন ইভেন্ট তৈরি করুন
					</div>
					<div className="text-[#535862]">
						আপনার এজেন্টদের জন্য আরেকটি ইভেন্ট তৈরি করুন!
					</div>
				</div>
				<div className="border-b pb-[20px] flex flex-col lg:flex-row gap-[32px]">
					<div className="max-w-[280px] w-full">
						<div className="font-semibold text-[#414651]">
							ইভেন্টের নাম *
						</div>
						<div className="text-[#535862]">
							ইভেন্ট কার্ডে দেখানো হবে।
						</div>
					</div>
					<input
						type="text"
						placeholder="ইভেন্টের নাম লিখুন"
						value={name}
						onChange={(e) => setName(e.target.value)}
						className="border-[1px] border-[#E0E0E0] rounded-lg px-[14px] py-[10px] max-w-[512px] w-full"
					/>
				</div>
				<div className="border-b pb-[20px] flex flex-col lg:flex-row gap-[32px]">
					<div className="max-w-[280px] w-full">
						<div className="font-semibold text-[#414651]">
							ট্যাগলাইন *
						</div>
						<div className="text-[#535862]">
							সংক্ষেপে ইভেন্ট বিবরণ
						</div>
					</div>
					<textarea
						placeholder="ট্যাগলাইন লিখুন"
						value={tagline}
						onChange={(e) => setTagline(e.target.value)}
						className="border-[1px] border-[#E0E0E0] rounded-lg px-[14px] py-[10px] max-w-[512px] w-full"
						rows={3}
					></textarea>
				</div>
				<div className="border-b pb-[20px] flex flex-col lg:flex-row gap-[32px]">
					<div className="max-w-[280px] w-full">
						<div className="font-semibold text-[#414651]">
							ইভেন্ট ব্যানার *
						</div>
						<div className="text-[#535862]">
							আরো এজেন্ট আকর্ষণ করতে আপনার ইভেন্ট ব্যানার আপলোড
							করুন।
						</div>
					</div>
					{banner ? (
						<div className="flex max-w-[512px] w-full p-[16px] items-center bg-white justify-between border rounded-[12px]">
							<div className="flex items-center gap-x-[12px]">
								<Image
									src={URL.createObjectURL(banner)}
									width={50}
									height={50}
									alt="profile"
									className="h-full object-cover border "
								/>
								<div className="flex flex-col text-[14px]">
									<p className="text-[#414651] font-[500]">
										{banner.name}
									</p>
									<p className="text-[#535862]">
										{(banner.size / 1024 / 1024).toFixed(2)}{" "}
										MB
									</p>
								</div>
							</div>
							{loadingImg ? (
								<Spin />
							) : (
								<X
									onClick={deletePP}
									className="cursor-pointer text-[#7F56D9] hover:text-[#6847b1]"
									size={48}
								/>
							)}
						</div>
					) : (
						<div
							className={`flex max-w-[512px] flex-col gap-y-[12px] p-x[24] py-[16px] items-center text-[14px] text-[#535862] justify-center w-full border ${
								isDragging
									? "border-[#7F56D9]"
									: "border-[#E9EAEB]"
							} border rounded-[12px] bg-white hover:bg-gray-50 cursor-pointer`}
							onClick={handleUploadClick}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onDrop={handleDrop}
						>
							<div className="bg-white border p-[14px] rounded-[12px]">
								<Image
									src="/assets/Icons/upload-cloud-02.svg"
									width={20}
									height={20}
									alt="mail"
								/>
							</div>
							<div>
								<p className="text-center">
									<span className="text-[#6941C6] font-semibold">
										Click to upload
									</span>{" "}
									or drag and drop
								</p>
								<p className="text-center">
									SVG, PNG, JPG or GIF
								</p>
							</div>
						</div>
					)}
				</div>
				<input
					title="profile_picture"
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept=".svg, .png, .jpg, .jpeg, .gif"
					onChange={handleFileChange}
					multiple={false}
				/>

				<div className="border-b pb-[20px] flex flex-col lg:flex-row gap-[32px]">
					<div className="max-w-[280px] w-full">
						<div className="font-semibold text-[#414651]">
							ইনভেস্টমেন্ট ফ্যাক্টর
						</div>
					</div>
					<div className="flex flex-col max-w-[512px] w-full text-[16px] gap-[16px]">
						<div className="flex items-center">
							<div className="px-[12px] max-w-[130px] w-full rounded-l-lg border py-[10px] ">
								ROI
							</div>
							<input
								type="number"
								step={0.01}
								placeholder="ROI লিখুন"
								value={roi}
								onChange={(e) => setRoi(e.target.value)}
								className="border-y border-r border-[#E0E0E0] rounded-r-lg px-[12px] py-[10px] max-w-[512px] w-full"
							/>
						</div>
						<div className="flex items-center">
							<div className="px-[12px] max-w-[130px] w-full rounded-l-lg text-nowrap border py-[10px] ">
								সর্বনিম্ন আমানত
							</div>
							<input
								type="number"
								placeholder="সর্বনিম্ন আমানত লিখুন"
								value={minimum_deposit}
								onChange={(e) =>
									setMinimumDeposit(e.target.value)
								}
								className="border-y border-r border-[#E0E0E0] rounded-r-lg px-[12px] py-[10px] max-w-[512px] w-full"
							/>
						</div>
						<div className="flex items-center">
							<div className="px-[12px] max-w-[130px] w-full rounded-l-lg text-nowrap border py-[10px] ">
								সর্বোচ্চ আমানত
							</div>
							<input
								type="number"
								placeholder="সর্বোচ্চ আমানত লিখুন"
								value={maximum_deposit}
								onChange={(e) =>
									setMaximumDeposit(e.target.value)
								}
								className="border-y border-r border-[#E0E0E0] rounded-r-lg px-[12px] py-[10px] max-w-[512px] w-full"
							/>
						</div>
						<div className="flex items-center">
							<div className="px-[12px] max-w-[130px] w-full rounded-l-lg border py-[10px] ">
								স্থায়িত্ব
							</div>
							<input
								type="number"
								placeholder="স্থায়িত্ব (মাসে)"
								value={duration}
								onChange={(e) => setDuration(e.target.value)}
								className="border-y border-r border-[#E0E0E0] rounded-r-lg px-[12px] py-[10px] max-w-[512px] w-full"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="w-full justify-end flex gap-4 pb-4">
				{loading ? (
					<Spin />
				) : (
					<>
						<button
							onClick={() =>
								router.push("/dashboard/admin/events")
							}
							className="bg-white hover:bg-gray-100 text-black border rounded-lg px-[14px] py-[10px] font-semibold"
						>
							Cancel
						</button>
						<button
							onClick={handleSubmit}
							className="bg-[#7F56D9] hover:bg-[#6d49b9] text-white rounded-lg px-[14px] py-[10px] font-semibold"
						>
							Create
						</button>
					</>
				)}
			</div>
		</div>
	);
}
