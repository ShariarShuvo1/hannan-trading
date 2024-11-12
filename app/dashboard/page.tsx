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
			console.log(role);
			if (role.includes("admin")) {
				router.push("/dashboard/admin/events");
			}
		}
	}, [isLoaded, user]);
	if (!isLoaded) return <Spin fullscreen size="large" />;
	return <div className="flex">Hey</div>;
}
