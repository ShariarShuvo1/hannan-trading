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
		const clerkId = tempUser.clerkId;

		const newRes = await fetch(
			`https://api.clerk.dev/v1/users/${clerkId}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
				method: "PATCH",
				body: JSON.stringify({
					public_metadata: {
						role: ["user"],
					},
				}),
			}
		);

		if (!newRes.ok) {
			return NextResponse.json(
				{ message: "Invalid clerkId" },
				{ status: 400 }
			);
		}

		tempUser.password = "";
		tempUser.role = ["user"];
		await User.create(tempUser);

		return NextResponse.json(
			{ message: "Successfully signed up" },
			{ status: 201 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
