import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/models/Event";
import { currentUser } from "@clerk/nextjs/server";

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

		const latestThreeEvents = await Event.find({ is_active: true })
			.sort({ start_date: -1 })
			.limit(3);

		return NextResponse.json(
			{ events: latestThreeEvents },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
