import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

export const POST = async (req: Request) => {
	try {
		await connectToDB();
		const { tempUser } = await req.json();

		if (!tempUser) {
			return NextResponse.json(
				{ message: "Invalid name, email, or password" },
				{ status: 400 }
			);
		}
		const email = tempUser.email;
		let user = await User.findOne({ email });
		if (user) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 }
			);
		}

		user = await User.create(tempUser);
		return NextResponse.json(
			{ message: "Successfully signed up", id: user._id },
			{ status: 201 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
