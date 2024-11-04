import { CldUploadWidget } from "next-cloudinary";
import { Plus } from "lucide-react";

interface ImageUploadProps {
	onChange: (value: string) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange }) => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const onUpload = (result: any) => {
		onChange(result.info.secure_url);
	};

	return (
		<div className="w-full">
			<CldUploadWidget uploadPreset="x3grukq5" onSuccess={onUpload}>
				{({ open }) => {
					return (
						<button
							type="button"
							onClick={() => open()}
							className="w-full flex items-center justify-center gap-2 rounded-md p-2 bg-gray-200 hover:bg-gray-300 transition-colors"
						>
							<Plus className="h-4 w-4 mr-2" />
							Upload Image
						</button>
					);
				}}
			</CldUploadWidget>
		</div>
	);
};

export default ImageUpload;
