import Footer from "@/components/Footer/Footer";
import Navbar from "@/components/Navbar/Navbar";
import Image from "next/image";

export default function Home() {
	return (
		<div>
			<Navbar />
			<div className="px-64 mt-14">
				<Image
					src="/assets/home/1.png"
					alt="hero"
					width={1920}
					height={1080}
				/>
			</div>
			<div className="flex flex-col items-center m-1 gap-2  mt-8">
				<div className="flex gap-4 font-semibold">
					<input
						type="email"
						placeholder="Email"
						className="border w-full min-w-96 border-gray-400 p-2 rounded"
					/>
					<button className="bg-violet-600 w-full rounded text-white p-2">
						Get started
					</button>
				</div>
				<div className="flex gap-4 font-semibold text-violet-500">
					{" "}
					We care about your data in our privacy policy.
				</div>
			</div>
			<div className="px-64 my-14">
				<Image
					src="/assets/home/2.png"
					alt="hero"
					width={1920}
					height={1080}
				/>
			</div>
			<div className="px-64 my-14">
				<Image
					src="/assets/home/3.png"
					alt="hero"
					width={1920}
					height={1080}
				/>
			</div>
			<div className="px-64 my-14">
				<Image
					src="/assets/home/4.png"
					alt="hero"
					width={1920}
					height={1080}
				/>
			</div>
			<div className="px-64 my-14">
				<Image
					src="/assets/home/5.png"
					alt="hero"
					width={1920}
					height={1080}
				/>
			</div>
			<div className="px-64 my-14">
				<Image
					src="/assets/home/6.png"
					alt="hero"
					width={1920}
					height={1080}
				/>
			</div>
			<div className="px-64 my-14">
				<Image
					src="/assets/home/7.png"
					alt="hero"
					width={1920}
					height={1080}
				/>
			</div>
			<div className="px-64 my-14">
				<Image
					src="/assets/home/8.png"
					alt="hero"
					width={1920}
					height={1080}
				/>
			</div>

			<Footer />
		</div>
	);
}
