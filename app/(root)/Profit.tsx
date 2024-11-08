"use client";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function Profit() {
	const { ref, inView } = useInView({
		triggerOnce: true,
		threshold: 0.1,
	});
	return (
		<div className="flex flex-col gap-[64px] py-[96px]">
			<div ref={ref} hidden={inView}></div>
			{inView && (
				<div className="flex flex-col gap-[12px]">
					<div className="flex flex-col gap-[12px]">
						<div className="font-semibold text-[#6941C6] leading-[24px]">
							Our process
						</div>
						<div className="font-semibold text-[36px] leading-[44px]">
							<TextGenerateEffect words="Creating memorable profitts" />
						</div>
					</div>
					<div className="text-[20px] text-[#535862] leading-[30px]">
						<TextGenerateEffect words="We design physical experiences that create more happy in the world." />
					</div>
				</div>
			)}

			<div className="flex flex-col md:flex-row md:justify-between items-center w-full gap-y-4 md:gap-y-0">
				{inView && (
					<div className="flex flex-col gap-[64px]">
						<div className="flex flex-col md:flex-row justify-center w-full gap-[32px]">
							<div className="flex flex-col items-center">
								<div className="font-semibold text-[60px] text-[#7F56D9]">
									<CountUp duration={4} end={400} />+
								</div>
								<div className="font-semibold text-[18px] text-[#181D27]">
									Investments completed
								</div>
								<div className=" text-[16px] max-w-[264px] text-center text-[#535862]">
									We&apos;ve invested over 400 amazing
									projects nationwide.
								</div>
							</div>
							<div className="flex flex-col items-center">
								<div className="font-semibold text-[60px] text-[#7F56D9]">
									<CountUp duration={4} end={600} />%
								</div>
								<div className="font-semibold text-[18px] text-[#181D27]">
									Return on investment
								</div>
								<div className=" text-[16px] max-w-[264px] text-center text-[#535862]">
									Our customers have reported an average of
									~600% ROI.
								</div>
							</div>
						</div>
						<div className="flex flex-col md:flex-row justify-center w-full gap-[32px]">
							<div className="flex flex-col items-center">
								<div className="font-semibold text-[60px] text-[#7F56D9]">
									<CountUp duration={4} end={50} />+
								</div>
								<div className="font-semibold text-[18px] text-[#181D27]">
									Global members
								</div>
								<div className=" text-[16px] max-w-[264px] text-center text-[#535862]">
									Our free UI kit has been downloaded over 10k
									times.
								</div>
							</div>
							<div className="flex flex-col items-center">
								<div className="font-semibold text-[60px] text-[#7F56D9]">
									<CountUp duration={4} end={48} />+
								</div>
								<div className="font-semibold text-[18px] text-[#181D27]">
									5-star reviews
								</div>
								<div className=" text-[16px] max-w-[264px] text-center text-[#535862]">
									We&apos;re proud of our 5-star rating with
									over 48 reviews.
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="max-w-[560px] max-h-[640px]">
					<Image
						src="/assets/images/root/profit.png"
						alt="Get Started"
						width={560}
						height={640}
						className="md:max-w-[560px] md:max-h-[640px] object-cover"
					/>
				</div>
			</div>
		</div>
	);
}
