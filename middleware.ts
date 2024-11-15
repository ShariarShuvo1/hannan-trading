import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isAdminRoute = createRouteMatcher([
	"/dashboard/admin(.*)",
	"/api/admin(.*)",
]);

const isPublicRoute = createRouteMatcher([
	"/login(.*)",
	"/signup(.*)",
	"/forgot-password(.*)",
	"/",
	"/api(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
	const session: any = await auth();
	const include_admin =
		session?.sessionClaims?.metadata?.role?.includes("admin");
	if (isAdminRoute(request) && !include_admin) {
		const url = new URL("/", request.url);
		return NextResponse.redirect(url);
	}
	if (!isPublicRoute(request)) {
		await auth.protect();
	}
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
		// Always run for API routes
		"/(api|trpc)(.*)",
	],
};
