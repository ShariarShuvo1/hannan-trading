"use client";
import { useUser } from "@clerk/nextjs";
import { Spin } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
	const router = useRouter();
	const { user, isLoaded } = useUser();
	useEffect(() => {
		if (isLoaded && user) {
			const role = user.publicMetadata.role as string[];
			if (role.includes("admin")) {
				router.push("/dashboard/admin/home");
			} else if (role.includes("user")) {
				router.push("/dashboard/agent/home");
			}
		}
	}, [isLoaded, user]);
	if (!isLoaded) return <Spin fullscreen size="large" />;
}
