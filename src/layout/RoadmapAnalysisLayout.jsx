import { Outlet, useNavigate } from "react-router-dom";
import { showToast } from "../lib/toast";

export default function RoadmapAnalysisLayout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    return new Promise((resolve, reject) => {
      try {
        localStorage.removeItem("userToken");
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
    <div className="min-h-screen w-full flex flex-col bg-slate-950 text-white">
     
      <nav className="sticky top-0 z-50 bg-slate-900 shadow-md border-b border-slate-800 h-[73px] flex items-center px-8">
        <div className="flex justify-between items-center w-full">
        
          <h1 className="text-xl font-semibold text-blue-400">
            Roadmap Analysis
          </h1>

          <button
            onClick={() =>
              handleLogout()
                .then((message) => console.log(message))
                .catch((err) => console.error("Logout failed:", err))
            }
            className="text-gray-300 hover:text-red-400 font-medium transition-colors"
          >
            Log out
          </button>
        </div>
      </nav>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
