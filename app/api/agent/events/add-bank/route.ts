import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req: Request) => {
	try {
		await connectToDB();

		const user = await currentUser();

		if (!user) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const role: string[] = user.publicMetadata.role as string[];

		if (!role.includes("user")) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const {
			bank_account_number,
			routing_number,
			bank_account_holder_name,
			bank_name,
			bank_district,
			bank_branch,
		} = await req.json();
		if (
			!bank_account_number ||
			!routing_number ||
			!bank_account_holder_name ||
			!bank_name ||
			!bank_district ||
			!bank_branch
		) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		const newUser = await User.findOne({ clerkId: user.id });
		if (!newUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		newUser.bank_info.push({
			bank_account_number,
			routing_number,
			bank_account_holder_name,
			bank_name,
			bank_district,
			bank_branch,
		});

		await newUser.save();

		//get the last bank added
		const bank = newUser.bank_info[newUser.bank_info.length - 1];

		return NextResponse.json(
			{ message: "Bank added successfully", bank },
			{ status: 200 }
		);
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const user = await currentUser();

		if (!user) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const role: string[] = user.publicMetadata.role as string[];

		if (!role.includes("user")) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const newUser = await User.findOne({ clerkId: user.id });
		if (!newUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(newUser.bank_info, { status: 200 });
	} catch (err) {
		console.log(err);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const DELETE = async (req: Request) => {
	try {
		await connectToDB();

		const user = await currentUser();

		if (!user) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const role: string[] = user.publicMetadata.role as string[];

		if (!role.includes("user")) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { selectedBanks } = await req.json();

		if (!selectedBanks || !Array.isArray(selectedBanks)) {
			return NextResponse.json(
				{ message: "selectedBanks must be an array" },
				{ status: 400 }
			);
		}

		const tempUser = await User.findOne({ clerkId: user.id });

		if (!tempUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		if (tempUser.bank_info.length - selectedBanks.length < 1) {
			return NextResponse.json(
				{ message: "You must have at least one bank account" },
				{ status: 400 }
			);
		}

		const newUser = await User.findOneAndUpdate(
			{ clerkId: user.id },
			{
				$pull: {
					bank_info: {
						_id: { $in: selectedBanks.map((id: string) => id) },
					},
				},
			},
			{ new: true }
		);

		if (!newUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(
			{
				message: "Bank deleted successfully",
				bank_info: newUser.bank_info,
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
