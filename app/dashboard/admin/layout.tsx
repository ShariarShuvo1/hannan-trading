import LeftPanel from "./LeftBar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="h-screen flex flex-col lg:flex-row">
			<LeftPanel />
			{children}
		</div>
	);
}
