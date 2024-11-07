import Image from "next/image";
import Link from "next/link";

export default function GetStarted() {
	return (
		<div className="md:flex justify-between w-full py-[64px]">
			<div className="flex flex-col justify-center w-full">
				<div className="md:text-[3.75rem] text-4xl font-[500] tracking-[-1.2px] md:leading-[4.5rem]">
					We invest in the companies of the future, today, for us!
				</div>
				<div className="text-[#535862] text-[20px] mt-[24px]">
					— We&apos;re a full-service investment agency who specialise
					in simple and timeless profits.
				</div>
				<Link
					href="/login"
					className="bg-[#7F56D9] w-full text-center md:w-fit mt-[42px] hover:bg-[#734dc4] px-[18px] py-[12px] rounded-[8px] teaxt-[16px] font-semibold text-[#FFFFFF]"
				>
					Get Started
				</Link>
			</div>
			<div className="md:max-w-[560px] mt-[64px] md:mt-0 md::max-h-[640px]">
				<Image
					src="/assets/images/root/get_started.png"
					alt="Get Started"
					width={560}
					height={640}
					className="md:max-w-[560px] max-h-64 md:max-h-[640px] rounded-tr-[32px] md:rounded-tr-[64px] rounded-bl-[32px] md:rounded-bl-[64px] object-cover"
				/>
			</div>
		</div>
	);
}
