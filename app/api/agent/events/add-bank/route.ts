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

		return NextResponse.json(
			{ message: "Bank added successfully" },
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
