import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Investor from "@/models/Investor";

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

		const dbUser = await User.findOne({ clerkId: user.id });

		if (!dbUser) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { _id } = await req.json();

		if (!_id) {
			return NextResponse.json(
				{ message: "Invalid request" },
				{ status: 400 }
			);
		}

		const investor = await Investor.findById(_id);

		if (!investor) {
			return NextResponse.json(
				{ message: "Investor not found" },
				{ status: 404 }
			);
		}

		await Investor.findByIdAndDelete(_id);

		return NextResponse.json(
			{ message: "Investor deleted" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
