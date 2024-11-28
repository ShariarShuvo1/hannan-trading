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

		const {
			name,
			tagline,
			banner,
			roi,
			minimum_deposit,
			maximum_deposit,
			duration,
		} = await req.json();

		if (
			!name ||
			!tagline ||
			!banner ||
			!roi ||
			!minimum_deposit ||
			!maximum_deposit ||
			!duration
		) {
			return NextResponse.json(
				{ message: "Please fill all fields" },
				{ status: 400 }
			);
		}

		if (minimum_deposit > maximum_deposit) {
			return NextResponse.json(
				{
					message:
						"Minimum deposit cannot be greater than maximum deposit",
				},
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
			maximum_deposit,
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
		const eventId = searchParams.get("eventId");

		if (!eventId) {
			return NextResponse.json(
				{ message: "Event ID is required" },
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
			maximum_deposit,
			duration,
			eventId,
		} = await req.json();

		if (
			!name ||
			!tagline ||
			!banner ||
			!roi ||
			!minimum_deposit ||
			!maximum_deposit ||
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
		event.maximum_deposit = maximum_deposit;
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

export const DELETE = async (req: Request) => {
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

		const { eventId } = await req.json();

		if (!eventId) {
			return NextResponse.json(
				{ message: "Event ID is required" },
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

		await Event.findByIdAndUpdate(eventId, { is_active: !event.is_active });

		return NextResponse.json(
			{ message: "Event Privecy Changed Successfully" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
