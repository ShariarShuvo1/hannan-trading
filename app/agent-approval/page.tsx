import { Hourglass } from "lucide-react";

export default function ApprovalPendingPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 sm:px-6">
			<div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
				<div className="flex items-center justify-center mb-4">
					<Hourglass className="text-yellow-500 w-12 h-12 sm:w-16 sm:h-16 animate-pulse" />
				</div>
				<h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
					অনুমোদনের জন্য <br /> অপেক্ষা করুন
				</h1>
				<p className="text-gray-700 leading-relaxed mb-6 text-sm sm:text-base">
					নিবন্ধনের জন্য ধন্যবাদ! আপনার অ্যাকাউন্ট বর্তমানে আমাদের
					অ্যাডমিন টিম দ্বারা পর্যালোচনার অধীনে রয়েছে। আপনার
					অ্যাকাউন্ট অনুমোদিত হলে আপনি একটি নোটিফিকেশন পাবেন।
				</p>
				<p className="text-sm sm:text-base text-gray-500">
					যদি আপনার কোনো প্রশ্ন থাকে, আমাদের সাপোর্ট টিমের সাথে
					যোগাযোগ করুন। আমরা আপনার ধৈর্যের জন্য কৃতজ্ঞ।
				</p>
				<div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full blur-xl opacity-30 transform -translate-x-4 -translate-y-4" />
				<div className="absolute bottom-0 right-0 w-20 h-20 sm:w-28 sm:h-28 bg-red-100 rounded-full blur-2xl opacity-30 transform translate-x-6 translate-y-6" />
			</div>
		</div>
	);
}
