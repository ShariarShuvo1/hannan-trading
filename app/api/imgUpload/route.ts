import { NextResponse } from "next/server";
import crypto from "crypto";

export const POST = async (req: Request) => {
	try {
		const formData = await req.formData();
		const img = formData.get("file");

		if (!img) {
			return NextResponse.json(
				{ message: "No valid image found" },
				{ status: 400 }
			);
		}
		const uploadResponse = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
			{
				method: "POST",
				body: formData,
			}
		);

		if (!uploadResponse.ok) {
			return NextResponse.json(
				{ message: "Failed to upload image" },
				{ status: uploadResponse.status }
			);
		}

		const uploadedImageData = await uploadResponse.json();
		return NextResponse.json({
			uploadedImageData,
			message: "Success",
			status: 200,
		});
	} catch (error) {
		return NextResponse.json(
			{ message: "Error uploading image" },
			{ status: 500 }
		);
	}
};

export async function DELETE(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const url = searchParams.get("url");
		if (!url) {
			return NextResponse.json(
				{ message: "No valid image URL provided" },
				{ status: 400 }
			);
		}

		const regex = /\/upload\/v\d+\/([^/.]+)\.\w{3,4}$/;
		const match = url.match(regex);
		if (!match || !match[1]) {
			return NextResponse.json(
				{ message: "No valid public ID found in the URL" },
				{ status: 400 }
			);
		}

		const publicId = match[1];
		const timestamp = Math.floor(Date.now() / 1000).toString();
		const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
		const signature = crypto
			.createHash("sha1")
			.update(stringToSign)
			.digest("hex");

		const formData = new FormData();
		formData.append("public_id", publicId);
		formData.append("signature", signature);
		formData.append("api_key", process.env.CLOUDINARY_API_KEY || "");
		formData.append("timestamp", timestamp);

		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`,
			{
				method: "POST",
				body: formData,
			}
		);

		const data = await res.json();
		if (!res.ok) {
			return NextResponse.json(
				{ message: data.error?.message || "Failed to delete image" },
				{ status: res.status }
			);
		}

		return NextResponse.json({
			message: "Image deleted successfully",
			status: 200,
		});
	} catch (error) {
		return NextResponse.json(
			{
				message: "Error deleting image",
				error: (error as Error).message,
			},
			{ status: 500 }
		);
	}
}
