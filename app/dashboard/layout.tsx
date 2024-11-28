import ProtectedRoute from "./ProtectedRoute";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return <ProtectedRoute>{children}</ProtectedRoute>;
};

export default RootLayout;
