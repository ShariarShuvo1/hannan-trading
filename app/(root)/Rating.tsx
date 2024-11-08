"use client";
import CardMarquee from "@/components/CardMarquee/CardMarquee";
import Image from "next/image";

export default function Rating() {
	return (
		<div className="flex flex-col lg:flex-row select-none justify-between w-full py-[96px] gap-[64px]">
			<div className="w-full ">
				<CardMarquee />
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
