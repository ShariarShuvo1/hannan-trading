import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import Event from "@/models/Event";
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

		if (!role.includes("user")) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { page, roi_based_sorting, date_based_sorting, search_text } =
			await req.json();

		if (!page) {
			return NextResponse.json(
				{ message: "Page number is required" },
				{ status: 400 }
			);
		}

		if (
			roi_based_sorting &&
			roi_based_sorting !== "asc" &&
			roi_based_sorting !== "desc"
		) {
			return NextResponse.json(
				{ message: "Invalid sorting value" },
				{ status: 400 }
			);
		}

		if (
			date_based_sorting &&
			date_based_sorting !== "asc" &&
			date_based_sorting !== "desc"
		) {
			return NextResponse.json(
				{ message: "Invalid sorting value" },
				{ status: 400 }
			);
		}

		const sortOrder = (order: string) => (order === "asc" ? 1 : -1);

		let query = {};
		let sortCondition = {};

		if (search_text) {
			query = {
				$and: [
					{ is_active: true },
					{
						$or: [
							{ name: { $regex: search_text, $options: "i" } },
							{ tagline: { $regex: search_text, $options: "i" } },
							{
								$expr: {
									$regexMatch: {
										input: { $toString: "$roi" },
										regex: search_text,
										options: "i",
									},
								},
							},
						],
					},
				],
			};
		} else {
			query = { is_active: true };
		}

		if (roi_based_sorting === "desc") {
			sortCondition = { roi: sortOrder(roi_based_sorting) };
		} else if (date_based_sorting === "desc") {
			sortCondition = { start_date: sortOrder(date_based_sorting) };
		}

		const eventEachPage = 9;

		const events = await Event.find(query)
			.sort(sortCondition)
			.skip((page - 1) * eventEachPage)
			.limit(eventEachPage);

		if (!events) {
			return NextResponse.json(
				{ message: "No events found" },
				{ status: 404 }
			);
		}

		const totalPages = Math.ceil(
			(await Event.countDocuments(query)) / eventEachPage
		);

		return NextResponse.json({ events, totalPages }, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
