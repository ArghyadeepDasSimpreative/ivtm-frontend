import { useState, useEffect } from "react";
import { privateRequest } from "../../../api/config";
import InputField from "../../../components/Input";
import CustomSelect from "../../../components/Select";
import { MdContentCopy, MdCheck } from "react-icons/md";
import { showToast } from "../../../lib/toast";
import Button from "../../../components/Button";

const CreateUser = ({ showUsers }) => {
    const [formData, setFormData] = useState({
        businessEmail: "",
        phoneNumber: "",
        username: "",
        defaultPassword: "",
        role: ""
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [copied, setCopied] = useState(false);

    // Generate random password
    const generateRandomPassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    // Initialize password on component mount
    useEffect(() => {
        setFormData(prev => ({
            ...prev,
            defaultPassword: generateRandomPassword()
        }));
    }, []);

    // Copy password to clipboard
    const copyPassword = async () => {
        try {
            await navigator.clipboard.writeText(formData.defaultPassword);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy password:', err);
        }
    };

    // Role options - only editor and viewer can be added
    const roleOptions = [
        { key: "editor", label: "Editor" },
        { key: "viewer", label: "Viewer" }
    ];

    const roleConfig = {
        key: "key",
        label: "label"
    };

    const validateForm = () => {
        const newErrors = {};

        // Email validation
        if (!formData.businessEmail) {
            newErrors.businessEmail = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.businessEmail)) {
            newErrors.businessEmail = "Please enter a valid email address";
        }

        // Phone validation
        if (!formData.phoneNumber) {
            newErrors.phoneNumber = "Phone number is required";
        } else if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\s/g, ""))) {
            newErrors.phoneNumber = "Please enter a valid 10-digit phone number";
        }

        // Username validation
        if (!formData.username) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters long";
        }

        // Password validation
        if (!formData.defaultPassword) {
            newErrors.defaultPassword = "Default password is required";
        }

        // Role validation
        if (!formData.role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ""
            }));
        }
    };

    const handleRoleSelect = (selectedOption) => {
        setFormData(prev => ({
            ...prev,
            role: selectedOption?.value || ""
        }));

        // Clear role error when user selects
        if (errors.role) {
            setErrors(prev => ({
                ...prev,
                role: ""
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError("");

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const payload = {
                businessEmail: formData.businessEmail.trim(),
                phoneNumber: formData.phoneNumber.replace(/\s/g, ""),
                username: formData.username.trim(),
                defaultPassword: formData.defaultPassword,
                role: formData.role
            };

            const response = await privateRequest.post("/organisation-user/create-user", payload);
            showToast.success("User created successfully");
            
            // Reset form
            setFormData({
                businessEmail: "",
                phoneNumber: "",
                username: "",
                defaultPassword: generateRandomPassword(),
                role: ""
            });
            setErrors({});
            showUsers();

        } catch (err) {
            console.error("Error creating user:", err);
            
            if (err.response?.data?.message) {
                setApiError(err.response.data.message);
            } else if (err.response?.status === 400) {
                setApiError("Invalid data provided. Please check your inputs.");
            } else if (err.response?.status === 409) {
                setApiError("User with this email or username already exists.");
            } else {
                setApiError("Failed to create user. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    // const handleCancel = () => {
    //     // Reset form
    //     setFormData({
    //         businessEmail: "",
    //         phoneNumber: "",
    //         username: "",
    //         defaultPassword: generateRandomPassword(),
    //         role: ""
    //     });
    //     setErrors({});
    //     setApiError("");
    // };

    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Create New User</h2>
                <p className="text-gray-600 text-md">Add a new user to your organization</p>
            </div>

            {apiError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{apiError}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* First Row - Email and Phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Business Email"
                        type="email"
                        value={formData.businessEmail}
                        onChange={handleInputChange("businessEmail")}
                        placeholder="Enter business email"
                        error={errors.businessEmail}
                    />

                    <InputField
                        label="Phone Number"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={handleInputChange("phoneNumber")}
                        placeholder="Enter 10-digit phone number"
                        error={errors.phoneNumber}
                    />
                </div>

                {/* Second Row - Username and Role */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField
                        label="Username"
                        type="text"
                        value={formData.username}
                        onChange={handleInputChange("username")}
                        placeholder="Enter username"
                        error={errors.username}
                    />

                    <div>
                        <CustomSelect
                            data={roleOptions}
                            config={roleConfig}
                            label="User Role"
                            onSelect={handleRoleSelect}
                            defaultValue={formData.role ? { value: formData.role, label: formData.role.charAt(0).toUpperCase() + formData.role.slice(1) } : null}
                            width="100%"
                            style="light"
                        />
                        {errors.role && (
                            <p className="text-red-500 text-md mt-1 ml-1">{errors.role}</p>
                        )}
                    </div>
                </div>

                {/* Third Row - Password (Full Width) */}
                <div className="w-full">
                    <label className="block text-md text-gray-600 mb-2">Default Password</label>
                    <div className="relative w-full max-w-md">
                        <input
                            type="text"
                            value={formData.defaultPassword}
                            readOnly
                            className="w-full px-3 py-2 pr-12 border border-gray-300 rounded-md text-lg bg-gray-50 focus:outline-none cursor-not-allowed"
                        />
                        <button
                            type="button"
                            onClick={copyPassword}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
                            title="Copy password"
                        >
                            {copied ? (
                                <MdCheck size={20} className="text-green-600" />
                            ) : (
                                <MdContentCopy size={20} />
                            )}
                        </button>
                    </div>
                    {copied && (
                        <p className="text-green-600 text-sm mt-1">Password copied to clipboard!</p>
                    )}
                    {errors.defaultPassword && (
                        <p className="text-red-500 text-md mt-1">{errors.defaultPassword}</p>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6">
                    <Button loading={isLoading} onClick={handleSubmit}>Save User</Button> 
                </div>
            </form>
        </div>
    );
};

export default CreateUser;