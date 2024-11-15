import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/models/Event";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { currentUser } from "@clerk/nextjs/server";

interface ReturnBody {
	event_id: string;
	event_name: string;
	event_banner: string;
	event_status: boolean;
	amount: number;
	bank_account_number: string;
	bank_name: string;
	transaction_created_at: Date;
	transaction_id: string;
	agent_name: string;
	agent_id: string;
	agent_email: string;
	agent_profile_picture: string;
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

		const newUser = await User.findOne({ clerkId: user.id });
		if (!newUser)
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);

		const { page = 1, days, search_text } = await req.json();
		if (!days)
			return NextResponse.json(
				{ message: "Days parameter is required" },
				{ status: 400 }
			);

		const today = new Date();
		const startDate = new Date(today);
		startDate.setDate(today.getDate() - days);

		const query: any = {
			created_at: { $gte: startDate, $lte: today },
		};

		const searchRegex = new RegExp(search_text, "i");

		// Find events matching search text in name or tagline
		const events = await Event.find(
			search_text
				? { $or: [{ name: searchRegex }, { tagline: searchRegex }] }
				: {}
		);
		const eventIds = events.map((event) => event._id);

		// Find users matching search text in fullname or email
		const users = await User.find(
			search_text
				? { $or: [{ fullname: searchRegex }, { email: searchRegex }] }
				: {}
		);
		const userIds = users.map((user) => user._id);

		if (eventIds.length > 0) query.event = { $in: eventIds };
		if (userIds.length > 0) query.user = { $in: userIds };

		const itemsPerPage = 10;
		const totalTransactions = await Transaction.countDocuments(query);
		const totalPages = Math.ceil(totalTransactions / itemsPerPage);

		const transactions = await Transaction.find(query)
			.populate("event")
			.populate("user")
			.skip((page - 1) * itemsPerPage)
			.limit(itemsPerPage);

		const results: ReturnBody[] = transactions.map((transaction) => {
			const event = transaction.event as any;
			const agent = transaction.user as any;
			const eventEndDate = new Date(event.start_date);
			eventEndDate.setMonth(eventEndDate.getMonth() + event.duration);
			const event_status = today < eventEndDate;

			return {
				event_id: event._id.toString(),
				event_name: event.name,
				event_banner: event.banner,
				event_status,
				amount: transaction.amount,
				bank_account_number: transaction.bank_account_number,
				bank_name: transaction.bank_name,
				transaction_created_at: transaction.created_at,
				transaction_id: transaction._id.toString(),
				agent_name: agent?.fullname || "",
				agent_id: agent?._id.toString() || "",
				agent_email: agent?.email || "",
				agent_profile_picture: agent?.profile_picture || "",
			};
		});

		return NextResponse.json({ results, totalPages });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
