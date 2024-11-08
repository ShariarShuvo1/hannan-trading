"use client";
import Marquee from "react-fast-marquee";

interface RatingProps {
	quote: string;
	name: string;
	title: string;
}

const rating_list: RatingProps[] = [
	{
		quote: "Untitled helped us at every step of the process setting up our new office.",
		name: "Sienna Hewitt",
		title: "Project Manager, Warpspeed",
	},
	{
		quote: "The team clearly explained the process and helped us get started.",
		name: "Kian Duffy",
		title: "CEO, Warpspeed",
	},
	{
		quote: "We are very happy with the results and would recommend them to others.",
		name: "Jasmin Mccoy",
		title: "Project Manager, Warpspeed",
	},
];

export default function CardMarquee() {
	return (
		<Marquee loop={0} autoFill={false} className="h-full">
			<div className="h-full flex justify-center items-center">
				{rating_list.map((rating, index) => (
					<div
						key={index}
						className="mx-4 bg-slate-800 flex flex-col h-full justify-between max-w-64 p-4 rounded-lg antialiased"
					>
						<p className="text-white text-lg mb-12 font-semibold">
							{rating.quote}
						</p>
						<div>
							<p className="text-gray-300 font-sm">
								{rating.name}
							</p>
							<p className="text-gray-300 font-sm">
								{rating.title}
							</p>
						</div>
					</div>
				))}
			</div>
		</Marquee>
	);
}
