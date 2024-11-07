import Footer from "@/components/Footer/Footer";
import Marquee from "@/components/Marquee/Marquee";
import Navbar from "@/components/Navbar/Navbar";
import GetStarted from "./(root)/GetStarted";
import Master from "./(root)/Master";
import Rating from "./(root)/Rating";
import Profit from "./(root)/Profit";
import Agency from "./(root)/Agency";
import Contact from "./(root)/Contact";

export default function Home() {
	return (
		<div className="w-full">
			<div className="overflow-auto hidden lg:block max-w-[99vw]">
				<Marquee text="Hannan Trading" />
			</div>
			<Navbar />
			<div className="px-[112px]">
				<GetStarted />
				<Master />
				<hr />
				<Rating />
				<Profit />
				<Agency />
				<Contact />
			</div>
			<Footer />
		</div>
	);
}
