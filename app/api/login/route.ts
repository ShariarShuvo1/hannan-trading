import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

export const POST = async (req: Request) => {
	try {
		await connectToDB();
		const { email, password } = await req.json();
		if (!email || !password) {
			return NextResponse.json(
				{ message: "Invalid email or password" },
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
		const isMatch = user.password === password;
		if (!isMatch) {
			return NextResponse.json(
				{ message: "Invalid email or password" },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: "Successfully logged in", id: user._id },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
