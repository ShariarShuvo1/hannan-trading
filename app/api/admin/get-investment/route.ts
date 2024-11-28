import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
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

		const newUser = await User.findOne({ clerkId: user.id });
		if (!newUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const {
			page = 1,
			days,
			itemsPerPage = 10,
			search_text,
		} = await req.json();
		if (!days) {
			return NextResponse.json(
				{ message: "Days parameter is required" },
				{ status: 400 }
			);
		}

		const today = new Date();
		const startDate = new Date(today);
		startDate.setDate(today.getDate() - days);

		const query: any = {
			created_at: { $gte: startDate, $lte: today },
		};

		if (search_text) {
			const searchRegex = new RegExp(search_text, "i");
			query.$or = [
				{ "agent_bank_info.bank_account_number": searchRegex },
				{ "agent_bank_info.bank_name": searchRegex },
				{ "admin_bank_info.bank_account_number": searchRegex },
				{ "admin_bank_info.bank_name": searchRegex },
				{ "event.name": searchRegex },
				{ "event.tagline": searchRegex },
				{ "user.fullname": searchRegex },
				{ "user.email": searchRegex },
				{ "user.phone": searchRegex },
				{
					investors: {
						$elemMatch: {
							$name: { $regex: searchRegex },
							nid: { $regex: searchRegex },
							nominee_name: { $regex: searchRegex },
							nominee_nid: { $regex: searchRegex },
							payment_method: { $regex: searchRegex },
						},
					},
				},
			];
		}

		const skip = (page - 1) * itemsPerPage;
		const totalTransactions = await Transaction.countDocuments(query);
		const totalPages = Math.ceil(totalTransactions / itemsPerPage);

		const results = await Transaction.find(query)
			.populate("user", "_id fullname email phone profile_picture")
			.populate("event", "_id name tagline banner")
			.skip(skip)
			.limit(itemsPerPage)
			.sort({ created_at: -1 });

		return NextResponse.json({ results, totalPages });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const PUT = async (req: Request) => {
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

		const newUser = await User.findOne({ clerkId: user.id });
		if (!newUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const { transaction_id } = await req.json();
		if (!transaction_id) {
			return NextResponse.json(
				{ message: "Transaction ID is required" },
				{ status: 400 }
			);
		}

		const transaction = await Transaction.findById(transaction_id);

		if (!transaction) {
			return NextResponse.json(
				{ message: "Transaction not found" },
				{ status: 404 }
			);
		}

		transaction.is_approved = true;

		await transaction.save();

		return NextResponse.json({ message: "Transaction approved" });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
