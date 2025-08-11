import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { privateRequest } from "../../api/config";
import UserManagement from "./users";
import CreateUser from "./users/Create";
import { FiMenu, FiX } from "react-icons/fi";
import defaultUserImage from "../../assets/default-user-image.png"
import { FaEdit } from "react-icons/fa";
import { useRef } from "react";

const ProfilePage = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [activeTab, setActiveTab] = useState("profile");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const buttonsData = [{
        label: "Edit Profile",
        onClick: () => {
            setActiveTab("profile");
            setSidebarOpen(false); // Close sidebar on mobile after selection
        }
    },
    {
        label: "User Management",
        onClick: () => {
            setActiveTab("management");
            setSidebarOpen(false); // Close sidebar on mobile after selection
        }
    }];

    const getUserDetails = async () => {
        try {
            const response = await privateRequest.get("/organisation-user/details");
            console.log(response.data);
            setUserDetails(response.data);
        } catch (err) {
            setErrorMessage(err?.response?.data?.message || "Failed to fetch user details");
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    const getTabTitle = () => {
        switch (activeTab) {
            case "profile":
                return "Edit Profile";
            case "management":
                return "User Management";
            case "create-user":
                return "Create New User";
            default:
                return "Profile";
        }
    };

    return (
        <div className="min-h-screen">
            {/* Mobile Header with Menu Button */}
            <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 p-4 sticky top-0 z-50">
                <div className="flex items-center justify-between">
                    <h1 className="text-lg font-semibold text-gray-800">{getTabTitle()}</h1>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-md cursor-pointer text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                        {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
                    </button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-6 lg:p-6">
                {/* Mobile Overlay */}
                {sidebarOpen && (
                    <div
                        className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Left Panel - Sidebar */}
                <div className={`
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:relative lg:w-1/4
                    fixed top-0 left-0 h-full w-80 max-w-[80vw]
                    bg-white shadow-lg lg:shadow-md
                    p-4 lg:p-6 
                    border-r lg:border lg:border-slate-300 lg:rounded-xl
                    lg:h-fit lg:max-h-[600px]
                    transition-transform duration-300 ease-in-out
                    z-50 lg:z-auto
                    overflow-y-auto
                `}>
                    {/* Mobile close button */}
                    <div className="lg:hidden flex justify-end mb-4">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                        >
                            <FiX size={20} />
                        </button>
                    </div>

                    {pageLoading ? (
                        <div className="space-y-4 lg:space-y-6">
                            <div className="flex flex-col items-center">
                                <Skeleton circle height={80} width={80} className="lg:!h-24 lg:!w-24" />
                                <Skeleton height={24} width={120} className="mt-2" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton height={40} width="100%" />
                                <Skeleton height={40} width="100%" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="relative w-20 h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32">
                                <img
                                    src={userDetails.profileImageUrl || defaultUserImage}
                                    className="border border-slate-300 rounded-full object-cover w-full h-full"
                                    alt="Profile"
                                />
                                <button
                                    className="absolute -bottom-3 right-3 bg-slate-200 hover:bg-slate-300 transition-all duration-300 border border-gray-400 rounded-full p-2 shadow cursor-pointer"
                                >
                                    <FaEdit />
                                </button>
                            </div>

                            <h2 className="text-md lg:text-lg font-semibold mb-3 lg:mb-4 text-center break-words mt-4">
                                {userDetails.username}
                            </h2>
                            <p>{userDetails.email}</p>
                            <div className="flex flex-col gap-2 lg:gap-3 w-full">
                                {buttonsData.map((button, index) => (
                                    <button
                                        key={index}
                                        className={`
                                            font-semibold text-sm lg:text-base transition-all duration-300 
                                            cursor-pointer px-3 lg:px-4 py-2 lg:py-3 rounded-md w-full
                                            ${activeTab === (index === 0 ? "profile" : ("management" || "create-user"))
                                                ? "bg-blue-600 text-white"
                                                : "bg-blue-100 text-blue-950 hover:bg-blue-200"
                                            }
                                        `}
                                        onClick={button.onClick}
                                    >
                                        {button.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Panel - Main Content */}
                <div className="flex-1 lg:w-3/4 bg-white shadow-sm lg:shadow-md p-4 lg:p-6 lg:border lg:border-slate-300 lg:rounded-xl min-h-[calc(100vh-80px)] lg:min-h-fit">
                    {/* Desktop Title */}
                    <div className="hidden lg:block mb-6">
                        <h1 className="text-xl font-bold text-gray-800">{getTabTitle()}</h1>
                    </div>

                    {pageLoading ? (
                        <div className="space-y-4 lg:space-y-8">
                            <Skeleton height={40} width="60%" className="lg:!h-12" />
                            <Skeleton height={200} width="100%" className="lg:!h-48" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Skeleton height={120} width="100%" />
                                <Skeleton height={120} width="100%" />
                            </div>
                            <Skeleton height={300} width="100%" />
                        </div>
                    ) : (
                        <div className="w-full">
                            {activeTab === "profile" && (
                                <div className="space-y-6">
                                    <div className="text-center lg:text-left">
                                        <h2 className="text-lg lg:text-xl font-semibold text-gray-800 mb-2">
                                            Profile Information
                                        </h2>
                                        <p className="text-gray-600">Manage your account settings and preferences</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-700 mb-2">Email</h3>
                                            <p className="text-gray-900 break-all">{userDetails.businessEmail}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-700 mb-2">Phone</h3>
                                            <p className="text-gray-900">{userDetails.phoneNumber}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-700 mb-2">Organization</h3>
                                            <p className="text-gray-900">{userDetails.organisationName}</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h3 className="font-medium text-gray-700 mb-2">Role</h3>
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                                                {userDetails.role}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "management" && (
                                <UserManagement openUserAddModal={() => setActiveTab("create-user")} />
                            )}

                            {activeTab === "create-user" && (
                                <div>
                                    {/* Back button for mobile */}
                                    <div className="lg:hidden mb-4">
                                        <button
                                            onClick={() => setActiveTab("management")}
                                            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                            Back to User Management
                                        </button>
                                    </div>
                                    <CreateUser showUsers={() => setActiveTab("management")} />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;