"use client";
import { useState } from "react";
import LeftColumn from "./LeftColumn";
import StepOne from "./StepOne";
import User from "@/interfaces/User";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

export default function Signup() {
	const [currentStep, setCurrentStep] = useState(0);
	const [user, setUser] = useState<User | null>(null);
	return (
		<div className="flex w-full h-screen">
			<LeftColumn currentStep={currentStep} />
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
		</div>
	);
}
