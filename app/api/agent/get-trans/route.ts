import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoDB";
import { currentUser } from "@clerk/nextjs/server";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import Event from "@/models/Event";

interface Bank {
	_id: string;
	bank_account_number: string;
	bank_account_holder_name: string;
	bank_name: string;
	bank_district: string;
	bank_branch: string;
	routing_number: string;
}

interface Event {
	_id: string;
	name: string;
	tagline: string;
	banner: string;
	roi: number;
	minimum_deposit: number;
	maximum_deposit: number;
	duration: number;
	start_date: Date;
}

interface Investor {
	name: string;
	nid: string;
	nominee_name: string;
	nominee_nid: string;
	payment_method: string;
	date: Date;
	amount: number;
	percentage: number;
}

interface Trans {
	event: Event;
	user?: any;
	agent_bank_info: Bank;
	admin_bank_info: Bank;
	amount: number;
	picture: string;
	investors: Investor[];
}

export const GET = async (req: Request) => {
	try {
		await connectToDB();

		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ message: "অননুমোদিত" }, { status: 401 });
		}

		const role: string[] = user.publicMetadata.role as string[];

		if (!role.includes("user")) {
			return NextResponse.json({ message: "অননুমোদিত" }, { status: 401 });
		}

		const newUser = await User.findOne({ clerkId: user.id });
		const transactions = newUser.bank_info;

		return NextResponse.json(transactions, { status: 200 });
	} catch (err) {
		return NextResponse.json(
			{ message: "অভ্যন্তরীণ সার্ভার ত্রুটি" },
			{ status: 500 }
		);
	}
};

