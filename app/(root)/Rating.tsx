"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface RatingProps {
	title: string;
	name: string;
	designation: string;
	picture: string;
	star: number;
}

const rating_list: RatingProps[] = [
	{
		title: "Untitled helped us at every step of the process setting up our new office.",
		name: "Sienna Hewitt",
		designation: "Project Manager, Warpspeed",
		picture: "/assets/images/root/Avatar.png",
		star: 5,
	},
	{
		title: "The team clearly explained the process and helped us get started.",
		name: "Kian Duffy",
		designation: "CEO, Warpspeed",
		picture: "/assets/images/root/Avatar2.png",
		star: 4,
	},
	{
		title: "We are very happy with the results and would recommend them to others.",
		name: "Jasmin Mccoy",
		designation: "Project Manager, Warpspeed",
		picture: "/assets/images/root/Avatar3.png",
		star: 5,
	},
];

export default function Rating() {
	const [active, setActive] = useState(0);
	const [currentRating, setCurrentRating] = useState(rating_list[active]);

	useEffect(() => {
		setCurrentRating(rating_list[active]);
	}, [active]);

	return (
		<div className="flex flex-col lg:flex-row select-none justify-between w-full py-[96px] gap-[64px]">
			<div className="flex flex-col gap-[48px] justify-center">
				<div className="flex gap-[4px]">
					{[...Array(currentRating.star)].map((_, index) => (
						<Image
							key={index}
							src="/assets/images/root/Star.svg"
							alt="Star"
							width={20}
							height={20}
						/>
					))}
				</div>
				<div className="text-[48px] font-[500]">
					{currentRating.title}
				</div>
				<div className="flex flex-col gap-6 lg:gap-0 lg:flex-row justify-between lg:items-center">
					<div className="flex gap-[16px]">
						<Image
							src={currentRating.picture}
							alt={currentRating.name}
							width={56}
							height={56}
							className="rounded-full"
						/>
						<div className="flex flex-col ">
							<div className="text-[18px] h-full text-[#181D27] font-[600]">
								{currentRating.name}
							</div>
							<div className="text-[16px] h-full text-[#535862]">
								{currentRating.designation}
							</div>
						</div>
					</div>
					<div className="flex lg:justify-between gap-[32px]">
						<div
							onClick={() => {
								if (active > 0) {
									setActive(active - 1);
								}
							}}
							className="w-[56px] h-[56px] border hover:bg-white cursor-pointer rounded-full flex items-center justify-center"
						>
							<Image
								src="/assets/images/root/arrow-left.svg"
								alt="left"
								width={24}
								height={24}
							/>
						</div>
						<div
							onClick={() => {
								if (active < rating_list.length - 1) {
									setActive(active + 1);
								}
							}}
							className="w-[56px] h-[56px] border hover:bg-white cursor-pointer rounded-full flex items-center justify-center"
						>
							<Image
								src="/assets/images/root/arrow-right.svg"
								alt="right"
								width={24}
								height={24}
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="max-w-[560px] max-h-[640px]">
				<Image
					src="/assets/images/root/collage.png"
					alt="Get Started"
					width={560}
					height={640}
					className="md:max-w-[560px] md:max-h-[640px] object-cover"
				/>
			</div>
		</div>
	);
}
