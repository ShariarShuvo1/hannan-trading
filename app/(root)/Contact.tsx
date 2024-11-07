"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";

export default function Contact() {
	return (
		<div className="flex flex-col gap-[64px] py-[96px] w-full">
			<hr />
			<div className="flex flex-col md:flex-row gap-12 md:gap-0 justify-between">
				<div className="flex flex-col gap-[12px]">
					<div className="flex flex-col gap-[12px]">
						<div className="font-semibold text-[#6941C6] leading-[24px]">
							Contact us
						</div>
						<div className="font-semibold text-[36px] leading-[44px]">
							<TextGenerateEffect words="Chat to our friendly team" />
						</div>
					</div>
					<div className="text-[20px] text-[#535862] leading-[30px]">
						<TextGenerateEffect words="We'd love to hear from you! Please get in touch." />
					</div>
				</div>
				<div className="flex flex-col gap-[32px]">
					<div className="flex gap-[16px] items-start">
						<Image
							src="/assets/images/root/marker-pin-02.svg"
							alt="GPS ICON"
							width={24}
							height={24}
						/>
						<div className="flex flex-col">
							<div className="font-semibold text-[#181D27] text-[20px]">
								Melbourne
							</div>
							<div className="text-[#535862] text-[16px]">
								100 Flinders Street, Melbourne VIC 3000 AU
							</div>
						</div>
					</div>
					<div className="flex gap-[16px] items-start">
						<Image
							src="/assets/images/root/marker-pin-02.svg"
							alt="GPS ICON"
							width={24}
							height={24}
						/>
						<div className="flex flex-col">
							<div className="font-semibold text-[#181D27] text-[20px]">
								Sydney
							</div>
							<div className="text-[#535862] text-[16px]">
								100 George Street, Sydney NSW 2000 AU
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="w-full">
				<img
					src="/assets/images/root/contact.jpg"
					alt="Get Started"
					className="object-cover w-full h-[600px]"
				/>
			</div>
		</div>
	);
}
