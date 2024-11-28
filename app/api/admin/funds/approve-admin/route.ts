import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";
import { currentUser } from "@clerk/nextjs/server";

export const PUT = async (req: Request) => {
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

		await User.findByIdAndUpdate(agentId, { admin_verified: true });

		return NextResponse.json({ message: "Agent approved successfully" });
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
