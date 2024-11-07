import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import Image from "next/image";

export default function Master() {
	return (
		<div className="flex flex-col gap-[64px] py-[96px]">
			<div className="flex flex-col gap-[12px] mb-[40px]">
				<div className="flex flex-col gap-[12px]">
					<div className="font-semibold text-[#6941C6] leading-[24px]">
						The Owner!
					</div>
					<div className="font-semibold text-[36px] leading-[44px]">
						<TextGenerateEffect words="Meet the Master Mind!" />
					</div>
				</div>
				<div className="text-[20px] text-[#535862] leading-[30px]">
					<TextGenerateEffect words="I am a person full of potentiality with 100% trust for you!" />
				</div>
			</div>
			<div className="flex flex-col lg:flex-row justify-between items-end w-full gap-[64px]">
				<div className="flex flex-col justify-center w-full">
					<div className="flex flex-col gap-[32px]">
						<div className="flex flex-col">
							<hr className="mb-[32px]" />
							<div className="flex flex-col md:flex-row gap-2">
								<div className="font-semibold text-[20px] text-[#181D27] leading-[24px]">
									Md. Abdul Hannan Miaji
								</div>
								<div className="flex w-fit  gap-2 py-[2px] px-[10px] bg-[#EFF8FF] rounded-full text-[#175CD3] items-center border border-[#2E90FA]">
									<div className="min-h-[8px] max-h-[8px] min-w-[8px] max-w-[8px] bg-[#2E90FA] rounded-full"></div>
									<div className="text[14px] font-[500]">
										Name
									</div>
								</div>
							</div>
							<div className="text-[16px] text-[#535862] leading-[30px]">
								I am Md. Abdul Hannan Miaji, the founder born on
								07-09-2000
							</div>
						</div>
						<div className="flex flex-col">
							<hr className="mb-[32px]" />
							<div className="flex flex-col md:flex-row gap-2">
								<div className="font-semibold text-[20px] text-[#181D27] leading-[24px]">
									Late Abu Salek
								</div>
								<div className="flex w-fit  gap-2 py-[2px] px-[10px] bg-[#FDF2FA] rounded-full text-[#C11574] items-center border border-[#FCCEEE]">
									<div className="min-h-[8px] max-h-[8px] min-w-[8px] max-w-[8px] bg-[#EE46BC] rounded-full"></div>
									<div className="text[14px] font-[500]">
										Father
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col">
							<hr className="mb-[32px]" />
							<div className="flex flex-col md:flex-row gap-2">
								<div className="font-semibold text-[20px] text-[#181D27] leading-[24px]">
									Mst. Tasrin Begum
								</div>
								<div className="flex w-fit  gap-2 py-[2px] px-[10px] bg-[#FDF2FA] rounded-full text-[#B93815] items-center border border-[#F9DBAF]">
									<div className="min-h-[8px] max-h-[8px] min-w-[8px] max-w-[8px] bg-[#EF6820] rounded-full"></div>
									<div className="text[14px] font-[500]">
										Mother
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col">
							<hr className="mb-[32px]" />
							<div className="flex flex-col md:flex-row gap-2">
								<div className="flex flex-col gap-2">
									<div className="font-semibold text-[20px] text-[#181D27] leading-[24px]">
										House- Shomod Ali Maji bari, village-
										Kedarkhil,
									</div>
									<div className="font-semibold text-[20px] text-[#181D27] leading-[24px]">
										P.O- Jafar Nagar, P.S- Sitakunda,
										District Chattogram
									</div>
								</div>
								<div className="flex w-fit  gap-2 h-fit py-[2px] px-[10px] bg-[#EEF4FF] rounded-full text-[#3538CD] items-center border border-[#C7D7FE]">
									<div className="min-h-[8px] max-h-[8px] min-w-[8px] max-w-[8px] bg-[#6172F3] rounded-full"></div>
									<div className="text[14px] font-[500]">
										Address
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col">
							<hr className="mb-[32px]" />
							<div className="flex flex-col md:flex-row gap-2">
								<div className="font-semibold text-[20px] text-[#181D27] leading-[24px]">
									1032855478
								</div>
								<div className="flex w-fit  gap-2 py-[2px] px-[10px] bg-[#ECFDF3] rounded-full text-[#067647] items-center border border-[#ABEFC6]">
									<div className="min-h-[8px] max-h-[8px] min-w-[8px] max-w-[8px] bg-[#17B26A] rounded-full"></div>
									<div className="text[14px] font-[500]">
										NID
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col">
							<hr className="mb-[32px]" />
							<div className="flex flex-col md:flex-row gap-2">
								<div className="font-semibold text-[20px] text-[#181D27] leading-[24px]">
									@hannantrading.org
								</div>
								<div className="flex w-fit  gap-2 py-[2px] px-[10px] bg-[#EEF4FF] rounded-full text-[#004EEB] items-center border border-[#C7D7FE]">
									<div className="min-h-[8px] max-h-[8px] min-w-[8px] max-w-[8px] bg-[#6172F3] rounded-full"></div>
									<div className="text[14px] font-[500]">
										Email
									</div>
								</div>
							</div>
						</div>
						<div className="flex flex-col">
							<hr className="mb-[32px]" />
							<div className="flex flex-col md:flex-row gap-2">
								<div className="font-semibold text-[20px] text-[#181D27] leading-[24px]">
									+880-**********
								</div>
								<div className="flex w-fit gap-2 py-[2px] px-[10px] bg-[#FDF4FF] rounded-full text-[#9F1AB1] items-center border border-[#F6D0FE]">
									<div className="min-h-[8px] max-h-[8px] min-w-[8px] max-w-[8px] bg-[#D444F1] rounded-full"></div>
									<div className="text[14px] font-[500]">
										Phone
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="max-w-[560px] max-h-[640px]">
					<img
						src="/assets/images/root/master.png"
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
