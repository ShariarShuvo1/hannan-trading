import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Event from "@/models/Event";

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
		const total_invested = await Transaction.aggregate([
			{
				$match: {
					user: newUser._id,
				},
			},
			{
				$group: {
					_id: "$user",
					total: { $sum: "$amount" },
				},
			},
		]);

		const all_date_and_amount = await Transaction.aggregate([
			{
				$match: {
					user: newUser._id,
				},
			},
			{
				$group: {
					_id: {
						year: { $year: "$created_at" },
						month: { $month: "$created_at" },
						day: { $dayOfMonth: "$created_at" },
					},
					totalAmount: { $sum: "$amount" },
				},
			},
			{
				$project: {
					date: {
						$concat: [
							{ $toString: "$_id.year" },
							"-",
							{ $toString: "$_id.month" },
							"-",
							{ $toString: "$_id.day" },
						],
					},
					totalAmount: 1,
					_id: 0,
				},
			},
		]);


		return NextResponse.json(
			{
				total_invested: total_invested[0].total,
				all_date_and_amount,
			},
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
