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
		const transactions = newUser.bank_info;

		return NextResponse.json(transactions, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

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

		const newUser = await User.findOne({ clerkId: user.id });
		if (!newUser) {
			return NextResponse.json(
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const {
			bank_account_number,
			routing_number,
			bank_account_holder_name,
			bank_name,
			bank_district,
			bank_branch,
			amount,
			picture,
			eventId,
		} = await req.json();

		if (
			!bank_account_number ||
			!routing_number ||
			!bank_account_holder_name ||
			!bank_name ||
			!bank_district ||
			!bank_branch ||
			!amount ||
			!picture ||
			!eventId
		) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		const event = await Event.findOne({ _id: eventId });

		const event_start_date = new Date(event.start_date);
		const event_duration = event.duration; //in months

		const now = new Date();

		const diff = now.getTime() - event_start_date.getTime();
		const diffMonths = diff / (1000 * 60 * 60 * 24 * 30);

		if (diffMonths > event_duration) {
			return NextResponse.json(
				{ message: "Event has ended" },
				{ status: 400 }
			);
		}

		if (!event) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		if (event.minimum_deposit > amount) {
			return NextResponse.json(
				{ message: "Amount is less than the minimum deposit" },
				{ status: 400 }
			);
		}

		const transaction = new Transaction({
			bank_account_number,
			routing_number,
			bank_account_holder_name,
			bank_name,
			bank_district,
			bank_branch,
			amount,
			picture,
			event,
			user: newUser,
		});

		await transaction.save();

		return NextResponse.json(
			{ message: "Transaction added successfully" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
