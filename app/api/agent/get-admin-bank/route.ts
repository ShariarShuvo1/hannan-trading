import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";

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

		const newUser = await User.findOne({ role: { $in: ["admin"] } });

		const transactions = newUser.bank_info;

		return NextResponse.json(transactions, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
