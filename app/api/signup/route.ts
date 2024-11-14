import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import User from "@/models/User";

export const POST = async (req: Request) => {
	try {
		await connectToDB();

		const { tempUser } = await req.json();

		if (!tempUser) {
			return NextResponse.json(
				{ message: "Invalid name, email, or password" },
				{ status: 400 }
			);
		}
		const clerkId = tempUser.clerkId;

		const newRes = await fetch(
			`https://api.clerk.dev/v1/users/${clerkId}`,
			{
				headers: {
					Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
					"Content-Type": "application/json",
				},
				method: "PATCH",
				body: JSON.stringify({
					public_metadata: {
						role: ["user"],
					},
				}),
			}
		);

		if (!newRes.ok) {
			return NextResponse.json(
				{ message: "Invalid clerkId" },
				{ status: 400 }
			);
		}

		tempUser.password = "";
		tempUser.role = ["user"];

		const fullname = tempUser.fullname;
		const fathername = tempUser.fathername;
		const mothername = tempUser.mothername;
		const email = tempUser.email;
		const phone = tempUser.phone;
		const house_no = tempUser.house_no;
		const village = tempUser.village;
		const po = tempUser.po;
		const ps = tempUser.ps;
		const district = tempUser.district;
		const password = tempUser.password;
		const nid_number = tempUser.nid_number;
		const bank_account_number = tempUser.bank_account_number;
		const bank_account_holder_name = tempUser.bank_account_holder_name;
		const bank_name = tempUser.bank_name;
		const bank_district = tempUser.bank_district;
		const bank_branch = tempUser.bank_branch;
		const profile_picture = tempUser.profile_picture;
		const signature = tempUser.signature;
		const routing_number = tempUser.routing_number;

		await User.create({
			fullname,
			fathername,
			mothername,
			email,
			phone,
			house_no,
			village,
			po,
			ps,
			district,
			password,
			nid_number,
			bank_info: [
				{
					bank_account_number,
					bank_account_holder_name,
					bank_name,
					bank_district,
					bank_branch,
					routing_number,
				},
			],
			profile_picture,
			signature,
			clerkId,
		});

		return NextResponse.json(
			{ message: "Successfully signed up" },
			{ status: 201 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
};
