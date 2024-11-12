import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

interface TempUser {
	fullname: string;
	profile_picture: string;
	role: string;
	_id: string;
}

export const GET = async (req: Request) => {
	try {
		await connectToDB();
		const { searchParams } = new URL(req.url);
		const email = searchParams.get("email");

		if (!email) {
			return NextResponse.json(
				{ message: "Email is required" },
				{ status: 400 }
			);
		}

		const user = await User.findOne({ email });

		if (!user) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}
		const { fullname, profile_picture, role, _id } = user;
		const tempUser: TempUser = { fullname, profile_picture, role, _id };
		return NextResponse.json(tempUser, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
