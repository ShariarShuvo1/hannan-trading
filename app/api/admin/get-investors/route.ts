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

		const { page = 1, itemsPerPage = 10, search_text } = await req.json();

		const query: any = { is_approved: true };
		if (search_text) {
			const searchRegex = new RegExp(search_text, "i");
			query.$or = [
				{ "investors.name": searchRegex },
				{ "investors.nid": searchRegex },
				{ "investors.nominee_name": searchRegex },
				{ "investors.nominee_nid": searchRegex },
				{ "investors.payment_method": searchRegex },
			];
		}

		const transactions = await Transaction.find(query).select("investors");

		const allInvestors = transactions.flatMap(
			(transaction) => transaction.investors || []
		);
		const filteredInvestors = allInvestors.filter((investor) => {
			if (!search_text) return true;
			const searchRegex = new RegExp(search_text, "i");
			return (
				searchRegex.test(investor.$name) ||
				searchRegex.test(investor.nid) ||
				searchRegex.test(investor.nominee_name) ||
				searchRegex.test(investor.nominee_nid) ||
				searchRegex.test(investor.payment_method)
			);
		});

		const totalInvestors = filteredInvestors.length;
		const totalPages = Math.ceil(totalInvestors / itemsPerPage);
		const paginatedInvestors = filteredInvestors.slice(
			(page - 1) * itemsPerPage,
			page * itemsPerPage
		);

		return NextResponse.json({ investors: paginatedInvestors, totalPages });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
