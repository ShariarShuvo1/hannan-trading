import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/models/Event";
import { currentUser } from "@clerk/nextjs/server";

interface ReturnBody {
	month: string;
	totalEvents: number;
}

export const GET = async (req: Request) => {
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

		const lastYear = new Date();
		lastYear.setFullYear(lastYear.getFullYear() - 1);

		const eventsPerMonth = await Event.aggregate([
			{ $match: { start_date: { $gte: lastYear } } },
			{
				$group: {
					_id: { $month: "$start_date" },
					totalEvents: { $sum: 1 },
				},
			},
			{
				$project: {
					month: {
						$arrayElemAt: [
							[
								"",
								"January",
								"February",
								"March",
								"April",
								"May",
								"June",
								"July",
								"August",
								"September",
								"October",
								"November",
								"December",
							],
							"$_id",
						],
					},
					totalEvents: 1,
				},
			},
			{ $sort: { _id: 1 } },
		]);

		const formattedEvents: ReturnBody[] = eventsPerMonth.map((event) => ({
			month: event.month,
			totalEvents: event.totalEvents,
		}));

		return NextResponse.json(formattedEvents);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
