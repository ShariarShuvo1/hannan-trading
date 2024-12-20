"use client";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
	const router = useRouter();
	const [isVerified, setIsVerified] = useState<boolean | null>(null);
	const { user, isLoaded, isSignedIn } = useUser();

	useEffect(() => {
		const checkAdminAccess = async () => {
			if (!isLoaded) return;
			if (!isSignedIn) {
				router.push("/login");
				return;
			}
			const clerkId = user.id;

			try {
				const response = await fetch("/api/agent/agent-approval", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ clerkId }),
				});

				const data = await response.json();

				if (response.ok) {
					if (!data.admin_verified) {
						router.push("/agent-approval");
					}
					setIsVerified(data.admin_verified);
				} else {
					toast.error(data.message);
				}
			} catch (error) {
				toast.error("Internal server error");
			}
		};

		checkAdminAccess();
	}, [router, isLoaded, isSignedIn, user]);

	useEffect(() => {
		if (isLoaded && user && isSignedIn && isVerified) {
			const role = user.publicMetadata.role as string[];
			if (role.includes("admin")) {
				router.push("/dashboard/admin/home");
			} else if (role.includes("user")) {
				router.push("/dashboard/agent/home");
			}
		}
	}, [isLoaded, user, isSignedIn, isVerified]);
	if (!isLoaded) return <Spin fullscreen size="large" />;
}
