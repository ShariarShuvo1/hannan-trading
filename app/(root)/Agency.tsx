import Image from "next/image";
import Link from "next/link";

export default function GetStarted() {
	return (
		<div className="flex justify-between items-center w-full py-[96px] gap-[64px]">
			<div className="flex flex-col justify-center">
				<div className="font-semibold text-[#6941C6] leading-[24px]">
					Our Agency
				</div>
				<div className="flex flex-col gap-[48px]">
					<div className="text-[#181D27] font-semibold text-[36px] ">
						Design that influences how people work, learn, live and
						experience the world.
					</div>
					<div className="text-[#535862] text-[18px] ">
						Mi tincidunt elit, id quisque ligula ac diam, amet. Vel
						etiam suspendisse morbi eleifend faucibus eget
						vestibulum felis. Dictum quis montes, sit sit. Tellus
						aliquam enim urna, etiam.
						<br />
						<br />
						Dolor enim eu tortor urna sed duis nulla. Aliquam
						vestibulum, nulla odio nisl vitae. In aliquet
						pellentesque aenean hac vestibulum turpis mi bibendum
						diam. Tempor integer aliquam in vitae malesuada.
						<br />
						<br />
						Elit nisi in eleifend sed nisi. Pulvinar at orci, proin
						imperdiet commodo consectetur convallis risus. Sed
						condimentum enim dignissim adipiscing faucibus
						consequat, urna. Viverra purus et erat auctor aliquam.
						Risus, volutpat vulputate posuere purus sit congue
						convallis aliquet.
						<br />
						<br />
						Ipsum sit mattis nulla quam nulla. Gravida id gravida ac
						enim mauris id. Non pellentesque congue eget consectetur
						turpis. Sapien, dictum molestie sem tempor. Diam elit,
						orci, tincidunt aenean.
					</div>
					<div className="flex gap-[12px]">
						<Link
							href="/"
							className="bg-white hover:bg-gray-100 px-[18px] py-[12px] rounded-[8px] teaxt-[16px] font-semibold text-[#414651] border border-[#D5D7DA]"
						>
							Get in touch
						</Link>
						<Link
							href="/"
							className="bg-[#7F56D9] hover:bg-[#734dc4] px-[18px] py-[12px] rounded-[8px] teaxt-[16px] font-semibold text-[#FFFFFF]"
						>
							Our process
						</Link>
					</div>
				</div>
			</div>

			<div className="max-w-[560px] max-h-[640px]">
				<Image
					src="/assets/images/root/agency.png"
					alt="Get Started"
					width={560}
					height={640}
					className="max-w-[560px] max-h-[640px] object-cover"
				/>
			</div>
		</div>
	);
}
