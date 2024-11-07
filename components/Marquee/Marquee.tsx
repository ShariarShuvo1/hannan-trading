"use client";
import Marquee from "react-fast-marquee";

type MarqueeProps = {
	text: string;
};

export default function CustomMarquee({ text }: MarqueeProps) {
	const colors = [
		"text-red-200",
		"text-blue-200",
		"text-green-200",
		"text-purple-200",
		"text-pink-200",
		"text-yellow-200",
		"text-indigo-200",
	];

	const getRandomColor = () =>
		colors[Math.floor(Math.random() * colors.length)];

	return (
		<Marquee loop={0} autoFill={true} className="bg-[#7F56D9] py-[11px]">
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
			<span
				className={`mx-4 font-insightMelody text-[28px] antialiased ${getRandomColor()}`}
			>
				{text}
			</span>
		</Marquee>
	);
}
