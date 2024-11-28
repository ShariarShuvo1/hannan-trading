import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { currentUser, clerkClient } from "@clerk/nextjs/server";

interface ReturnBody {
	_id: string;
	profile_picture: string;
	fullname: string;
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

		const query = search_text
			? {
					$or: [
						{ fullname: { $regex: search_text, $options: "i" } },
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
			  }
			: {};

		const users = await User.find(query)
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
					email: user.email,
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

export const DELETE = async (req: Request) => {
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

		const { agentId } = await req.json();

		const agent = await User.findById(agentId);

		if (!agent)
			return NextResponse.json(
				{ message: "Agent not found" },
				{ status: 404 }
			);

		if (agent.clerkId === user.id) {
			return NextResponse.json(
				{ message: "You can't delete yourself" },
				{ status: 400 }
			);
		}

		const clerk = await clerkClient();
		await clerk.users.deleteUser(agent.clerkId);

		await Transaction.deleteMany({ user: agent._id });

		await User.findByIdAndDelete(agent._id);

		return NextResponse.json({ message: "Agent deleted successfully" });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
