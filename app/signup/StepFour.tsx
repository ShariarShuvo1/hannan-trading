"use client";
import { useRef, useState, useEffect } from "react";
import { useSignUp } from "@clerk/nextjs";
import User from "@/interfaces/User";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Spin } from "antd";

export default function StepFour({ user }: { user: User | null }) {
	const [profile_picture, setProfilePicture] = useState<File | undefined>(
		undefined
	);
	const [signature, setSignature] = useState<File | undefined>(undefined);
	const route = useRouter();
	const [loading, setLoading] = useState(false);
	const [loadingImg, setLoadingImg] = useState(false);
	const [loadingSig, setLoadingSig] = useState(false);
	const [isDragging, setIsDragging] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging2, setIsDragging2] = useState(false);
	const fileInputRef2 = useRef<HTMLInputElement>(null);
	const [ppShow, setPpShow] = useState(true);
	const [sigShow, setSigShow] = useState(false);
	const [profile_picture_url, setProfilePictureUrl] = useState<
		string | undefined
	>(undefined);
	const [signature_url, setSignatureUrl] = useState<string | undefined>(
		undefined
	);
	const { isLoaded, signUp } = useSignUp();

	const handleUploadClick = () => {
		fileInputRef.current?.click();
	};
	const handleUploadClick2 = () => {
		fileInputRef2.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file: File | undefined = e.target.files?.[0];
		if (file) {
			setProfilePicture(file);
			setPpShow(false);
			if (!signature) {
				setSigShow(true);
			}
			setLoadingImg(true);
			const data = new FormData();
			data.append("file", file);
			data.append("upload_preset", "x3grukq5");
			const res = await fetch(`/api/imgUpload`, {
				method: "POST",
				body: data,
			});
			const imageResponse = await res.json();
			if (imageResponse.status === 200) {
				setProfilePictureUrl(imageResponse.uploadedImageData.url);
			} else {
				toast.error("Failed to upload image");
				setProfilePicture(undefined);
				setPpShow(true);
				setSigShow(false);
			}
			setLoadingImg(false);
		}
	};

	const handleFileChange2 = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file: File | undefined = e.target.files?.[0];
		if (file) {
			setSignature(file);
			if (!profile_picture) {
				setPpShow(true);
			}
			setSigShow(false);
			setLoadingSig(true);
			const data = new FormData();
			data.append("file", file);
			data.append("upload_preset", "kefexupz");
			const res = await fetch(`/api/imgUpload`, {
				method: "POST",
				body: data,
			});
			const imageResponse = await res.json();
			if (imageResponse.status === 200) {
				setSignatureUrl(imageResponse.uploadedImageData.url);
			} else {
				toast.error("Failed to upload image");
				setSignature(undefined);
				if (!profile_picture) {
					setPpShow(true);
				} else {
					setSigShow(true);
				}
			}
			setLoadingSig(false);
		}
	};

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragOver2 = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging2(true);
	};

	const handleDragLeave = () => setIsDragging(false);
	const handleDragLeave2 = () => setIsDragging2(false);

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file) {
			setProfilePicture(file);
			setPpShow(false);
			if (!signature) {
				setSigShow(true);
			}
		}
	};
	const handleDrop2 = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging2(false);
		const file = e.dataTransfer.files[0];
		if (file) {
			setSignature(file);
			if (!profile_picture) {
				setPpShow(true);
			}
			setSigShow(false);
		}
	};

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (!isLoaded) return;
		if (!profile_picture || !signature) {
			toast.error("Please upload both photo and signature");
			return;
		}
		if (!profile_picture_url || !signature_url) {
			toast.error("Please wait for the images to upload");
			return;
		}

		const tempUser: User | null = { ...user };
		tempUser.profile_picture = profile_picture_url;
		tempUser.signature = signature_url;
		setLoading(true);
		let clerkId = null;
		try {
			const res = await signUp.create({
				emailAddress: tempUser.email,
				password: tempUser.password,
			});
			clerkId = res.createdUserId;
		} catch (error) {
			toast.error("Failed to create user");
			setLoading(false);
			return;
		}

		if (!clerkId) {
			toast.error("Failed to create user");
			setLoading(false);
			return;
		}
		tempUser.clerkId = clerkId;
		const response = await fetch("/api/signup", {
			method: "POST",
			body: JSON.stringify({ tempUser }),
		});
		const data = await response.json();
		if (response.status === 201) {
			toast.success(data.message);
			route.push("/login");
		} else {
			toast.error(data.message);
		}
		setLoading(false);
	}

	async function deletePP(e: React.MouseEvent<SVGElement, MouseEvent>) {
		setLoadingImg(true);
		if (!profile_picture_url) {
			toast.error("No image to delete");
			setLoadingImg(false);
			return;
		}
		const res = await fetch(`/api/imgUpload/?url=${profile_picture_url}`, {
			method: "DELETE",
		});
		const deletedImageData = await res.json();
		if (deletedImageData.status === 200) {
			setProfilePicture(undefined);
			setProfilePictureUrl(undefined);
			setPpShow(true);
			if (!signature) {
				setSigShow(false);
			}
		} else {
			toast.error("Failed to delete image");
		}
		setLoadingImg(false);
	}

	async function deleteSIGN(e: React.MouseEvent<SVGElement, MouseEvent>) {
		setLoadingSig(true);
		if (!signature_url) {
			toast.error("No signature to delete");
			setLoadingSig(false);
			return;
		}
		const res = await fetch(`/api/imgUpload/?url=${signature_url}`, {
			method: "DELETE",
		});
		const deletedImageData = await res.json();
		if (deletedImageData.status === 200) {
			setSignature(undefined);
			setSignatureUrl(undefined);
			if (profile_picture) {
				setSigShow(true);
			} else {
				setPpShow(true);
			}
		} else {
			toast.error("Failed to delete image");
		}
		setLoadingSig(false);
	}

	if (loading) {
		return <Spin fullscreen={true} />;
	}

	return (
		<div className=" w-full h-full max-w-md mx-auto p-6 flex flex-col justify-center gap-y-[32px] pt-16 overflow-x-hidden">
			<div className="flex flex-col items-center gap-y-[32px]">
				<div className="bg-white border p-[14px] rounded-[12px] ">
					<Image
						src="/assets/Icons/upload-cloud-02.svg"
						width={28}
						height={28}
						alt="mail"
					/>
				</div>

				<div className="flex flex-col gap-y-[0.75rem]">
					<h2 className="text-[1.875rem] text-[#181D27] font-semibold text-center">
						Upload your photo/signature
					</h2>
					<h2 className="text-center text-[#535862]">
						Please upload your personal photo and signature
					</h2>
				</div>
			</div>

			<form className="space-y-4" onSubmit={handleSubmit}>
				{ppShow && (
					<>
						<div className="font-semibold text-xl">Photo</div>
						<div
							className={`flex flex-col gap-y-[12px] p-x[24] py-[16px] items-center text-[14px] text-[#535862] justify-center w-full border ${
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
									SVG, PNG, JPG or GIF (max. 800&times;400px)
								</p>
							</div>
						</div>
					</>
				)}

				<input
					title="profile_picture"
					type="file"
					ref={fileInputRef}
					className="hidden"
					accept=".svg, .png, .jpg, .jpeg, .gif"
					onChange={handleFileChange}
					multiple={false}
				/>

				{profile_picture && (
					<div className="flex p-[16px] items-center bg-white justify-between border rounded-[12px]">
						<div className="flex items-center gap-x-[12px]">
							<Image
								src={URL.createObjectURL(profile_picture)}
								width={50}
								height={50}
								alt="profile"
								className="h-full object-cover border "
							/>
							<div className="flex flex-col text-[14px]">
								<p className="text-[#414651] font-[500]">
									{profile_picture.name}
								</p>
								<p className="text-[#535862]">
									{(
										profile_picture.size /
										1024 /
										1024
									).toFixed(2)}{" "}
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
				)}
				{sigShow && (
					<>
						<div className="font-semibold text-xl">Signature</div>
						<div
							className={`flex flex-col gap-y-[12px] p-x[24] py-[16px] items-center text-[14px] text-[#535862] justify-center w-full border ${
								isDragging2
									? "border-[#7F56D9]"
									: "border-[#E9EAEB]"
							} border rounded-[12px] bg-white hover:bg-gray-50 cursor-pointer`}
							onClick={handleUploadClick2}
							onDragOver={handleDragOver2}
							onDragLeave={handleDragLeave2}
							onDrop={handleDrop2}
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
									SVG, PNG, JPG or GIF (max. 800&times;400px)
								</p>
							</div>
						</div>
					</>
				)}

				<input
					title="profile_picture"
					type="file"
					ref={fileInputRef2}
					className="hidden"
					accept=".svg, .png, .jpg, .jpeg, .gif"
					onChange={handleFileChange2}
					multiple={false}
				/>

				{signature && (
					<div className="flex p-[16px] items-center bg-white justify-between border rounded-[12px]">
						<div className="flex items-center gap-x-[12px]">
							<Image
								src={URL.createObjectURL(signature)}
								width={50}
								height={50}
								alt="profile"
								className="h-full object-cover border "
							/>
							<div className="flex flex-col text-[14px]">
								<p className="text-[#414651] font-[500]">
									{signature.name}
								</p>
								<p className="text-[#535862]">
									{(signature.size / 1024 / 1024).toFixed(2)}{" "}
									MB
								</p>
							</div>
						</div>
						{loadingSig ? (
							<Spin />
						) : (
							<X
								onClick={deleteSIGN}
								className="cursor-pointer text-[#7F56D9] hover:text-[#6847b1]"
								size={48}
							/>
						)}
					</div>
				)}

				<button className="w-full p-[10px] font-semibold bg-[#7F56D9] text-white rounded-md hover:bg-[#6947b1]">
					Submit
				</button>
			</form>
			<div className="flex gap-[1rem] w-full justify-center mt-8">
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#E9EAEB] rounded-full"></div>
				<div className="min-h-[0.625rem] max-h-[0.625rem] min-w-[0.625rem] max-w-[0.625rem] bg-[#7F56D9] rounded-full"></div>
			</div>
		</div>
	);
}
