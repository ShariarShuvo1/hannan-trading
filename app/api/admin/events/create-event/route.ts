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

		if (!role.includes("admin")) {
			return NextResponse.json(
				{ message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { name, tagline, banner, roi, minimum_deposit, duration } =
			await req.json();

		if (
			!name ||
			!tagline ||
			!banner ||
			!roi ||
			!minimum_deposit ||
			!duration
		) {
			return NextResponse.json(
				{ message: "Please fill all fields" },
				{ status: 400 }
			);
		}

		const newEvent = new Event({
			name,
			tagline,
			banner,
			roi,
			minimum_deposit,
			duration,
		});

		await newEvent.save();
		return NextResponse.json(
			{ message: "Event created successfully" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};

export const GET = async (req: Request) => {
	try {
		await connectToDB();
		console.log("heyya");

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

		const { searchParams } = new URL(req.url);
		console.log(searchParams);
		const eventId = searchParams.get("eventId");

		if (!eventId) {
			return NextResponse.json(
				{ message: "Event ID is required" },
				{ status: 400 }
			);
		}

		console.log(eventId);

		const event = await Event.findById(eventId);
		console.log(event);

		if (!event) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(event, { status: 200 });
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

		const {
			name,
			tagline,
			banner,
			roi,
			minimum_deposit,
			duration,
			eventId,
		} = await req.json();

		if (
			!name ||
			!tagline ||
			!banner ||
			!roi ||
			!minimum_deposit ||
			!duration ||
			!eventId
		) {
			return NextResponse.json(
				{ message: "Please fill all fields" },
				{ status: 400 }
			);
		}

		const event = await Event.findById(eventId);

		if (!event) {
			return NextResponse.json(
				{ message: "Event not found" },
				{ status: 404 }
			);
		}

		event.name = name;
		event.tagline = tagline;
		event.banner = banner;
		event.roi = roi;
		event.minimum_deposit = minimum_deposit;
		event.duration = duration;

		await event.save();
		return NextResponse.json(
			{ message: "Event updated successfully" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