export const POST = async (req: Request) => {
	try {
		await connectToDB();

		const user = await currentUser();

		if (!user) {
			return NextResponse.json({ message: "অননুমোদিত" }, { status: 401 });
		}

		const role: string[] = user.publicMetadata.role as string[];

		if (!role.includes("user")) {
			return NextResponse.json({ message: "অননুমোদিত" }, { status: 401 });
		}

		const newUser = await User.findOne({ clerkId: user.id });
		if (!newUser) {
			return NextResponse.json(
				{ message: "ব্যবহারকারী পাওয়া যায়নি" },
				{ status: 404 }
			);
		}

		const { trans } = await req.json();

		const fromBody: Trans = trans;

		if (!fromBody) {
			return NextResponse.json(
				{ message: "তথ্য প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		const event = await Event.findOne({ _id: fromBody.event._id });

		if (!event) {
			return NextResponse.json(
				{ message: "ইভেন্ট পাওয়া যায়নি" },
				{ status: 404 }
			);
		}

		const agent_bank_info = fromBody.agent_bank_info;

		if (!agent_bank_info) {
			return NextResponse.json(
				{ message: "এজেন্ট ব্যাংক তথ্য প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		if (
			!agent_bank_info.bank_account_number ||
			!agent_bank_info.bank_account_holder_name ||
			!agent_bank_info.bank_name ||
			!agent_bank_info.bank_district ||
			!agent_bank_info.bank_branch ||
			!agent_bank_info.routing_number
		) {
			return NextResponse.json(
				{ message: "এজেন্ট ব্যাংক তথ্য প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		const userBankInfo = newUser.bank_info;

		let isMatch = false;

		for (let i = 0; i < userBankInfo.length; i++) {
			const bank = userBankInfo[i];

			if (
				bank.bank_account_number ===
					agent_bank_info.bank_account_number &&
				bank.bank_account_holder_name ===
					agent_bank_info.bank_account_holder_name &&
				bank.bank_name === agent_bank_info.bank_name &&
				bank.bank_district === agent_bank_info.bank_district &&
				bank.bank_branch === agent_bank_info.bank_branch &&
				bank.routing_number === agent_bank_info.routing_number
			) {
				isMatch = true;
				break;
			}
		}

		if (!isMatch) {
			return NextResponse.json(
				{ message: "এজেন্ট ব্যাংক তথ্য মেলেনি" },
				{ status: 400 }
			);
		}

		const admin_bank_info = fromBody.admin_bank_info;

		if (!admin_bank_info) {
			return NextResponse.json(
				{ message: "প্রাপকের ব্যাংক তথ্য প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		if (
			!admin_bank_info.bank_account_number ||
			!admin_bank_info.bank_account_holder_name ||
			!admin_bank_info.bank_name ||
			!admin_bank_info.bank_district ||
			!admin_bank_info.bank_branch ||
			!admin_bank_info.routing_number
		) {
			return NextResponse.json(
				{ message: "প্রাপকের ব্যাংক তথ্য প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		const adminUser = await User.findOne({ role: { $in: ["admin"] } });

		const adminBankInfo = adminUser.bank_info;

		let isAdminMatch = false;

		for (let i = 0; i < adminBankInfo.length; i++) {
			const bank = adminBankInfo[i];

			if (
				bank.bank_account_number ===
					admin_bank_info.bank_account_number &&
				bank.bank_account_holder_name ===
					admin_bank_info.bank_account_holder_name &&
				bank.bank_name === admin_bank_info.bank_name &&
				bank.bank_district === admin_bank_info.bank_district &&
				bank.bank_branch === admin_bank_info.bank_branch &&
				bank.routing_number === admin_bank_info.routing_number
			) {
				isAdminMatch = true;
				break;
			}
		}

		if (!isAdminMatch) {
			return NextResponse.json(
				{ message: "প্রাপকের ব্যাংক তথ্য মেলেনি" },
				{ status: 400 }
			);
		}

		const investors = fromBody.investors;

		if (!investors) {
			return NextResponse.json(
				{ message: "কো-ইনভেস্টর প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		if (investors.length === 0) {
			return NextResponse.json(
				{ message: "কো-ইনভেস্টর প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		for (let i = 0; i < investors.length; i++) {
			const investor = investors[i];

			if (
				!investor.name ||
				!investor.nid ||
				!investor.nominee_name ||
				!investor.nominee_nid ||
				!investor.payment_method ||
				!investor.date ||
				!investor.amount ||
				!investor.percentage
			) {
				return NextResponse.json(
					{ message: "কো-ইনভেস্টর তথ্য প্রদান করা হয়নি" },
					{ status: 400 }
				);
			}
		}

		if (!fromBody.picture) {
			return NextResponse.json(
				{ message: "ছবি প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		if (!fromBody.amount) {
			return NextResponse.json(
				{ message: "পরিমাণ প্রদান করা হয়নি" },
				{ status: 400 }
			);
		}

		const event_start_date = new Date(event.start_date);
		const event_duration = event.duration;

		const now = new Date();

		const diff = now.getTime() - event_start_date.getTime();
		const diffMonths = diff / (1000 * 60 * 60 * 24 * 30);

		if (diffMonths > event_duration) {
			return NextResponse.json(
				{ message: "ইভেন্ট শেষ হয়ে গিয়েছে" },
				{ status: 400 }
			);
		}

		if (event.minimum_deposit > fromBody.amount) {
			return NextResponse.json(
				{ message: "পরিমাণ সর্বনিম্ন ডিপোজিটের চেয়ে কম" },
				{ status: 400 }
			);
		}

		const transactions = await Transaction.find({ event: event._id });

		const totalInvested = transactions.reduce((acc, curr) => {
			return acc + curr.amount;
		}, 0);

		const remaining = event.maximum_deposit - totalInvested;

		if (fromBody.event.minimum_deposit > remaining) {
			return NextResponse.json(
				{
					message: `এই ইভেন্টে আর ডিপোজিট করা যাবে না`,
				},
				{ status: 400 }
			);
		}

		if (fromBody.amount > event.maximum_deposit - totalInvested) {
			return NextResponse.json(
				{
					message: `এই ইভেন্টে সর্বচ্চো  ${
						event.maximum_deposit - totalInvested
					} টাকা ডিপোজিট করা যাবে`,
				},
				{ status: 400 }
			);
		}

		if (!event.is_active) {
			return NextResponse.json(
				{ message: "ইভেন্ট সক্রিয় নয়" },
				{ status: 400 }
			);
		}

		const transaction = new Transaction({
			agent_bank_info: fromBody.agent_bank_info,
			admin_bank_info: fromBody.admin_bank_info,
			amount: fromBody.amount,
			picture: fromBody.picture,
			investors: fromBody.investors,
			user: newUser,
			event: event,
		});

		await transaction.save();

		return NextResponse.json(
			{ message: "লেনদেন সফলভাবে সম্পন্ন হয়েছে" },
			{ status: 200 }
		);
	} catch (err) {
		return NextResponse.json(
			{ message: "অভ্যন্তরীণ সার্ভার ত্রুটি" },
			{ status: 500 }
		);
	}
};
