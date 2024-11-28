import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { currentUser } from "@clerk/nextjs/server";

interface ReturnBody {
	_id: string;
	profile_picture: string;
	fullname: string;
	phone: string;
	email: string;
	amount: number;
}

export const POST = async (req: Request) => {
	try {
		await connectToDB();

		const user = await currentUser();
		if (!user)
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);

		const role: string[] = user.publicMetadata.role as string[];
		if (!role.includes("admin"))
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);

		const { page = 1, search_text } = await req.json();

		let query = {};
		let sort = {};

		if (search_text) {
			query = {
				$or: [
					{ fullname: { $regex: search_text, $options: "i" } },
					{ phone: { $regex: search_text, $options: "i" } },
					{ email: { $regex: search_text, $options: "i" } },
					{
						"bank_info.bank_account_holder_name": {
							$regex: search_text,
							$options: "i",
						},
					},
					{
						"bank_info.bank_name": {
							$regex: search_text,
							$options: "i",
						},
					},
					{
						"bank_info.bank_district": {
							$regex: search_text,
							$options: "i",
						},
					},
				],
			};
		} else {
			sort = { admin_verified: 1 };
		}

		const users = await User.find(query)
			.sort(sort)
			.skip((page - 1) * 10)
			.limit(10);

		const userDetails = await Promise.all(
			users.map(async (user) => {
				const totalAmount = await Transaction.aggregate([
					{ $match: { user: user._id } },
					{ $group: { _id: null, totalAmount: { $sum: "$amount" } } },
				]);

				return {
					_id: user._id.toString(),
					profile_picture: user.profile_picture,
					fullname: user.fullname,
					phone: user.phone,
					email: user.email,
					admin_verified: user.admin_verified,
					amount: totalAmount[0]?.totalAmount || 0,
				};
			})
		);

		return NextResponse.json({
			data: userDetails,
			totalPages: Math.ceil((await User.countDocuments(query)) / 10),
		});
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
