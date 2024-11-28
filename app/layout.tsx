import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToasterProvider } from "@/components/Notification/ToasterProvider";
import { HeroHighlight } from "@/components/ui/hero-highlight";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = localFont({
	src: "./fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "./fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

export const metadata: Metadata = {
	title: "Hannan Trading",
	description: "Hannan Trading",
	icons: {
		icon: "/assets/logo-short.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<ClerkProvider
			signInFallbackRedirectUrl="/dashboard"
			signUpFallbackRedirectUrl="/dashboard"
			dynamic
		>
			<html lang="en">
				<body
					className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				>
					<HeroHighlight className="h-full w-full">
						<ToasterProvider />
						{children}
					</HeroHighlight>
				</body>
			</html>
		</ClerkProvider>
	);
}
