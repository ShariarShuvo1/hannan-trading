import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import Investor from "@/models/Investor";
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
		if (!role.includes("admin")) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const dbUser = await User.findOne({ clerkId: user.id });
		if (!dbUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const { page, search_text } = await req.json();
		const limit = 10;
		const skip = (page - 1) * limit;

		let query: any = {};
		if (search_text) {
			query = {
				...query,
				$or: [
					{ name: { $regex: search_text, $options: "i" } },
					{ address: { $regex: search_text, $options: "i" } },
					{ phone: { $regex: search_text, $options: "i" } },
				],
			};
		}

		const investors = await Investor.find(query)
			.skip(skip)
			.limit(limit)
			.lean();

		const totalInvestors = await Investor.countDocuments(query);
		const totalPages = Math.ceil(totalInvestors / limit);

		return NextResponse.json({
			investors,
			totalPages,
		});
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
