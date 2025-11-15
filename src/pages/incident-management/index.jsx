import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaDownload } from "react-icons/fa";
import Button from "../../components/Button";

const options = [
    {
        label: "Admin Login",
        description: "Access the administrator dashboard to manage incidents and monitor system security",
        icon: <FaUserShield size={40} />, // Reduced size
        //path: "/incident-management/admin",
        path: "/incident-management/admin-login", // Changed path
        color: "from-blue-600 to-blue-800",
        bgColor: "bg-blue-50",
        iconColor: "text-blue-600"
    },
    {
        label: "Agent Install",
        description: "Download and deploy the monitoring agent for real-time incident detection",
        icon: <FaDownload size={40} />, // Reduced size
        path: "/incident-management/agent",
        color: "from-green-600 to-green-800",
        bgColor: "bg-green-50",
        iconColor: "text-green-600"
    }
];

export default function IncidentManagement() {
    const [selectedOption, setSelectedOption] = useState(null);
    const navigate = useNavigate();

    const handleOptionClick = (option) => {
        setSelectedOption(option.label);
    };

    const handleProceed = () => {
        if (selectedOption) {
            const option = options.find(opt => opt.label === selectedOption);
            if (option) {
                navigate(option.path);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-900 px-6 py-8"> {/* Reduced padding */}
            <div className="max-w-6xl mx-auto"> {/* Reduced max width */}
                {/* Header Section */}
                <div className="text-center mb-8"> {/* Reduced margin */}
                    <div className="inline-flex items-center gap-3 mb-4"> {/* Reduced margin */}
                        <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl text-white">🚨</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800"> {/* Reduced text size */}
                            AI Based Incident Management
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed"> {/* Reduced text size and width */}
                        Choose your access method to harness the power of AI-driven incident detection
                        and response capabilities for enhanced cybersecurity.
                    </p>
                </div>

                {/* Options Grid */}
                <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-4xl mx-auto"> {/* Reduced gap and margin */}
                    {options.map((option) => (
                        <div
                            key={option.label}
                            onClick={() => handleOptionClick(option)}
                            className={`cursor-pointer group relative overflow-hidden rounded-2xl p-6 border-2 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                                selectedOption === option.label
                                    ? `${option.bgColor} border-${option.iconColor.split('-')[1]}-500 shadow-2xl ${option.iconColor.split('-')[1]}-500 border-opacity-50`
                                    : `bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg`
                            }`}
                        >
                            {/* Icon */}
                            <div className={`mb-4 ${selectedOption === option.label ? option.iconColor : "text-gray-400"} transition-colors duration-300`}>
                                {option.icon}
                            </div>

                            {/* Content */}
                            <h3 className="text-xl font-bold mb-2 text-gray-800"> {/* Reduced text size */}
                                {option.label}
                            </h3>
                            <p className="text-gray-600 text-base leading-relaxed mb-4"> {/* Reduced text size */}
                                {option.description}
                            </p>

                            {/* Selection Indicator */}
                            {selectedOption === option.label && (
                                <div className="absolute top-4 right-4 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center shadow-lg"> {/* Reduced size */}
                                    <span className="text-xs text-white">✓</span> {/* Reduced text size */}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                
                {/* Proceed Section with selected text on top, button below */}
                {selectedOption && (
                    <div className="text-center flex flex-col items-center space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                            <span className="text-blue-600 font-medium text-lg">Selected: {selectedOption}</span>
                        </div>
                        <Button onClick={handleProceed} className="px-10 py-3 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transform hover:scale-105 transition-all duration-300 shadow-lg rounded-xl">
                            Proceed to {selectedOption}
                        </Button>
                    </div>
                )}

            </div>
        </div>
    );
}
