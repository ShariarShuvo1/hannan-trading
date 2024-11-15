import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Investor from "@/models/Investor";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

interface Person {
	name?: string;
	phone: string;
	deposits: number[];
	address?: string;
}

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
				{ message: "User not found" },
				{ status: 404 }
			);
		}

		const { persons } = (await req.json()) as { persons: Person[] };

		if (!persons) {
			return NextResponse.json(
				{ message: "Persons are required" },
				{ status: 400 }
			);
		}

		let addedCount = 0;
		let updatedCount = 0;

		for (const person of persons) {
			const existingInvestor = await Investor.findOne({
				phone: person.phone,
				agent: dbUser._id,
			});

			if (existingInvestor) {
				const newDeposits = person.deposits.map((amount) => ({
					amount,
				}));
				existingInvestor.deposits.push(...newDeposits);
				await existingInvestor.save();
				updatedCount++;
			} else {
				const newInvestor = new Investor({
					name: person.name,
					phone: person.phone,
					deposits: person.deposits.map((amount) => ({ amount })),
					address: person.address,
					agent: dbUser._id,
				});
				await newInvestor.save();
				addedCount++;
			}
		}

		return NextResponse.json(
			{
				message: `Total ${addedCount + updatedCount} persons processed`,
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
