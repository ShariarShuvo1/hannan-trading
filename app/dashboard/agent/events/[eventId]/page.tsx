"use client";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Spin } from "antd";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

interface Event {
	_id: string;
	name: string;
	tagline: string;
	banner: string;
	roi: number;
	minimum_deposit: number;
	duration: number;
	start_date: Date;
}

export default function Page() {
	const [event, setEvent] = useState<Event | null>(null);
	const router = useRouter();
	const { eventId } = useParams();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		async function fetchEvent() {
			try {
				setLoading(true);
				const res = await fetch(`/api/agent/events/${eventId}`);
				const data = await res.json();
				setEvent(data);
				setLoading(false);
			} catch (error) {
				toast.error("Failed to fetch event");
			}
		}
		fetchEvent();
	}, [eventId]);

	const generateExpectedReturnData = (minimumDeposit: any, roi: any) => {
		const data = [];
		if (event) {
			for (let i = 1; i <= event.duration; i++) {
				const value =
					minimumDeposit * (roi / 100) * i + +minimumDeposit;
				data.push({
					name: `মাস ${i}`,
					value: parseFloat(value.toFixed(2)),
				});
			}
		}

		return data;
	};

	const minimumDeposit = event?.minimum_deposit || 17500;
	const roi = event?.roi || 10;
	const expectedReturnData = generateExpectedReturnData(minimumDeposit, roi);

	function getROIData(): any[] {
		if (!event) return [];

		return [
			{ name: "শুরু", value: 0 },
			{ name: "ধাপ ১", value: event?.roi * 0.25 },
			{ name: "ধাপ ২", value: event?.roi * 0.5 },
			{ name: "ধাপ ৩", value: event?.roi * 0.75 },
			{ name: "শেষ", value: event?.roi },
		];
	}

	const isExpired = event
		? new Date() >
		  new Date(
				new Date(event.start_date).getTime() +
					event.duration * 24 * 60 * 60 * 1000
		  )
		: false;

	return (
		<div className="bg-white w-full h-full">
			{loading && <Spin fullscreen size="large" />}

			{!loading && event && (
				<>
					<div className="lg:flex hidden gap-[8px] py-[32px] px-[8px] items-center">
						<Image
							src="/assets/Icons/rows-01.svg"
							width={20}
							height={20}
							alt="Event"
							onClick={() =>
								router.push("/dashboard/agent/events")
							}
							className="cursor-pointer"
						/>
						<Image
							src="/assets/Icons/chevron-right.svg"
							width={20}
							height={20}
							alt="Event"
						/>
						<div className="font-semibold text-[#6941C6]">
							{event.name}
						</div>
					</div>

					<div className="relative w-full ">
						<Image
							src="/assets/images/static-bg.png"
							alt="Cover Picture"
							height={240}
							width={800}
							className="w-full h-[240px] object-cover"
						/>
						<div className="absolute lg:border-none top-72  pl-4 transform w-full -translate-y-1/2 flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
							<img
								src={
									event?.banner ||
									"/assets/images/placeholder-user.png"
								}
								alt="Event Logo"
								className="h-[160px] w-[160px]  aspect-square rounded-full object-cover"
							/>
							<div className="w-full flex flex-col lg:flex-row justify-between pe-4 ">
								<div>
									<h1 className="text-[24px] font-semibold text-[#181D27]">
										{event?.name || "ইভেন্টের নাম"}
									</h1>
									{event && (
										<p className="text-[16px] text-[#535862]">
											চালু হয়েছে{" "}
											{new Date(
												event.start_date
											).toLocaleDateString()}
										</p>
									)}
								</div>
								{!isExpired && (
									<button
										onClick={() =>
											router.push(
												`/dashboard/agent/events/${event?._id}/transaction`
											)
										}
										className="lg:ml-auto w-fit mt-4 lg:mt-0 px-4 py-2 h-fit bg-[#7F56D9] text-white rounded-lg font-semibold hover:bg-[#724dc2]"
									>
										ইনভেস্ট করুন
									</button>
								)}
							</div>
						</div>
					</div>

					<div className="px-4 py-6  border-t lg:border-none mt-[200px] lg:mt-[130px]">
						<h2 className="text-lg font-[500] text-[#181D27]">
							ইভেন্টের বিবরণ
						</h2>
						<p className="text-[#535862] text-[16px]">
							{event?.tagline}
						</p>
					</div>

					<div className="flex flex-col lg:flex-row gap-4 h-fit py-4 px-4">
						<div className="bg-[#FDFDFD] rounded-lg border border-[#E9EAEB] w-full">
							<h3 className="text-sm font-semibold text-gray-700 p-4">
								ROI
							</h3>
							<div className=" bg-white  w-full  border-t border-t-[#E9EAEB] rounded-lg">
								<p className="text-2xl font-bold text-gray-800 px-4">
									{event?.roi || 75}%
								</p>
								<ResponsiveContainer width="100%" height={150}>
									<LineChart data={getROIData()}>
										<XAxis dataKey="name" hide />
										<YAxis hide />
										<Tooltip />
										<Line
											type="monotone"
											dataKey="value"
											stroke="#8884d8"
											strokeWidth={2}
											dot={false}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>

						<div className="bg-[#FDFDFD] rounded-lg border border-[#E9EAEB] w-full">
							<h3 className="text-sm font-semibold text-gray-700 p-4">
								প্রত্যাশিত ফেরত{" "}
								<span className="text-[#535862] font-[500] text-[12px]">
									[সর্বনিম্ন ৳{event.minimum_deposit} টাকা{" "}
									{` `}
									{event.duration} মাসের বিনিয়োগে]
								</span>
							</h3>
							<div className=" bg-white px-4 w-full  border-t border-t-[#E9EAEB] rounded-lg">
								<div className="flex gap-4 mt-2">
									{event &&
										event.roi &&
										event.minimum_deposit && (
											<p className="text-2xl font-bold text-gray-800 mb-4">
												৳
												{(
													event.minimum_deposit *
														(event.roi / 100) *
														event.duration +
													event.minimum_deposit
												).toFixed(2)}
											</p>
										)}

									<div className="flex items-center  text-sm font-semibold mb-2">
										<span className="border flex gap-1 text-[#17B26A] px-2 py-1 rounded-lg">
											<Image
												src="/assets/Icons/arrow-up-right-green.svg"
												width={12}
												height={12}
												alt="Event"
											/>
											<span>
												{event.duration} মাস সময়
											</span>
										</span>
									</div>
								</div>
								<ResponsiveContainer width="100%" height={150}>
									<LineChart data={expectedReturnData}>
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Line
											type="monotone"
											dataKey="value"
											stroke="#8884d8"
											strokeWidth={2}
											dot={true}
										/>
									</LineChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
