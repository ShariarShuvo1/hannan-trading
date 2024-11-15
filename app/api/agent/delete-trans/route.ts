import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Event from "@/models/Event";

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

		const { transId } = await req.json();

		if (!transId) {
			return NextResponse.json(
				{ message: "Transaction ID is required" },
				{ status: 400 }
			);
		}

		const transaction = await Transaction.findById(transId);

		if (!transaction) {
			return NextResponse.json(
				{ message: "Transaction not found" },
				{ status: 404 }
			);
		}

		await Transaction.findByIdAndDelete(transId);

		return NextResponse.json(
			{ message: "Transaction deleted successfully" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
