"use client";
import { useEffect, useState } from "react";
import LeftColumn from "./LeftColumn";
import StepOne from "./StepOne";
import User from "@/interfaces/User";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Signup() {
	const [currentStep, setCurrentStep] = useState(0);
	const [user, setUser] = useState<User | null>(null);
	const route = useRouter();
	const { isSignedIn, isLoaded } = useAuth();

	useEffect(() => {
		console.log("isSignedIn", isSignedIn);
		if (isSignedIn) {
			route.push("/dashboard");
		}
	}, [isSignedIn, isLoaded]);

	return (
		<div className="flex w-screen h-screen">
			<LeftColumn currentStep={currentStep} />
			<div className="w-full">
				{currentStep === 0 && (
					<StepOne
						user={user}
						setUser={setUser}
						currentStep={currentStep}
						setCurrentStep={setCurrentStep}
					/>
				)}
				{currentStep === 1 && (
					<StepTwo
						user={user}
						setUser={setUser}
						currentStep={currentStep}
						setCurrentStep={setCurrentStep}
					/>
				)}
				{currentStep === 2 && (
					<StepThree
						user={user}
						setUser={setUser}
						currentStep={currentStep}
						setCurrentStep={setCurrentStep}
					/>
				)}
				{currentStep === 3 && <StepFour user={user} />}
				{/* <StepFour user={user} /> */}
			</div>
		</div>
	);
}
