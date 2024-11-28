"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { Spin } from "antd";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
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

	if (isVerified === null) return <Spin size="large" fullscreen={true} />;

	return <>{children}</>;
};

export default ProtectedRoute;
