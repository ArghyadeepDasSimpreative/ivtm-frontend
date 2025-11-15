import { Link, Outlet, useNavigate } from "react-router-dom";
import { showToast } from "../lib/toast";

export default function IncidentManagementLayout() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        return new Promise((resolve, reject) => {
            try {
                localStorage.removeItem("userToken");
                localStorage.removeItem("userDetails");
                showToast.success("Logged out successfully.");
                navigate("/signin");
                resolve("Logged out successfully");
            } catch (error) {
                showToast.error("Failed to log out.");
                reject(error);
            }
        });
    };
    
    return (
        <div className="min-h-screen w-full flex flex-col bg-gray-50">
            <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200 h-[73px] flex items-center px-8">
                <div className="flex justify-between items-center w-full">
                    <h1 className="text-xl font-semibold text-blue-700">AI based Incident Management</h1>

                    <div className="flex items-center space-x-6">
                        <Link
                            to="/roadmap-analysis"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Home
                        </Link>
                        <Link
                            to="/incident-management"
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                        >
                            Dashboard
                        </Link>
                        <button
                            onClick={() =>
                                handleLogout()
                                    .then((message) => console.log(message))
                                    .catch((err) => console.error("Logout failed:", err))
                            }
                            className="text-gray-700 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </nav>
            <main className="flex-1 p-6">
                <Outlet />
            </main>
        </div>
    );
}
