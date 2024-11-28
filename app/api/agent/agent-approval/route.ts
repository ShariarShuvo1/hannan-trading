import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

interface TempUser {
	admin_verified: boolean;
	_id: string;
}

export const POST = async (req: Request) => {
	try {
		await connectToDB();
		const { clerkId } = await req.json();

		if (!clerkId) {
			return NextResponse.json(
				{ message: "Clerk ID is required" },
				{ status: 400 }
			);
		}

		const user = await User.findOne({ clerkId: clerkId });

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}
		const { admin_verified, _id } = user;
		const tempUser: TempUser = { admin_verified, _id };
		return NextResponse.json(tempUser, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
