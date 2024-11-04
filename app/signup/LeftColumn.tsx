import Image from "next/image";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { StepIconProps } from "@mui/material/StepIcon";
import { styled } from "@mui/material/styles";

const ColorlibStepIconRoot = styled("div")<{
	ownerState: { completed?: boolean; active?: boolean };
}>(({ theme }) => ({
	backgroundColor: "white",
	zIndex: 1,
	color: "#fff",
	width: 48,
	height: 48,
	display: "flex",
	borderRadius: "10px",
	justifyContent: "center",
	alignItems: "center",
	opacity: 0.6,
	border: "1px solid #c7c8c9",
	variants: [
		{
			props: ({ ownerState }) => ownerState.active,
			style: {
				padding: 12,
				color: "#fff",
				opacity: 1,
				border: "1px solid #c7c8c9",
			},
		},
	],
}));

function ColorlibStepIcon(props: StepIconProps) {
	const { active, completed, className } = props;

	const icons: { [index: string]: React.ReactElement<unknown> } = {
		1: (
			<Image
				src="/assets/Icons/progress-steps-user-01.svg"
				width={24}
				height={24}
				alt="user"
			/>
		),
		2: (
			<Image
				src="/assets/Icons/progress-steps-passcode.svg"
				width={24}
				height={24}
				alt="user"
			/>
		),
		3: (
			<Image
				src="/assets/Icons/progress-steps-users-plus.svg"
				width={24}
				height={24}
				alt="user"
			/>
		),
		4: (
			<Image
				src="/assets/Icons/progress-steps-stars-02.svg"
				width={24}
				height={24}
				alt="user"
			/>
		),
	};

	return (
		<ColorlibStepIconRoot
			ownerState={{ completed, active }}
			className={className}
		>
			{icons[String(props.icon)]}
		</ColorlibStepIconRoot>
	);
}

export default function LeftColumn({ currentStep }: { currentStep: number }) {
	const steps = [
		{
			title: "Your details",
			description: "Please provide your name and email",
		},
		{
			title: "Choose a password",
			description: "Choose a secure password",
		},
		{
			title: "NID & Bank Details",
			description: "Provide your NID card number and Bank Details",
		},
		{
			title: "Add your photo",
			description: "Upload your personal photo",
		},
	];
	return (
		<div className="flex p-[2rem] flex-col justify-between h-full bg-[#E9EAEB] max-w-[27.5rem] w-full">
			<div className=" flex flex-col space-y-[5rem] justify-between">
				<Image
					src="assets/logo.svg"
					width={150}
					height={43}
					alt="logo"
				/>
				<Stepper activeStep={currentStep} orientation="vertical">
					{steps.map((item, index) => (
						<Step key={index}>
							<StepLabel StepIconComponent={ColorlibStepIcon}>
								<div
									className={`text-[#414651] font-semibold ${
										currentStep !== index && "opacity-60"
									}`}
								>
									{item.title}
								</div>
								<div
									className={`text-[#535862] ${
										currentStep !== index && "opacity-60"
									}`}
								>
									{item.description}
								</div>
							</StepLabel>
						</Step>
					))}
				</Stepper>
			</div>
			<div className="flex justify-between w-full">
				<div>© Hannan Trading</div>
				<div>help@hannantrading.org</div>
			</div>
		</div>
	);
}
